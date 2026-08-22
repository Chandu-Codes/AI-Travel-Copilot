# AI Travel Copilot - Test Suites & Verification

This directory contains automated unit tests, API integration tests, itinerary uniqueness validations, and destination GPS verification scripts.

---

## 🧪 Available Test Suites

| Test File | Framework | Purpose | How to Run |
|---|---|---|---|
| **`backend/tests/test_api.py`** | `pytest` + `FastAPI TestClient` | End-to-end API testing across health check, featured destinations, ML flight prediction, budget optimizer, disruptions radar, and Copilot chat. | `pytest` or `python -m pytest` |
| **`tests/test_itinerary_uniqueness.py`** | Standalone script | Validates that multi-day itineraries generated across Pan-India and global destinations have 100% unique, non-duplicated activities. | `python tests/test_itinerary_uniqueness.py` |
| **`tests/verify_destinations_detail.py`** | Standalone script | Verifies GPS coordinates, categories, and day-by-day activity structures for key global and domestic destinations. | `python tests/verify_destinations_detail.py` |

---

## 🚀 Running All Tests

To run the complete automated test suite:
```bash
pytest
```
*(Configured via `pytest.ini` at project root with automatic Python path resolution)*
