import requests, json, os
BASE = 'http://127.0.0.1:8000/api/'

# Helper to print result
def print_res(name, r):
    print(f'[{name}] status:', r.status_code)
    try:
        print('    json:', r.json())
    except Exception:
        print('    text:', r.text[:200])

# Register a user (ignore if already exists)
reg_data = {
    'email': 'testuser@example.com',
    'password': 'TestPass123!',
    'password_confirm': 'TestPass123!',
    'first_name': 'Test',
    'last_name': 'User'
}
try:
    r = requests.post(BASE + 'register/', json=reg_data)
    print_res('Register', r)
except Exception as e:
    print('Register error:', e)

# Login
login_data = {
    'email': 'testuser@example.com',
    'password': 'TestPass123!',
    'remember_me': True
}
r = requests.post(BASE + 'auth/login/', json=login_data)
print_res('Login', r)
if r.status_code != 200:
    exit(1)
access = r.json()['data']['tokens']['access']
refresh = r.json()['data']['tokens']['refresh']
headers = {'Authorization': f'Bearer {access}'}

# Public endpoints (no auth needed but auth header ok)
for name, endpoint in [
    ('Home', 'home/'),
    ('Wilayas', 'wilayas/'),
    ('Places', 'places/'),
    ('Events', 'events/')
]:
    resp = requests.get(BASE + endpoint, headers=headers)
    print_res(name, resp)

# Protected profile endpoint (requires auth)
resp = requests.get(BASE + 'profile/', headers=headers)
print_res('Profile', resp)

# Refresh token check
refresh_resp = requests.post(BASE + 'auth/token/refresh/', json={'refresh': refresh})
print_res('Refresh', refresh_resp)
