"""Backend regression for /api/auth/profile (business_name, abn, hourly_rate)
and multi-save behavior of /api/quotes (each POST must persist a NEW record)."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
API = f"{BASE_URL}/api"

DEMO_EMAIL = "demo@terrainpro.com"
DEMO_PASSWORD = "trade1234"


@pytest.fixture(scope="module")
def demo_token():
    r = requests.post(f"{API}/auth/login", json={
        "email": DEMO_EMAIL, "password": DEMO_PASSWORD,
    })
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def fresh_token():
    email = f"qa_{uuid.uuid4().hex[:10]}@test.com"
    r = requests.post(f"{API}/auth/register", json={
        "name": "QA Profile", "phone": "0411222333",
        "email": email, "password": "secret123",
    })
    assert r.status_code == 200, r.text
    return r.json()["token"]


# ---- Profile PUT /api/auth/profile ----

class TestProfileUpdate:
    def test_update_business_name_and_abn(self, fresh_token):
        new_name = f"TEST_Biz_{uuid.uuid4().hex[:6]}"
        new_abn = "12345678901"
        r = requests.put(
            f"{API}/auth/profile",
            json={"business_name": new_name, "abn": new_abn},
            headers={"Authorization": f"Bearer {fresh_token}"},
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["business_name"] == new_name
        assert d["abn"] == new_abn
        # Verify persistence via /auth/me
        me = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {fresh_token}"})
        assert me.status_code == 200
        m = me.json()
        assert m["business_name"] == new_name
        assert m["abn"] == new_abn

    def test_update_hourly_rate(self, fresh_token):
        r = requests.put(
            f"{API}/auth/profile",
            json={"hourly_rate": 95.5},
            headers={"Authorization": f"Bearer {fresh_token}"},
        )
        assert r.status_code == 200, r.text
        assert r.json()["hourly_rate"] == 95.5
        me = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {fresh_token}"})
        assert me.json()["hourly_rate"] == 95.5

    def test_partial_update_does_not_clear_other_fields(self, fresh_token):
        # Set both first
        requests.put(
            f"{API}/auth/profile",
            json={"business_name": "TEST_KeepMe", "abn": "99999999999"},
            headers={"Authorization": f"Bearer {fresh_token}"},
        )
        # Now update only hourly_rate
        r = requests.put(
            f"{API}/auth/profile",
            json={"hourly_rate": 120.0},
            headers={"Authorization": f"Bearer {fresh_token}"},
        )
        assert r.status_code == 200
        d = r.json()
        assert d["hourly_rate"] == 120.0
        assert d["business_name"] == "TEST_KeepMe"
        assert d["abn"] == "99999999999"

    def test_profile_requires_auth(self):
        r = requests.put(f"{API}/auth/profile", json={"business_name": "x"})
        assert r.status_code == 401


# ---- Multi-save POST /api/quotes ----

def _payload(name, low, high, summary):
    return {
        "quote": {
            "id": str(uuid.uuid4()),
            "summary": summary,
            "total_low": low,
            "total_high": high,
            "subtotal": (low + high) / 2,
            "gst": ((low + high) / 2) * 0.1,
        },
        "customer": {"full_name": name, "phone": "0400000000", "email": "x@x.com"},
        "scope_summary": summary,
    }


class TestMultiSave:
    def test_two_consecutive_saves_create_distinct_records(self, demo_token):
        headers = {"Authorization": f"Bearer {demo_token}"}
        # Baseline count
        base = requests.get(f"{API}/quotes", headers=headers)
        assert base.status_code == 200
        base_count = len(base.json())

        marker_a = f"TEST_MULTI_A_{uuid.uuid4().hex[:6]}"
        marker_b = f"TEST_MULTI_B_{uuid.uuid4().hex[:6]}"
        a = requests.post(f"{API}/quotes", json=_payload(marker_a, 1000, 1500, "TEST_ alpha"), headers=headers)
        b = requests.post(f"{API}/quotes", json=_payload(marker_b, 2000, 2500, "TEST_ bravo"), headers=headers)
        assert a.status_code == 200 and b.status_code == 200
        assert a.json()["id"] != b.json()["id"], "Two saves must create distinct ids"
        assert a.json()["quote_ref"] != b.json()["quote_ref"]

        # Listing must contain both and be newest-first
        lst = requests.get(f"{API}/quotes", headers=headers)
        assert lst.status_code == 200
        items = lst.json()
        assert len(items) >= base_count + 2
        clients = [it["client"] for it in items]
        assert marker_a in clients and marker_b in clients
        # B was saved after A -> appears earlier
        idx_a = clients.index(marker_a)
        idx_b = clients.index(marker_b)
        assert idx_b < idx_a, "Newest save must appear first"
