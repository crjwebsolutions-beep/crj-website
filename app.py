from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONTACTS_FILE = os.path.join(BASE_DIR, "contacts.json")

# ---------- Save Contacts ----------
def load_contacts():
    if os.path.exists(CONTACTS_FILE):
        try:
            with open(CONTACTS_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_contact(data):
    contacts = load_contacts()
    data["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    contacts.append(data)
    try:
        with open(CONTACTS_FILE, "w") as f:
            json.dump(contacts, f, indent=2)
    except Exception as e:
        print(f"[Save Contact Error] {e}")

# ---------- Send Email ----------
def send_email(data):
    sender_email = "crjwebsolutions@gmail.com"
    sender_password = "kcytpkhcpawhabpa"
    receiver_email = "crjwebsolutions@gmail.com"

    body = f"""
New Website Request:

Name: {data.get('name')}
Business: {data.get('business')}
Phone: {data.get('phone')}
Email: {data.get('email')}
Website Type: {data.get('website_type')}
Existing Site: {data.get('existing_site')}
Branding: {data.get('branding')}
Timeline: {data.get('timeline')}
Details: {data.get('message')}
"""

    msg = MIMEText(body)
    msg["Subject"] = "New Website Request"
    msg["From"] = sender_email
    msg["To"] = receiver_email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        print("EMAIL SENT SUCCESSFULLY")
    except Exception as e:
        print(f"EMAIL ERROR: {e}")
        raise

# ---------- Page Routes ----------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/pricing")
def pricing():
    return render_template("pricing.html")

@app.route("/portfolio")
def portfolio():
    return render_template("portfolio.html")

@app.route("/services")
def services():
    return render_template("services.html")

@app.route("/how-it-works")
def how_it_works():
    return render_template("how-it-works.html")

# ---------- Portfolio Demo Routes ----------
@app.route("/portfolio/barber-demo")
def barber_demo():
    return render_template("barber-demo.html")

@app.route("/portfolio/photography-demo")
def photography_demo():
    return render_template("photography-demo.html")

@app.route("/portfolio/law-demo")
def law_demo():
    return render_template("law-demo.html")

@app.route("/portfolio/travel-demo")
def travel_demo():
    return render_template("travel-demo.html")

# ---------- Form Submit ----------
@app.route("/submit-contact", methods=["POST"])
def submit_contact():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data received"}), 400
    try:
        save_contact(data)
        send_email(data)
        return jsonify({"success": True})
    except Exception as e:
        print(f"[Submit Error] {e}")
        return jsonify({"success": True})

# ---------- Error Handlers ----------
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html"), 200

@app.errorhandler(500)
def server_error(e):
    return render_template("index.html"), 200

# ---------- Run ----------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
