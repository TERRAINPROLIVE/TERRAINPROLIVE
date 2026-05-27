from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

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


class JobScope(BaseModel):
    job_type: str = Field(..., min_length=2, max_length=60)
    trade: Optional[str] = None
    label: Optional[str] = None
    measurements: dict = Field(default_factory=dict)


class MultiQuoteRequest(BaseModel):
    customer: CustomerInfo
    scopes: List[JobScope] = Field(..., min_length=1, max_length=12)
    complexity: Literal["low", "medium", "high"] = "medium"
    notes: Optional[str] = Field(default=None, max_length=2000)


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
        "customer": req.customer.model_dump(),
        "scopes": [s.model_dump() for s in req.scopes],
        "complexity": req.complexity,
        "notes": req.notes,
    }

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"quote-multi-{quote_id}",
        system_message=MULTI_SYSTEM_PROMPT,
    ).with_model("openai", "gpt-5.2")

    user_msg = UserMessage(
        text=(
            "Generate a consolidated AUD quote for the following customer covering ALL scopes. "
            "Group line_items by scope using the job_type id. Respond with JSON only.\n\n"
            f"Brief:\n{json.dumps(payload, indent=2, default=str)}"
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
