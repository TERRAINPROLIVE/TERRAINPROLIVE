from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import re
import math
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuidh
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
import httpx

import anthropic
import stripe


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

stripe.api_key = STRIPE_API_KEY

anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

app = FastAPI(title="Tradesman AI Quoting API")
api_router = APIRouter(prefix="/api")


# ============================================================================
# Models
# ============================================================================
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class QuoteRequest(BaseModel):
    job_type: Literal[
        "earthmoving",
        "concreting",
        "landscaping",
        "retaining_wall",
        "driveway",
        "excavation",
    ]
    description: str = Field(..., min_length=10, max_length=2000)
    area_sqm: float = Field(..., gt=0, le=100000)
    timeline_days: int = Field(..., ge=1, le=365)
    location: str = Field(default="Australia", max_length=120)
    materials: List[str] = Field(default_factory=list)
    complexity: Literal["low", "medium", "high"] = "medium"


class LineItem(BaseModel):
    scope: Optional[str] = None  # job_type id (e.g., "slab", "retaining_wall")
    label: str
    detail: str
    qty: float
    unit: str
    unit_cost: float
    total: float


class CustomerInfo(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=40)
    email: Optional[EmailStr] = None
    address: str = Field(..., min_length=4, max_length=240)


class BusinessInfo(BaseModel):
    name: Optional[str] = Field(default=None, max_length=120)
    abn: Optional[str] = Field(default=None, max_length=40)
    address: str = Field(..., min_length=2, max_length=240)
    suburb: Optional[str] = Field(default=None, max_length=120)
    state: Optional[str] = Field(default=None, max_length=20)
    postcode: Optional[str] = Field(default=None, max_length=10)


class JobScope(BaseModel):
    job_type: str = Field(..., min_length=2, max_length=60)
    trade: Optional[str] = None
    label: Optional[str] = None
    measurements: dict = Field(default_factory=dict)


class MultiQuoteRequest(BaseModel):
    customer: CustomerInfo
    business: Optional[BusinessInfo] = None
    scopes: List[JobScope] = Field(..., min_length=1, max_length=12)
    complexity: Literal["low", "medium", "high"] = "medium"
    notes: Optional[str] = Field(default=None, max_length=2000)
    labour_rate: Optional[float] = Field(default=None, ge=0, le=1000)


class QuoteResponse(BaseModel):
    id: str
    job_type: str
    summary: str
    line_items: List[LineItem]
    labor_total: float
    materials_total: float
    contingency_total: float
    subtotal: float
    gst: float
    total_low: float
    total_high: float
    timeline_estimate: str
    confidence: Literal["low", "medium", "high"]
    assumptions: List[str]
    next_steps: List[str]
    generated_at: datetime
    customer: Optional[CustomerInfo] = None
    scopes: List[JobScope] = Field(default_factory=list)


class WaitlistCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    trade: Optional[str] = None


class WaitlistEntry(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    trade: Optional[str] = None
    created_at: datetime


# ============================================================================
# Routes
# ============================================================================
@api_router.get("/")
async def root():
    return {"message": "Tradesman AI Quoting API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check.get('timestamp'), str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


SYSTEM_PROMPT = """You are TERRAINPRO-AI, a senior estimator with 20+ years on the tools across landscaping, earthmoving, and concreting in Australia. You produce realistic, defensible job estimates in AUD.

You ALWAYS respond with STRICT VALID JSON ONLY — no prose, no markdown fences, no commentary. The JSON object must match this exact schema:

{
  "summary": "string (1-2 sentence punchy job summary, plain English, tradie tone)",
  "line_items": [
    {
      "label": "string (e.g., 'Excavation - bulk earthworks')",
      "detail": "string (specifics, dimensions, plant)",
      "qty": number,
      "unit": "string (m2, m3, hrs, day, ea, t, lm)",
      "unit_cost": number (AUD, exclusive of GST),
      "total": number (qty * unit_cost, AUD)
    }
  ],
  "labor_total": number,
  "materials_total": number,
  "contingency_total": number (~8-12% of subtotal for medium complexity),
  "subtotal": number (labor + materials + contingency),
  "gst": number (10% of subtotal, Australian GST),
  "total_low": number (subtotal + gst - 8%),
  "total_high": number (subtotal + gst + 12%),
  "timeline_estimate": "string (e.g., '3-5 working days on site, 2 days curing')",
  "confidence": "low | medium | high",
  "assumptions": ["string", "string", ...],
  "next_steps": ["string", "string", ...]
}

Rules:
- 5 to 8 line_items covering: site prep, plant hire, labor crews, materials (e.g., 32MPa concrete, road base, geo fabric, mulch, pavers), spoil removal, finishing.
- Use realistic AUD rates: skilled tradie labour $85-$120/hr, concrete $280-$340/m3 supplied, excavator hire $750-$1100/day, tipper $180-$220/hr.
- Calculations must be internally consistent (totals = qty * unit_cost; subtotal = labor + materials + contingency).
- Round monetary values to whole dollars.
- Adapt detail to job_type: earthmoving leans plant + spoil; concreting leans mix + reo + finishing; landscaping leans softscape + hardscape.
- 3-5 assumptions (site access, soil class, council approvals, weather, exclusions).
- 3 next_steps (site visit, soil test, formal contract, etc.).
- NO markdown. NO trailing commas. NO explanatory text outside JSON.
"""


def _extract_json(text: str) -> dict:
    """Robustly extract a JSON object from an LLM response."""
    text = text.strip()
    # Strip code fences if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    # Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Find the largest {...} block
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        return json.loads(match.group(0))
    raise ValueError("Model did not return valid JSON")


@api_router.post("/quote/generate", response_model=QuoteResponse)
async def generate_quote(req: QuoteRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")

    quote_id = str(uuid.uuid4())
    user_payload = {
        "job_type": req.job_type,
        "description": req.description,
        "area_sqm": req.area_sqm,
        "timeline_days_requested": req.timeline_days,
        "location": req.location,
        "materials_provided": req.materials,
        "complexity": req.complexity,
    }

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"quote-{quote_id}",
        system_message=SYSTEM_PROMPT,
    ).with_model("openai", "gpt-5.2")

    user_msg = UserMessage(
        text=(
            "Generate a detailed AUD quote for the following job. Respond with JSON only.\n\n"
            f"Job details:\n{json.dumps(user_payload, indent=2)}"
        )
    )

    try:
        raw = await chat.send_message(user_msg)
        data = _extract_json(raw if isinstance(raw, str) else str(raw))
    except Exception as e:
        logging.exception("LLM call failed")
        raise HTTPException(status_code=502, detail=f"AI estimator failed: {e}")

    try:
        line_items = [LineItem(**li) for li in data.get("line_items", [])]
        response = QuoteResponse(
            id=quote_id,
            job_type=req.job_type,
            summary=data.get("summary", ""),
            line_items=line_items,
            labor_total=float(data.get("labor_total", 0)),
            materials_total=float(data.get("materials_total", 0)),
            contingency_total=float(data.get("contingency_total", 0)),
            subtotal=float(data.get("subtotal", 0)),
            gst=float(data.get("gst", 0)),
            total_low=float(data.get("total_low", 0)),
            total_high=float(data.get("total_high", 0)),
            timeline_estimate=data.get("timeline_estimate", ""),
            confidence=data.get("confidence", "medium"),
            assumptions=data.get("assumptions", []),
            next_steps=data.get("next_steps", []),
            generated_at=datetime.now(timezone.utc),
        )
    except Exception as e:
        logging.exception("Failed to parse model output: %s", data)
        raise HTTPException(status_code=502, detail=f"Malformed AI output: {e}")

    # Persist quote
    doc = response.model_dump()
    doc['generated_at'] = doc['generated_at'].isoformat()
    doc['request'] = req.model_dump()
    await db.quotes.insert_one(doc)

    return response


MULTI_SYSTEM_PROMPT = """You are TERRAINPRO-AI, a senior estimator with 20+ years on the tools across landscaping, earthmoving and concreting in Australia. You produce realistic, defensible job estimates in AUD across multiple scopes for a single customer.

You ALWAYS respond with STRICT VALID JSON ONLY — no prose, no markdown fences, no commentary. The JSON object must match this exact schema:

{
  "summary": "string (2-3 sentence punchy summary covering all scopes, tradie tone)",
  "line_items": [
    {
      "scope": "string (job_type id, e.g., 'slab', 'retaining_wall', 'bulk_earthworks')",
      "label": "string",
      "detail": "string",
      "qty": number,
      "unit": "string (m2, m3, hrs, day, ea, t, lm)",
      "unit_cost": number (AUD ex GST),
      "total": number
    }
  ],
  "labor_total": number,
  "materials_total": number,
  "contingency_total": number (8-12% of subtotal for medium complexity),
  "subtotal": number,
  "gst": number (10% of subtotal),
  "total_low": number,
  "total_high": number,
  "timeline_estimate": "string",
  "confidence": "low | medium | high",
  "assumptions": ["string", ...],
  "next_steps": ["string", ...]
}

Rules:
- Cover EVERY scope provided. Group line items by scope (use the scope field with the job_type id from the input).
- Each scope should have 3-6 line items. Total line items target: 6-20 across all scopes.
- Use realistic Australian rates (AUD ex GST): skilled labour $85-$120/hr, concrete 32MPa $300-$340/m³ supplied, excavator hire $750-$1100/day, tipper $180-$220/hr, road base $55-$75/m³ supplied, retaining concrete sleepers $55-$90/lm (0.6m high), buffalo turf $14-$18/m² supplied+laid, colorbond fencing $90-$130/lm installed.
- Adapt to soil class, access, finish, reinforcement, materials provided.
- Internal math must be consistent (totals = qty * unit_cost; subtotal = labor + materials + contingency; gst = 10% of subtotal).
- Round to whole dollars.
- 4-6 assumptions (site access, soil class, council/permits, weather, exclusions).
- 3 next_steps (site visit, soil test, formal contract).
- NO markdown. NO trailing commas.
"""


@api_router.post("/quote/multi-generate", response_model=QuoteResponse)
async def multi_generate_quote(req: MultiQuoteRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")

    quote_id = str(uuid.uuid4())
    payload = {
        "business": req.business.model_dump() if req.business else None,
        "customer": req.customer.model_dump(),
        "scopes": [s.model_dump() for s in req.scopes],
        "complexity": req.complexity,
        "notes": req.notes,
        "labour_rate_aud_per_hour": req.labour_rate,
    }

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"quote-multi-{quote_id}",
        system_message=MULTI_SYSTEM_PROMPT,
    ).with_model("openai", "gpt-5.2")

    rate_instruction = (
        f"IMPORTANT: This tradie's own labour rate is AUD ${req.labour_rate:.0f}/hr ex GST. "
        "Use THIS rate for all labour/crew line items (unit 'hrs' or 'day' = rate x 8) instead of generic defaults, "
        "and keep the labour_total consistent with it.\n\n"
        if req.labour_rate
        else ""
    )

    user_msg = UserMessage(
        text=(
            "Generate a consolidated AUD quote for the following customer covering ALL scopes. "
            "Group line_items by scope using the job_type id. Factor in travel from the business "
            "address to the customer's job site if both are provided. Respond with JSON only.\n\n"
            + rate_instruction
            + f"Brief:\n{json.dumps(payload, indent=2, default=str)}"
        )
    )

    try:
        raw = await chat.send_message(user_msg)
        data = _extract_json(raw if isinstance(raw, str) else str(raw))
    except Exception as e:
        logging.exception("Multi-quote LLM call failed")
        raise HTTPException(status_code=502, detail=f"AI estimator failed: {e}")

    try:
        line_items = [LineItem(**li) for li in data.get("line_items", [])]
        response = QuoteResponse(
            id=quote_id,
            job_type="multi",
            summary=data.get("summary", ""),
            line_items=line_items,
            labor_total=float(data.get("labor_total", 0)),
            materials_total=float(data.get("materials_total", 0)),
            contingency_total=float(data.get("contingency_total", 0)),
            subtotal=float(data.get("subtotal", 0)),
            gst=float(data.get("gst", 0)),
            total_low=float(data.get("total_low", 0)),
            total_high=float(data.get("total_high", 0)),
            timeline_estimate=data.get("timeline_estimate", ""),
            confidence=data.get("confidence", "medium"),
            assumptions=data.get("assumptions", []),
            next_steps=data.get("next_steps", []),
            generated_at=datetime.now(timezone.utc),
            customer=req.customer,
            scopes=req.scopes,
        )
    except Exception as e:
        logging.exception("Failed to parse multi-quote output: %s", data)
        raise HTTPException(status_code=502, detail=f"Malformed AI output: {e}")

    doc = response.model_dump()
    doc['generated_at'] = doc['generated_at'].isoformat()
    doc['request'] = req.model_dump()
    await db.quotes.insert_one(doc)

    return response


@api_router.post("/waitlist", response_model=WaitlistEntry)
async def join_waitlist(entry: WaitlistCreate):
    existing = await db.waitlist.find_one({"email": entry.email.lower()})
    if existing:
        return WaitlistEntry(
            id=existing["id"],
            email=existing["email"],
            name=existing.get("name"),
            trade=existing.get("trade"),
            created_at=datetime.fromisoformat(existing["created_at"])
            if isinstance(existing.get("created_at"), str)
            else existing.get("created_at", datetime.now(timezone.utc)),
        )

    doc = {
        "id": str(uuid.uuid4()),
        "email": entry.email.lower(),
        "name": entry.name,
        "trade": entry.trade,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.waitlist.insert_one(doc)
    return WaitlistEntry(
        id=doc["id"],
        email=doc["email"],
        name=doc["name"],
        trade=doc["trade"],
        created_at=datetime.fromisoformat(doc["created_at"]),
    )


@api_router.get("/waitlist/count")
async def waitlist_count():
    count = await db.waitlist.count_documents({})
    return {"count": count}


# ============================================================================
# User Signup (free-trial gate)
# ============================================================================
class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=6, max_length=40)
    email: EmailStr
    abn: str = Field(..., min_length=4, max_length=40)


class SignupResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: str
    abn: str
    created_at: datetime
    is_new: bool


@api_router.post("/signup", response_model=SignupResponse)
async def signup(req: SignupRequest):
    email_lower = req.email.lower()
    existing = await db.users.find_one({"email": email_lower})
    if existing:
        return SignupResponse(
            id=existing["id"],
            name=existing.get("name", req.name),
            phone=existing.get("phone", req.phone),
            email=existing["email"],
            abn=existing.get("abn", req.abn),
            created_at=(
                datetime.fromisoformat(existing["created_at"])
                if isinstance(existing.get("created_at"), str)
                else existing.get("created_at", datetime.now(timezone.utc))
            ),
            is_new=False,
        )

    doc = {
        "id": str(uuid.uuid4()),
        "name": req.name.strip(),
        "phone": req.phone.strip(),
        "email": email_lower,
        "abn": req.abn.strip().replace(" ", ""),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    return SignupResponse(
        id=doc["id"],
        name=doc["name"],
        phone=doc["phone"],
        email=doc["email"],
        abn=doc["abn"],
        created_at=datetime.fromisoformat(doc["created_at"]),
        is_new=True,
    )


# ============================================================================
# Chatbot
# ============================================================================
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    session_id: str = Field(..., min_length=4, max_length=80)
    messages: List[ChatMessage] = Field(..., min_length=1, max_length=40)


class ChatResponse(BaseModel):
    reply: str
    session_id: str


CHAT_SYSTEM_PROMPT = """You are TERRAINPRO HELPER — an AI assistant on the TerrainPRO landing page.

WHO YOU HELP: Australian tradies running earthmoving, concreting and landscaping crews who are evaluating TerrainPRO.

WHAT YOU DO:
- Answer questions about TerrainPRO: AI quoting, line-item quotes in AUD, materials/plant/labour pricing, mobile-first workflow, PDF export, Xero/MYOB integration, pricing tiers (Sole Trader $0, Crew $79/mo, Contractor custom).
- Help with trade questions: "how much concrete for a 60m² slab?", "what mesh for a shed slab?", "rough excavator cost per day?", "spoil disposal rates?", etc. Use real Australian rates and units.
- Recommend local smoko spots when asked — name 2-3 well-known bakeries / cafés / pie shops near the suburb the user mentions (or ask which suburb if they haven't said). Be honest that you can't guarantee opening hours; suggest a quick search to confirm.
- Nudge them to try the AI Quote Estimator (link them by saying "hit the YOU READY menu or scroll up to the estimator").

TONE & STYLE:
- Aussie tradie voice: direct, no fluff, no corporate jargon. Light bit of dry humour is fine — never overdone.
- KEEP REPLIES TIGHT: 2-4 short sentences unless the question demands more. Use line breaks for lists.
- AUD only. Metric only. AUD GST = 10% inclusive.
- If you genuinely don't know, say so and suggest contacting the crew via the Contact link in the YOU READY menu.

DO NOT:
- Pretend to be a human.
- Promise pricing accuracy beyond ~94% of final invoice.
- Make up Australian standards numbers — give realistic ballparks.
- Discuss politics, personal advice, or unrelated trades.
"""


@api_router.post("/chat/message", response_model=ChatResponse)
async def chat_message(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")
    if req.messages[-1].role != "user":
        raise HTTPException(status_code=400, detail="Last message must be from user")

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"chat-{req.session_id}",
        system_message=CHAT_SYSTEM_PROMPT,
    ).with_model("openai", "gpt-5.2")

    # Stateless: pass the whole conversation as one user message for context.
    convo_lines = []
    for m in req.messages[:-1]:
        tag = "USER" if m.role == "user" else "ASSISTANT"
        convo_lines.append(f"{tag}: {m.content}")
    latest = req.messages[-1].content

    if convo_lines:
        prompt = (
            "Prior conversation so far:\n"
            + "\n".join(convo_lines)
            + f"\n\nCurrent USER message:\n{latest}\n\n"
            "Reply directly as TERRAINPRO HELPER. Do not prefix your reply with 'ASSISTANT:' or any role label."
        )
    else:
        prompt = latest

    try:
        raw = await chat.send_message(UserMessage(text=prompt))
        reply = raw if isinstance(raw, str) else str(raw)
        # Strip any accidental role prefix
        for prefix in ("ASSISTANT:", "Assistant:", "assistant:"):
            if reply.lstrip().startswith(prefix):
                reply = reply.lstrip()[len(prefix):].lstrip()
                break
    except Exception as e:
        logging.exception("Chat LLM call failed")
        raise HTTPException(status_code=502, detail=f"Chat failed: {e}")

    # Persist (light-touch logging)
    await db.chat_messages.insert_one({
        "session_id": req.session_id,
        "user_message": latest,
        "assistant_reply": reply,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return ChatResponse(reply=reply, session_id=req.session_id)


# ============================================================================
# Nearby Suppliers (free: Photon by Komoot — no API key required)
# ============================================================================
USER_AGENT = "TerrainPRO-AI/1.0 (https://terrainpro.com.au)"
PHOTON_URL = "https://photon.komoot.io/api/"

# (category_id, display_label, query keywords)
SUPPLIER_CATEGORIES = [
    ("bunnings", "Bunnings Warehouse", ["Bunnings"]),
    ("mitre10", "Mitre 10", ["Mitre 10"]),
    ("reece", "Reece Plumbing", ["Reece Plumbing", "Reece"]),
    ("landscape", "Landscape Supplies", ["landscape supplies", "soil supplies", "ANL"]),
    ("nursery", "Nursery / Garden Centre", ["nursery", "garden centre"]),
]


class Supplier(BaseModel):
    category: str
    name: str
    address: Optional[str] = None
    distance_km: float
    lat: float
    lng: float
    phone: Optional[str] = None
    website: Optional[str] = None
    maps_url: str


class SuppliersResponse(BaseModel):
    origin_label: str
    origin_lat: float
    origin_lng: float
    radius_km: float
    cached: bool
    suppliers: List[Supplier]


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    from math import radians, sin, cos, asin, sqrt
    r = 6371.0
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return 2 * r * asin(sqrt(a))


async def _photon(client: httpx.AsyncClient, q: str, lat: Optional[float] = None,
                  lng: Optional[float] = None, limit: int = 10):
    params = {"q": q, "limit": limit, "lang": "en"}
    if lat is not None and lng is not None:
        params["lat"] = lat
        params["lon"] = lng
        params["location_bias_scale"] = 0.5
    r = await client.get(
        PHOTON_URL,
        params=params,
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )
    r.raise_for_status()
    return r.json().get("features", [])


async def _geocode_origin(client: httpx.AsyncClient, suburb: str, state: str,
                          postcode: str):
    """Geocode a suburb robustly — prefer city/town/village, skip airports/POIs."""
    queries = [
        ", ".join(p for p in [suburb, state, postcode, "Australia"] if p),
        ", ".join(p for p in [suburb, state, "Australia"] if p),
        f"{suburb}, Australia",
    ]
    PLACE_KINDS = {"city", "town", "village", "suburb", "hamlet", "locality", "neighbourhood"}
    seen_urls = set()
    for q in queries:
        features = await _photon(client, q, limit=10)
        # First pass: prefer proper place results
        for f in features:
            props = f.get("properties") or {}
            if (props.get("countrycode") or "").upper() != "AU":
                continue
            if state and props.get("state") and state.upper() not in (props.get("state") or "").upper()[:30]:
                # only enforce state match when state was provided and looks unrelated
                continue
            if props.get("osm_value") in PLACE_KINDS:
                return _to_origin(f)
            # cache fallbacks
            seen_urls.add(id(f))
        # Second pass on this query: any AU result matching suburb name
        for f in features:
            props = f.get("properties") or {}
            if (props.get("countrycode") or "").upper() != "AU":
                continue
            name = (props.get("name") or "").lower()
            if "airport" in name or "station" in name:
                continue
            return _to_origin(f)
    return None


def _to_origin(feature: dict):
    geom = feature.get("geometry") or {}
    coords = geom.get("coordinates") or []
    if len(coords) < 2:
        return None
    props = feature.get("properties") or {}
    label = ", ".join(
        p for p in [
            props.get("name"),
            props.get("state"),
            props.get("postcode"),
            props.get("country"),
        ] if p
    )
    return {"lat": coords[1], "lng": coords[0], "label": label}


def _feature_to_supplier(feature: dict, category: str, origin_lat: float,
                         origin_lng: float) -> Optional[Supplier]:
    props = feature.get("properties") or {}
    geom = feature.get("geometry") or {}
    coords = geom.get("coordinates") or []
    if len(coords) < 2:
        return None
    lng, lat = coords[0], coords[1]
    name = props.get("name")
    if not name:
        return None
    # Skip if it's just a locality (city, state, country, region) without an actual venue
    if props.get("osm_value") in ("city", "town", "village", "suburb", "state", "country", "region"):
        return None

    street_parts = [props.get("housenumber"), props.get("street")]
    street = " ".join(p for p in street_parts if p).strip()
    locality_parts = [props.get("city") or props.get("suburb") or "",
                      props.get("state") or "",
                      props.get("postcode") or ""]
    locality = " ".join(p for p in locality_parts if p).strip()
    address = ", ".join(p for p in [street, locality] if p) or None
    distance = _haversine_km(origin_lat, origin_lng, lat, lng)

    return Supplier(
        category=category,
        name=name,
        address=address,
        distance_km=round(distance, 1),
        lat=lat,
        lng=lng,
        phone=None,  # Photon doesn't return phone
        website=None,
        maps_url=f"https://www.google.com/maps/search/?api=1&query={lat},{lng}",
    )


@api_router.get("/suppliers/nearby", response_model=SuppliersResponse)
async def suppliers_nearby(
    suburb: str,
    state: str,
    postcode: Optional[str] = "",
    radius_km: int = 30,
    refresh: bool = False,
):
    radius_km = max(5, min(80, radius_km))
    cache_key = f"{suburb.strip().lower()}|{state.strip().upper()}|{(postcode or '').strip()}|{radius_km}"

    if not refresh:
        cached = await db.supplier_cache.find_one({"_id": cache_key})
        if cached:
            cached_at = cached.get("cached_at")
            if isinstance(cached_at, str):
                cached_at = datetime.fromisoformat(cached_at)
            if cached_at and datetime.now(timezone.utc) - cached_at < timedelta(days=7):
                return SuppliersResponse(
                    origin_label=cached["origin_label"],
                    origin_lat=cached["origin_lat"],
                    origin_lng=cached["origin_lng"],
                    radius_km=radius_km,
                    cached=True,
                    suppliers=[Supplier(**s) for s in cached["suppliers"]],
                )

    async with httpx.AsyncClient() as client:
        origin = await _geocode_origin(client, suburb, state, postcode or "")
        if not origin:
            raise HTTPException(
                status_code=404,
                detail=f"Couldn't geocode '{suburb}, {state} {postcode}'",
            )
        origin_lat = origin["lat"]
        origin_lng = origin["lng"]
        origin_label = origin["label"]

        suppliers: List[Supplier] = []
        seen = set()

        for cat_id, _label, queries in SUPPLIER_CATEGORIES:
            for q in queries:
                features = await _photon(client, q, lat=origin_lat, lng=origin_lng, limit=15)
                for f in features:
                    s = _feature_to_supplier(f, cat_id, origin_lat, origin_lng)
                    if not s:
                        continue
                    fp = f.get("properties") or {}
                    if (fp.get("countrycode") or "").upper() != "AU":
                        continue
                    if s.distance_km > radius_km:
                        continue
                    dedup_key = (cat_id, s.name.strip().lower(), round(s.lat, 4), round(s.lng, 4))
                    if dedup_key in seen:
                        continue
                    seen.add(dedup_key)
                    suppliers.append(s)

    cat_order = {c[0]: i for i, c in enumerate(SUPPLIER_CATEGORIES)}
    suppliers.sort(key=lambda s: (cat_order.get(s.category, 99), s.distance_km))
    trimmed: List[Supplier] = []
    per_cat = {}
    for s in suppliers:
        per_cat.setdefault(s.category, 0)
        if per_cat[s.category] < 3:
            trimmed.append(s)
            per_cat[s.category] += 1

    payload = {
        "_id": cache_key,
        "origin_label": origin_label,
        "origin_lat": origin_lat,
        "origin_lng": origin_lng,
        "radius_km": radius_km,
        "suppliers": [s.model_dump() for s in trimmed],
        "cached_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.supplier_cache.replace_one({"_id": cache_key}, payload, upsert=True)

    return SuppliersResponse(
        origin_label=origin_label,
        origin_lat=origin_lat,
        origin_lng=origin_lng,
        radius_km=radius_km,
        cached=False,
        suppliers=trimmed,
    )


# ============================================================================
# Authentication — JWT email/password + 7-day trial
# ============================================================================
JWT_ALGORITHM = "HS256"
TRIAL_DAYS = 7
TOKEN_TTL_DAYS = 7


def _jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(days=TOKEN_TTL_DAYS),
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def _parse_dt(value) -> Optional[datetime]:
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    if isinstance(value, str):
        try:
            dt = datetime.fromisoformat(value)
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except ValueError:
            return None
    return None


def _public_user(doc: dict) -> dict:
    """Shape a user document for client consumption, with live trial + subscription status."""
    now = datetime.now(timezone.utc)
    expires = _parse_dt(doc.get("trial_expires_at"))
    trial_active = bool(expires and now < expires)
    if expires:
        remaining_seconds = (expires - now).total_seconds()
        days_remaining = max(0, math.ceil(remaining_seconds / 86400)) if remaining_seconds > 0 else 0
    else:
        days_remaining = 0

    sub_expires = _parse_dt(doc.get("subscription_expires_at"))
    subscription_active = bool(sub_expires and now < sub_expires)
    sub_days_remaining = (
        max(0, math.ceil((sub_expires - now).total_seconds() / 86400))
        if subscription_active else 0
    )

    return {
        "id": doc["id"],
        "name": doc.get("name"),
        "phone": doc.get("phone"),
        "email": doc.get("email"),
        "hourly_rate": doc.get("hourly_rate"),
        "abn": doc.get("abn"),
        "business_name": doc.get("business_name"),
        "trial_expires_at": doc.get("trial_expires_at"),
        "trial_active": trial_active,
        "days_remaining": days_remaining,
        "subscription_active": subscription_active,
        "subscription_plan": doc.get("subscription_plan"),
        "subscription_expires_at": doc.get("subscription_expires_at"),
        "subscription_days_remaining": sub_days_remaining,
        "access_active": trial_active or subscription_active,
        "created_at": doc.get("created_at"),
    }


async def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"id": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    user.pop("_id", None)
    return user


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=6, max_length=40)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class AuthResponse(BaseModel):
    token: str
    user: dict


@api_router.post("/auth/register", response_model=AuthResponse)
async def auth_register(req: RegisterRequest):
    email_lower = req.email.lower().strip()
    existing = await db.users.find_one({"email": email_lower})
    if existing and existing.get("password_hash"):
        raise HTTPException(status_code=409, detail="Email already registered. Please log in.")

    now = datetime.now(timezone.utc)
    trial_expires = now + timedelta(days=TRIAL_DAYS)
    doc = {
        "id": existing["id"] if existing else str(uuid.uuid4()),
        "name": req.name.strip(),
        "phone": req.phone.strip(),
        "email": email_lower,
        "password_hash": hash_password(req.password),
        "trial_started_at": now.isoformat(),
        "trial_expires_at": trial_expires.isoformat(),
        "email_verified": False,
        "created_at": (existing.get("created_at") if existing else now.isoformat()),
    }
    if existing:
        await db.users.update_one({"id": existing["id"]}, {"$set": doc})
    else:
        await db.users.insert_one(doc)

    token = create_access_token(doc["id"], email_lower)
    return AuthResponse(token=token, user=_public_user(doc))


@api_router.post("/auth/login", response_model=AuthResponse)
async def auth_login(req: LoginRequest):
    email_lower = req.email.lower().strip()
    user = await db.users.find_one({"email": email_lower})
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email_lower)
    return AuthResponse(token=token, user=_public_user(user))


@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    return _public_user(user)


class ProfileUpdate(BaseModel):
    hourly_rate: Optional[float] = Field(default=None, ge=0, le=1000)
    abn: Optional[str] = Field(default=None, max_length=40)
    business_name: Optional[str] = Field(default=None, max_length=120)


@api_router.put("/auth/profile")
async def update_profile(req: ProfileUpdate, user: dict = Depends(get_current_user)):
    updates = {}
    if req.hourly_rate is not None:
        updates["hourly_rate"] = round(float(req.hourly_rate), 2)
    if req.abn is not None:
        updates["abn"] = req.abn.strip()
    if req.business_name is not None:
        updates["business_name"] = req.business_name.strip()
    if updates:
        await db.users.update_one({"id": user["id"]}, {"$set": updates})
        user = {**user, **updates}
    return _public_user(user)


class SaveQuoteRequest(BaseModel):
    quote: dict
    customer: dict
    scope_summary: Optional[str] = Field(default=None, max_length=400)


@api_router.post("/quotes")
async def save_quote(req: SaveQuoteRequest, user: dict = Depends(get_current_user)):
    q = req.quote or {}

    def _num(v):
        try:
            return float(v)
        except (TypeError, ValueError):
            return None

    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "quote_ref": q.get("id"),
        "client": req.customer.get("full_name") or "Customer",
        "scope_summary": req.scope_summary or (q.get("summary") or "")[:200],
        "total_low": _num(q.get("total_low")),
        "total_high": _num(q.get("total_high")),
        "status": "Draft",
        "customer": req.customer,
        "quote": q,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.saved_quotes.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/quotes")
async def list_quotes(user: dict = Depends(get_current_user)):
    cursor = db.saved_quotes.find({"user_id": user["id"]}).sort("created_at", -1).limit(50)
    out = []
    async for d in cursor:
        d.pop("_id", None)
        out.append(d)
    return out


VALID_STATUSES = {"Draft", "Sent", "Won", "Lost"}


class UpdateQuoteRequest(BaseModel):
    status: Optional[str] = None
    quote: Optional[dict] = None
    total_low: Optional[float] = None
    total_high: Optional[float] = None
    scope_summary: Optional[str] = Field(default=None, max_length=400)


@api_router.patch("/quotes/{quote_id}")
async def update_saved_quote(
    quote_id: str, req: UpdateQuoteRequest, user: dict = Depends(get_current_user)
):
    existing = await db.saved_quotes.find_one({"id": quote_id, "user_id": user["id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Quote not found")

    def _num(v):
        try:
            return float(v)
        except (TypeError, ValueError):
            return None

    updates = {}
    if req.status is not None:
        if req.status not in VALID_STATUSES:
            raise HTTPException(status_code=422, detail="Invalid status")
        updates["status"] = req.status
    if req.quote is not None:
        updates["quote"] = req.quote
    if req.total_low is not None:
        updates["total_low"] = _num(req.total_low)
    if req.total_high is not None:
        updates["total_high"] = _num(req.total_high)
    if req.scope_summary is not None:
        updates["scope_summary"] = req.scope_summary

    if updates:
        updates["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.saved_quotes.update_one({"id": quote_id}, {"$set": updates})

    doc = await db.saved_quotes.find_one({"id": quote_id})
    doc.pop("_id", None)
    return doc


# ---------- Preferred Pro's Directory ----------
PRO_DIRECTORY_SEED = [
    {"business_name": "Ironbark Earthworks", "trade": "excavation", "service_area": "Brisbane North & Moreton Bay", "phone": "0412 884 220", "email": "ops@ironbarkearthworks.com.au", "website": "ironbarkearthworks.com.au", "verified": True, "years": 14, "blurb": "Bulk excavation, site cuts and detailed trenching. 5–20t excavators with experienced operators and full insurance."},
    {"business_name": "Hudson Concrete Co.", "trade": "concreting", "service_area": "Gold Coast & Logan", "phone": "0438 110 765", "email": "quotes@hudsonconcrete.com.au", "website": "hudsonconcrete.com.au", "verified": True, "years": 11, "blurb": "Exposed aggregate, coloured and plain driveways, slabs and pathways. Crisp finishes, on-time pours."},
    {"business_name": "Greenline Landscapes", "trade": "landscaping", "service_area": "Brisbane West (Toowong–Kenmore)", "phone": "0401 552 318", "email": "hello@greenlinelandscapes.com.au", "website": "greenlinelandscapes.com.au", "verified": True, "years": 9, "blurb": "Full soft & hardscape builds — turf, retaining, decks and irrigation. Award-winning residential transformations."},
    {"business_name": "Tidal Plumbing & Gas", "trade": "plumbing", "service_area": "Sunshine Coast", "phone": "0455 902 144", "email": "service@tidalplumbing.com.au", "website": "tidalplumbing.com.au", "verified": True, "years": 16, "blurb": "Licensed plumbers for new builds, drainage and gas fit-off. Reliable trade partner for site works."},
    {"business_name": "Voltify Electrical", "trade": "electrical", "service_area": "Brisbane Metro", "phone": "0466 318 901", "email": "admin@voltify.com.au", "website": "voltify.com.au", "verified": True, "years": 8, "blurb": "Domestic & commercial wiring, switchboards, EV chargers and site power. Master Electricians member."},
    {"business_name": "Hardwood & Co. Carpentry", "trade": "carpentry", "service_area": "Ipswich & Scenic Rim", "phone": "0421 770 562", "email": "build@hardwoodandco.com.au", "website": "hardwoodandco.com.au", "verified": True, "years": 13, "blurb": "Decks, pergolas, framing and finish carpentry. Chippies who turn up and finish clean."},
    {"business_name": "BorderLine Fencing", "trade": "fencing", "service_area": "Redlands & Bayside", "phone": "0407 264 880", "email": "info@borderlinefencing.com.au", "website": "", "verified": False, "years": 6, "blurb": "Timber, Colorbond and pool fencing. Fast turnarounds on residential and acreage boundaries."},
    {"business_name": "Stonecraft Paving", "trade": "paving", "service_area": "Gold Coast Hinterland", "phone": "0432 615 209", "email": "jobs@stonecraftpaving.com.au", "website": "stonecraftpaving.com.au", "verified": True, "years": 10, "blurb": "Permeable paving, driveways and feature courtyards. Precision laying with sealed, lasting finishes."},
    {"business_name": "CanopyCare Arborists", "trade": "arborist", "service_area": "Brisbane & Lockyer Valley", "phone": "0419 803 117", "email": "team@canopycare.com.au", "website": "canopycare.com.au", "verified": True, "years": 12, "blurb": "Qualified arborists for removals, pruning and stump grinding. Site clearing for landscaping and builds."},
    {"business_name": "Apex Plant Hire", "trade": "plant_hire", "service_area": "South-East QLD (wide load)", "phone": "0400 991 230", "email": "hire@apexplant.com.au", "website": "apexplant.com.au", "verified": True, "years": 18, "blurb": "Wet & dry hire — bobcats, excavators, tippers and rollers. Operators available with all tickets current."},
    {"business_name": "DeepCut Excavations", "trade": "excavation", "service_area": "Toowoomba & Darling Downs", "phone": "0438 442 117", "email": "office@deepcut.com.au", "website": "", "verified": False, "years": 7, "blurb": "Rural pads, dams and driveway cuts. Competitive day rates across the Downs."},
    {"business_name": "Sundown Sparkies", "trade": "electrical", "service_area": "Sunshine Coast & Noosa", "phone": "0414 209 776", "email": "book@sundownsparkies.com.au", "website": "sundownsparkies.com.au", "verified": True, "years": 9, "blurb": "Solar, outdoor lighting and landscape power. Tidy work and quick site call-outs."},
    {"business_name": "Coastal Concrete Cutters", "trade": "concreting", "service_area": "Brisbane Bayside", "phone": "0447 660 312", "email": "cut@coastalcutters.com.au", "website": "", "verified": False, "years": 5, "blurb": "Core drilling, sawing and demo. The crew to call when the slab needs to come up."},
    {"business_name": "Roots & Shoots Landscaping", "trade": "landscaping", "service_area": "Logan & Beaudesert", "phone": "0423 558 901", "email": "grow@rootsandshoots.com.au", "website": "rootsandshoots.com.au", "verified": True, "years": 8, "blurb": "Native gardens, retaining walls and acreage tidy-ups. Great for full landscape handovers."},
]


@api_router.get("/directory")
async def list_directory(
    trade: Optional[str] = None,
    q: Optional[str] = None,
    user: dict = Depends(get_current_user),
):
    if await db.pro_directory.count_documents({}) == 0:
        await db.pro_directory.insert_many(
            [{**p, "id": str(uuid.uuid4())} for p in PRO_DIRECTORY_SEED]
        )

    query = {}
    if trade and trade != "all":
        query["trade"] = trade

    out = []
    async for d in db.pro_directory.find(query):
        d.pop("_id", None)
        out.append(d)

    if q:
        ql = q.lower()
        out = [
            p
            for p in out
            if ql
            in f"{p.get('business_name', '')} {p.get('service_area', '')} {p.get('blurb', '')}".lower()
        ]

    out.sort(key=lambda p: (not p.get("verified", False), p.get("business_name", "")))
    return out


# ============================================================================
# Stripe Subscription Payments (TerrainPRO)
# ============================================================================
SUBSCRIPTION_PACKAGES = {
    "sole_quoter": {"name": "Sole Quoter", "amount": 39.00, "currency": "aud", "days": 30},
    "crew": {"name": "Crew (1-3 users)", "amount": 69.00, "currency": "aud", "days": 30},
}


def get_webhook_url(host_url: str) -> str:
        return f"{host_url.rstrip('/')}/api/webhook/stripe"


class CheckoutCreateRequest(BaseModel):
    package_id: Literal["sole_quoter", "crew"]
    origin_url: str = Field(..., min_length=8, max_length=400)


@api_router.post("/payments/checkout")
async def create_checkout(
    req: CheckoutCreateRequest,
    request: Request,
    user: dict = Depends(get_current_user),
):
    pkg = SUBSCRIPTION_PACKAGES[req.package_id]
    origin = req.origin_url.rstrip("/")
    success_url = f"{origin}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/dashboard?payment=cancelled"

    host_url = str(request.base_url)
    metadata = {
        "user_id": user["id"],
        "user_email": user["email"],
        "package_id": req.package_id,
        "plan_name": pkg["name"],
        "source": "terrainpro_subscription",
    }
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{"price_data": {"currency": pkg["currency"], "product_data": {"name": pkg["name"]}, "unit_amount": int(pkg["amount"] * 100)}, "quantity": 1}],
        mode="payment",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )

    now = datetime.now(timezone.utc)
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "user_id": user["id"],
        "user_email": user["email"],
        "package_id": req.package_id,
        "plan_name": pkg["name"],
        "amount": pkg["amount"],
        "currency": pkg["currency"],
        "days_granted": pkg["days"],
        "status": "initiated",
        "payment_status": "pending",
        "metadata": metadata,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    })

    return {"session_id": session.id, "url": session.url}


async def _apply_successful_payment(txn: dict) -> dict:
    """Idempotently grant subscription based on a successful payment transaction."""
    if txn.get("subscription_granted"):
        return txn
    pkg_id = txn.get("package_id")
    pkg = SUBSCRIPTION_PACKAGES.get(pkg_id)
    if not pkg:
        return txn
    user = await db.users.find_one({"id": txn["user_id"]})
    if not user:
        return txn

    now = datetime.now(timezone.utc)
    current_expiry = _parse_dt(user.get("subscription_expires_at"))
    base = current_expiry if (current_expiry and current_expiry > now) else now
    new_expiry = base + timedelta(days=pkg["days"])

    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {
            "subscription_plan": pkg_id,
            "subscription_plan_name": pkg["name"],
            "subscription_expires_at": new_expiry.isoformat(),
            "subscription_last_paid_at": now.isoformat(),
        }},
    )
    await db.payment_transactions.update_one(
        {"session_id": txn["session_id"]},
        {"$set": {
            "subscription_granted": True,
            "subscription_expires_at": new_expiry.isoformat(),
            "updated_at": now.isoformat(),
        }},
    )
    txn["subscription_granted"] = True
    return txn


@api_router.get("/payments/status/{session_id}")
async def get_payment_status(
    session_id: str,
    request: Request,
    user: dict = Depends(get_current_user),
):
    txn = await db.payment_transactions.find_one({"session_id": session_id})
    if not txn:
        raise HTTPException(status_code=404, detail="Payment session not found")
    if txn["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your payment session")

    session = stripe.checkout.Session.retrieve(session_id)
return {
    "status": session.status,
    "payment_status": session.payment_status,
    "amount_total": session.amount_total,
    "currency": session.currency
}

    now_iso = datetime.now(timezone.utc).isoformat()
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {"$set": {
            "status": status_resp.status,
            "payment_status": status_resp.payment_status,
            "updated_at": now_iso,
        }},
    )

    if status_resp.payment_status == "paid" and not txn.get("subscription_granted"):
        txn = await db.payment_transactions.find_one({"session_id": session_id})
        await _apply_successful_payment(txn)

    return {
        "status": status_resp.status,
        "payment_status": status_resp.payment_status,
        "amount_total": status_resp.amount_total,
        "currency": status_resp.currency,
        "plan_name": txn.get("plan_name"),
        "package_id": txn.get("package_id"),
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    host_url = str(request.base_url)
    stripe_checkout = _get_stripe_checkout(host_url)
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
    except Exception as e:
        logger.error(f"Stripe webhook handle failed: {e}")
        raise HTTPException(status_code=400, detail="Webhook verification failed")

    session_id = getattr(webhook_response, "session_id", None)
    payment_status = getattr(webhook_response, "payment_status", None)
    event_type = getattr(webhook_response, "event_type", None)

    if session_id:
        txn = await db.payment_transactions.find_one({"session_id": session_id})
        if txn:
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "payment_status": payment_status or txn.get("payment_status"),
                    "last_webhook_event": event_type,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }},
            )
            if payment_status == "paid" and not txn.get("subscription_granted"):
                fresh = await db.payment_transactions.find_one({"session_id": session_id})
                await _apply_successful_payment(fresh)

    return {"received": True}


@api_router.get("/payments/plans")
async def list_plans():
    return [
        {"id": k, **v} for k, v in SUBSCRIPTION_PACKAGES.items()
    ]



app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
