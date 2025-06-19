import pytest
import json
import uuid

# ----------------------
# /generate-quiz Tests
# ----------------------
def test_generate_quiz_valid(client):
    """Test /generate-quiz with valid input."""
    data = {"text": "Photosynthesis is the process by which green plants convert sunlight into energy."}
    response = client.post("/generate-quiz", json=data)
    assert response.status_code == 200
    resp_json = response.get_json()
    assert "quiz" in resp_json
    assert isinstance(resp_json["quiz"], list)
    assert len(resp_json["quiz"]) > 0
    for q in resp_json["quiz"]:
        assert "question" in q
        assert "options" in q
        assert isinstance(q["options"], list)
        assert len(q["options"]) == 4


def test_generate_quiz_missing_text(client):
    """Test /generate-quiz with missing 'text' field."""
    response = client.post("/generate-quiz", json={})
    assert response.status_code == 400
    resp_json = response.get_json()
    assert "error" in resp_json


def test_generate_quiz_malformed_json(client):
    """Test /generate-quiz with malformed JSON."""
    response = client.post("/generate-quiz", data="not a json", content_type="application/json")
    assert response.status_code == 400 or response.status_code == 500

# ----------------------
# /auth/signup & /auth/signin Tests
# ----------------------

def test_auth_signup_success(client):
    """Test /auth/signup with a unique email."""
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    data = {"email": unique_email, "password": "TestPass123"}
    response = client.post("/auth/signup", json=data)
    assert response.status_code == 201
    resp_json = response.get_json()
    assert "message" in resp_json
    assert "user_id" in resp_json or "user" in resp_json


def test_auth_signup_existing_email(client):
    """Test /auth/signup with an existing email (should fail)."""
    email = f"existinguser_{uuid.uuid4().hex[:8]}@example.com"
    data = {"email": email, "password": "TestPass123"}
    # First signup should succeed
    response1 = client.post("/auth/signup", json=data)
    assert response1.status_code == 201
    # Second signup should fail
    response2 = client.post("/auth/signup", json=data)
    assert response2.status_code == 400 or response2.status_code == 409
    resp_json = response2.get_json()
    assert "error" in resp_json


def test_auth_signup_invalid_password(client):
    """Test /auth/signup with a weak password (should fail if backend validates)."""
    email = f"weakpass_{uuid.uuid4().hex[:8]}@example.com"
    data = {"email": email, "password": "123"}
    response = client.post("/auth/signup", json=data)
    assert response.status_code == 400 or response.status_code == 500
    resp_json = response.get_json()
    assert "error" in resp_json


def test_auth_signin_success(client):
    """Test /auth/signin with correct credentials."""
    email = f"signinuser_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPass123"
    # Register first
    signup_resp = client.post("/auth/signup", json={"email": email, "password": password})
    assert signup_resp.status_code == 201
    # Now sign in
    response = client.post("/auth/signin", json={"email": email, "password": password})
    assert response.status_code == 200
    resp_json = response.get_json()
    assert "access_token" in resp_json
    assert "user" in resp_json
    assert resp_json["user"]["email"] == email


def test_auth_signin_invalid_credentials(client):
    """Test /auth/signin with wrong password."""
    email = f"wrongpass_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPass123"
    # Register first
    signup_resp = client.post("/auth/signup", json={"email": email, "password": password})
    assert signup_resp.status_code == 201
    # Try wrong password
    response = client.post("/auth/signin", json={"email": email, "password": "WrongPass456"})
    assert response.status_code == 401 or response.status_code == 400
    resp_json = response.get_json()
    assert "error" in resp_json 