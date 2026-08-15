import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_featured_destinations():
    response = client.get("/api/destinations/featured")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    assert any(d["name"] == "Bali" for d in data)

def test_flight_search_and_ml_prediction():
    response = client.get("/api/flights/search?source_city=Delhi&destination_city=Goa&days_left=15")
    assert response.status_code == 200
    data = response.json()
    assert data["results_count"] > 0
    assert "predicted_price_inr" in data["flights"][0]

def test_budget_optimization():
    response = client.post("/api/budget/optimize", json={
        "total_budget_inr": 40000,
        "destination": "Goa",
        "travelers_count": 2,
        "duration_days": 5,
        "travel_style": "Mid_Range_Explorer"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["total_budget_inr"] == 40000
    assert len(data["categories"]) == 5

def test_disruption_check():
    response = client.get("/api/disruptions/check-flight?flight_number=6E-204")
    assert response.status_code == 200
    data = response.json()
    assert data["is_disrupted"] is True

def test_chat_copilot():
    response = client.post("/api/chat", json={
        "message": "Plan a 5-day trip to Goa for 2 people with a 40,000 budget"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "assistant"
    assert "itinerary" in data["embedded_type"]
