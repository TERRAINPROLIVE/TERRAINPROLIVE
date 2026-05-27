"""
Backend API tests for Quoteforge.
Covers:
- GET /api/                       (health)
- POST /api/quote/generate        (AI quote — gpt-5.2 via emergentintegrations)
- POST /api/waitlist              (creation + idempotency on duplicate email)
- GET  /api/waitlist/count        (count)
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # Fallback: read from frontend/.env
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip()
                    break
    except FileNotFoundError:
        pass

assert BASE_URL, "REACT_APP_BACKEND_URL must be set"
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

# Generous timeout for AI call
AI_TIMEOUT = 90


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert isinstance(data["message"], str)


# ---------------------------------------------------------------------------
# Quote generation
# ---------------------------------------------------------------------------
VALID_QUOTE_PAYLOAD = {
    "job_type": "concreting",
    "description": "60m2 shed slab 32MPa with SL82 mesh broom finish flat block Geelong",
    "area_sqm": 60,
    "timeline_days": 7,
    "location": "Geelong VIC",
    "materials": ["32MPa Concrete", "Reo Mesh (SL82)"],
    "complexity": "medium",
}


class TestQuoteGenerate:
    def test_generate_quote_success(self, client):
        r = client.post(f"{API}/quote/generate", json=VALID_QUOTE_PAYLOAD, timeout=AI_TIMEOUT)
        assert r.status_code == 200, f"unexpected status {r.status_code}: {r.text[:500]}"
        data = r.json()

        # Top-level keys
        for key in [
            "id", "job_type", "summary", "line_items",
            "labor_total", "materials_total", "contingency_total",
            "subtotal", "gst", "total_low", "total_high",
            "timeline_estimate", "confidence",
            "assumptions", "next_steps", "generated_at",
        ]:
            assert key in data, f"missing key {key}"

        assert data["job_type"] == "concreting"
        assert isinstance(data["line_items"], list) and len(data["line_items"]) >= 3
        for li in data["line_items"]:
            assert {"label", "detail", "qty", "unit", "unit_cost", "total"} <= set(li.keys())
            assert isinstance(li["qty"], (int, float))
            assert isinstance(li["unit_cost"], (int, float))
            assert isinstance(li["total"], (int, float))

        # Numeric sanity
        assert data["total_low"] > 0
        assert data["total_high"] >= data["total_low"]
        assert data["gst"] >= 0
        assert isinstance(data["assumptions"], list) and len(data["assumptions"]) >= 1
        assert isinstance(data["next_steps"], list) and len(data["next_steps"]) >= 1
        assert data["confidence"] in ("low", "medium", "high")

        # Stash for persistence check downstream
        pytest.shared_quote_id = data["id"]

    @pytest.mark.parametrize(
        "bad_payload",
        [
            {},  # missing all
            {**VALID_QUOTE_PAYLOAD, "job_type": "plumbing"},  # invalid literal
            {**VALID_QUOTE_PAYLOAD, "area_sqm": -10},  # invalid gt=0
            {**VALID_QUOTE_PAYLOAD, "timeline_days": 0},  # invalid ge=1
            {**VALID_QUOTE_PAYLOAD, "description": "short"},  # min_length=10
            {**VALID_QUOTE_PAYLOAD, "complexity": "extreme"},  # invalid literal
        ],
    )
    def test_generate_quote_validation_422(self, client, bad_payload):
        r = client.post(f"{API}/quote/generate", json=bad_payload, timeout=30)
        assert r.status_code == 422, f"expected 422, got {r.status_code}: {r.text[:300]}"


# ---------------------------------------------------------------------------
# Waitlist
# ---------------------------------------------------------------------------
class TestWaitlist:
    def test_count_endpoint_numeric(self, client):
        r = client.get(f"{API}/waitlist/count", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "count" in data
        assert isinstance(data["count"], int)
        assert data["count"] >= 0

    def test_create_and_duplicate(self, client):
        email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        payload = {"email": email, "name": "Test Tradie", "trade": "concreting"}

        # Count before
        before = client.get(f"{API}/waitlist/count", timeout=15).json()["count"]

        r1 = client.post(f"{API}/waitlist", json=payload, timeout=20)
        assert r1.status_code == 200, r1.text
        d1 = r1.json()
        assert d1["email"] == email.lower()
        assert d1["name"] == "Test Tradie"
        assert d1["trade"] == "concreting"
        assert "id" in d1 and d1["id"]
        first_id = d1["id"]

        # Count incremented
        after = client.get(f"{API}/waitlist/count", timeout=15).json()["count"]
        assert after == before + 1, f"count did not increment ({before} -> {after})"

        # Duplicate — same email returns same entry (no new row)
        r2 = client.post(f"{API}/waitlist", json={**payload, "name": "Other"}, timeout=20)
        assert r2.status_code == 200, r2.text
        d2 = r2.json()
        assert d2["id"] == first_id, "duplicate email should return existing id"

        after2 = client.get(f"{API}/waitlist/count", timeout=15).json()["count"]
        assert after2 == after, f"count must NOT increment on duplicate ({after} -> {after2})"

    def test_create_invalid_email_422(self, client):
        r = client.post(f"{API}/waitlist", json={"email": "not-an-email"}, timeout=15)
        assert r.status_code == 422
