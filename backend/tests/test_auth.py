"""Auth tests — TerrainPRO JWT email/password + 7-day trial."""
import os
import uuid
import requests
import pytest
from datetime import datetime, timezone

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://blueprint-build-15.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

DEMO_EMAIL = "demo@terrainpro.com"
DEMO_PASSWORD = "trade1234"


def _unique_email():
    return f"qa_{uuid.uuid4().hex[:10]}@test.com"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Register ----------
class TestRegister:
    def test_register_returns_token_and_trial(self, session):
        email = _unique_email()
        r = session.post(f"{API}/auth/register", json={
            "name": "QA Tester", "phone": "0412345678",
            "email": email, "password": "secret123",
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        u = data["user"]
        assert u["email"] == email
        assert u["trial_active"] is True
        assert u["days_remaining"] == 7
        # trial_expires_at ~7 days ahead
        expires = datetime.fromisoformat(u["trial_expires_at"])
        delta_days = (expires - datetime.now(timezone.utc)).total_seconds() / 86400
        assert 6.9 < delta_days <= 7.01, f"trial_expires_at delta={delta_days}"

    def test_register_duplicate_returns_409(self, session):
        email = _unique_email()
        first = session.post(f"{API}/auth/register", json={
            "name": "Dup", "phone": "0412345678",
            "email": email, "password": "secret123",
        })
        assert first.status_code == 200
        second = session.post(f"{API}/auth/register", json={
            "name": "Dup", "phone": "0412345678",
            "email": email, "password": "secret123",
        })
        assert second.status_code == 409, second.text

    def test_register_validation_short_password(self, session):
        r = session.post(f"{API}/auth/register", json={
            "name": "Bad", "phone": "0412345678",
            "email": _unique_email(), "password": "123",
        })
        assert r.status_code == 422


# ---------- Login ----------
class TestLogin:
    def test_login_demo_user_success(self, session):
        r = session.post(f"{API}/auth/login", json={
            "email": DEMO_EMAIL, "password": DEMO_PASSWORD,
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data
        assert data["user"]["email"] == DEMO_EMAIL
        assert "days_remaining" in data["user"]

    def test_login_wrong_password_401(self, session):
        r = session.post(f"{API}/auth/login", json={
            "email": DEMO_EMAIL, "password": "wrongpass!!",
        })
        assert r.status_code == 401

    def test_login_unknown_email_401(self, session):
        r = session.post(f"{API}/auth/login", json={
            "email": f"nope_{uuid.uuid4().hex[:6]}@test.com",
            "password": "anything",
        })
        assert r.status_code == 401


# ---------- /auth/me ----------
class TestMe:
    def test_me_without_token_401(self, session):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_invalid_token_401(self, session):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer not.a.jwt"})
        assert r.status_code == 401

    def test_me_with_valid_token_returns_user(self, session):
        # Register fresh, then call /auth/me with returned token
        email = _unique_email()
        reg = session.post(f"{API}/auth/register", json={
            "name": "Me Test", "phone": "0412345678",
            "email": email, "password": "secret123",
        })
        assert reg.status_code == 200
        token = reg.json()["token"]
        r = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200, r.text
        u = r.json()
        assert u["email"] == email
        assert u["trial_active"] is True
        assert u["days_remaining"] == 7
