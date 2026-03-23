import requests
import json
import time

BASE_URL = "http://localhost:5001/api" # Adjust to your production URL if needed

def check_health():
    print("🔍 Testing API Health...")
    try:
        # Test auth status (public)
        response = requests.post(f"{BASE_URL}/auth/login", json={"email": "test@example.com", "password": "wrong"})
        if response.status_code in [200, 401]:
            print("✅ Auth API is responsive.")
        else:
            print(f"❌ Auth API returned unexpected status: {response.status_code}")
    except Exception as e:
        print(f"❌ API Connection Failed: {e}")

def check_security():
    print("\n🔍 Testing Security Guards...")
    # Test protected routes without JWT
    response = requests.get(f"{BASE_URL}/leads")
    if response.status_code == 401:
        print("✅ Protected routes accurately reject unauthorized requests.")
    else:
        print(f"❌ SECURITY RISK: Protected route /leads returned {response.status_code} without authentication.")

def check_lead_capture():
    print("\n🔍 Testing Lead Capture Pipeline...")
    # This requires a valid API Key. For actual testing, replace with a real key.
    mock_payload = {
        "firstName": "Smoke",
        "lastName": "Test",
        "email": "smoke@arlo.ai",
        "phone": "+123456789",
        "source": "Automated Script"
    }
    
    # Test capture without API key
    response = requests.post(f"{BASE_URL}/leads/capture", json=mock_payload)
    if response.status_code == 401:
        print("✅ Lead capture rejects requests without API Keys.")
    else:
        print(f"❌ SECURITY RISK: Lead capture accepted a request without an API key.")

if __name__ == "__main__":
    print("🚀 Arlo.ai Professional Smoke Test 🚀")
    print("-" * 40)
    check_health()
    check_security()
    check_lead_capture()
    print("-" * 40)
    print("Done. If all tests passed '✅', your core services are stable.")
