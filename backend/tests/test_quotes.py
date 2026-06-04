"""Backend tests for saved-quotes endpoints (TerrainPRO)."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
API = f"{BASE_URL}/api"

DEMO_EMAIL = "demo@terrainpro.com"
DEMO_PASSWORD = "trade1234"


def _register():
    email = f"qa_{uuid.uuid4().hex[:10]}@test.com"
    r = requests.post(f"{API}/auth/register", json={
        "name": "QA Quote", "phone": "0412345678",
        "email": email, "password": "secret123",
    })
    assert r.status_code == 200, r.text
    return email, r.json()["token"]


@pytest.fixture(scope="module")
def demo_token():
    r = requests.post(f"{API}/auth/login", json={
        "email": DEMO_EMAIL, "password": DEMO_PASSWORD,
    })
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def other_token():
    _, tok = _register()
    return tok


def _sample_payload(name="Melinda Rankine", low=8500, high=11200):
    return {
        "quote": {
            "id": str(uuid.uuid4()),
            "summary": "TEST_ Riverstone pebble path, 9x5x100mm",
            "total_low": low,
            "total_high": high,
            "subtotal": 9500,
            "gst": 950,
        },
        "customer": {"full_name": name, "phone": "0411222333", "email": "mel@test.com"},
        "scope_summary": "TEST_ Pebble path",
    }


class TestSaveQuote:
    def test_unauthenticated_returns_401(self):
        r = requests.post(f"{API}/quotes", json=_sample_payload())
        assert r.status_code == 401, r.text

    def test_save_quote_returns_saved_doc(self, demo_token):
        payload = _sample_payload()
        r = requests.post(
            f"{API}/quotes",
            json=payload,
            headers={"Authorization": f"Bearer {demo_token}"},
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert "id" in d and isinstance(d["id"], str)
        assert d["client"] == "Melinda Rankine"
        assert d["total_low"] == 8500
        assert d["total_high"] == 11200
        assert d["status"] == "Draft"
        assert "created_at" in d
        assert "_id" not in d
        # quote_ref echoes the inner quote.id
        assert d["quote_ref"] == payload["quote"]["id"]

    def test_list_returns_user_scoped_most_recent_first(self, demo_token):
        # Save two
        first = requests.post(f"{API}/quotes", json=_sample_payload(name="TEST_AAA", low=100, high=200),
                              headers={"Authorization": f"Bearer {demo_token}"})
        second = requests.post(f"{API}/quotes", json=_sample_payload(name="TEST_BBB", low=300, high=400),
                               headers={"Authorization": f"Bearer {demo_token}"})
        assert first.status_code == 200 and second.status_code == 200

        r = requests.get(f"{API}/quotes", headers={"Authorization": f"Bearer {demo_token}"})
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list) and len(items) >= 2
        # Most recent first
        assert items[0]["created_at"] >= items[1]["created_at"]
        clients = [it["client"] for it in items[:5]]
        assert "TEST_BBB" in clients
        # No mongo _id leakage
        for it in items:
            assert "_id" not in it

    def test_list_unauthenticated_returns_401(self):
        r = requests.get(f"{API}/quotes")
        assert r.status_code == 401

    def test_list_is_user_scoped(self, demo_token, other_token):
        # Save under a freshly registered user; demo's list must NOT contain their quote
        unique_marker = f"TEST_OTHER_{uuid.uuid4().hex[:6]}"
        s = requests.post(
            f"{API}/quotes",
            json=_sample_payload(name=unique_marker, low=999, high=1999),
            headers={"Authorization": f"Bearer {other_token}"},
        )
        assert s.status_code == 200

        other = requests.get(f"{API}/quotes", headers={"Authorization": f"Bearer {other_token}"})
        assert other.status_code == 200
        assert any(q["client"] == unique_marker for q in other.json())

        demo = requests.get(f"{API}/quotes", headers={"Authorization": f"Bearer {demo_token}"})
        assert demo.status_code == 200
        assert all(q["client"] != unique_marker for q in demo.json()), "Cross-user leakage!"
