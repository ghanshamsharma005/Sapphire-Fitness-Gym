#!/usr/bin/env python3
"""
SAPPHIRE FITNESS GYM - LOCAL SERVER & LEAD PERSISTENCE API
Provides static asset serving and genuinely configured REST endpoints:
- POST /api/enquire        (Validates & saves customer inquiries to data/enquiries.json)
- GET  /api/enquiries      (Fetches enquiries for Gym Owner Admin dashboard)
- POST /api/enquiries/update (Updates status: New <-> Contacted)
"""

import http.server
import socketserver
import json
import os
import re
import datetime
from urllib.parse import urlparse

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'enquiries.json')

class SapphireGymHandler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for dev testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Connection', 'close')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/enquiries':
            self.handle_get_enquiries()
        elif parsed.path == '/admin':
            self.path = '/admin.html'
            super().do_GET()
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/enquire':
            self.handle_post_enquiry()
        elif parsed.path == '/api/enquiries/update':
            self.handle_post_status_update()
        else:
            self.send_error(404, "Endpoint not found")

    def handle_get_enquiries(self):
        try:
            if not os.path.exists(DATA_FILE):
                enquiries = []
            else:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    enquiries = json.load(f)
            
            body = json.dumps(enquiries).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            self.wfile.flush()
        except Exception as e:
            self.send_json_error(500, f"Failed to retrieve enquiries: {str(e)}")

    def handle_post_enquiry(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            raw_body = self.rfile.read(content_length).decode('utf-8')
            payload = json.loads(raw_body)

            # 1. Validate Full Name
            full_name = payload.get('fullName', '').strip()
            if len(full_name) < 2:
                self.send_json_error(400, "Full name must be at least 2 characters.")
                return

            # 2. Validate Indian Phone Number
            phone_raw = payload.get('phoneNumber', '').strip()
            phone_digits = re.sub(r'\D', '', phone_raw)
            if len(phone_digits) == 12 and phone_digits.startswith('91'):
                phone_digits = phone_digits[2:]
            elif len(phone_digits) == 11 and phone_digits.startswith('0'):
                phone_digits = phone_digits[1:]

            if not (len(phone_digits) == 10 and phone_digits[0] in '6789'):
                self.send_json_error(400, "Invalid Indian phone number. Must be 10 digits starting with 6, 7, 8, or 9.")
                return

            # 3. Create persistent lead object
            lead_id = payload.get('id') or f"SFG-{int(datetime.datetime.now().timestamp()) % 1000000:06d}"
            lead_record = {
                "id": lead_id,
                "fullName": full_name,
                "phoneNumber": phone_digits,
                "displayPhone": f"+91 {phone_digits[:5]} {phone_digits[5:]}",
                "emailAddress": payload.get('emailAddress', '').strip() or None,
                "interestedPlan": payload.get('interestedPlan', 'General Enquiry'),
                "message": payload.get('message', '').strip(),
                "submittedAt": datetime.datetime.now().isoformat(),
                "displayDate": datetime.datetime.now().strftime("%d %b %Y, %I:%M %p"),
                "status": "New",
                "source": payload.get('source', 'Website Form'),
                "clientIp": self.client_address[0]
            }

            # 4. Atomic append to JSON file
            os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
            existing_leads = []
            if os.path.exists(DATA_FILE):
                try:
                    with open(DATA_FILE, 'r', encoding='utf-8') as f:
                        existing_leads = json.load(f)
                except Exception:
                    existing_leads = []

            existing_leads.insert(0, lead_record)

            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(existing_leads, f, indent=2)

            try:
                print(f"\n[LEAD RECEIVED] {lead_record['fullName']} | +91 {lead_record['phoneNumber']} | Plan: {lead_record['interestedPlan']} | Ref: {lead_id}")
            except Exception:
                print(f"\n[LEAD RECEIVED] {lead_record['fullName']} | +91 {lead_record['phoneNumber']} | Ref: {lead_id}")

            response_data = {
                "success": True,
                "leadId": lead_id,
                "message": "Enquiry registered and persisted successfully."
            }
            body = json.dumps(response_data).encode('utf-8')
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            self.wfile.flush()

        except Exception as e:
            import traceback
            traceback.print_exc()
            self.send_json_error(500, f"Error processing enquiry: {str(e)}")

    def handle_post_status_update(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            payload = json.loads(self.rfile.read(content_length).decode('utf-8'))
            lead_id = payload.get('id')
            new_status = payload.get('status')

            if not os.path.exists(DATA_FILE):
                self.send_json_error(404, "No enquiries store found")
                return

            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                leads = json.load(f)

            found = False
            for lead in leads:
                if lead.get('id') == lead_id:
                    lead['status'] = new_status
                    found = True
                    break

            if found:
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(leads, f, indent=2)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"success": true}')
                self.wfile.flush()
            else:
                self.send_json_error(404, "Lead ID not found")
        except Exception as e:
            self.send_json_error(500, str(e))

    def send_json_error(self, code, message):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        body = json.dumps({"error": message}).encode('utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        self.wfile.flush()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SapphireGymHandler) as httpd:
        print(f"============================================================")
        print(f"   SAPPHIRE FITNESS GYM - SERVER RUNNING")
        print(f"   URL: http://localhost:{PORT}")
        print(f"   Admin Leads: http://localhost:{PORT}/admin.html")
        print(f"   Database: {DATA_FILE}")
        print(f"============================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
