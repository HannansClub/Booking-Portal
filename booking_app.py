from __future__ import annotations

import hashlib
import hmac
import json
import mimetypes
import os
import re
import secrets
import sqlite3
import smtplib
import time
from email.message import EmailMessage
from http import HTTPStatus
from pathlib import Path
from typing import Any
from urllib.parse import unquote
from wsgiref.simple_server import make_server


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("HANNANS_DATA_DIR", BASE_DIR / "data"))
ADMIN_STATE_PATH = DATA_DIR / "booking_admin_state.json"
LOCAL_MEMBER_DB_PATH = Path(r"C:\Users\Jess Malec\Documents\Codex\2026-06-03\can-you-create-an-app-used\data\hannans_club.sqlite3")
PACKAGED_MEMBER_DB_PATH = DATA_DIR / "hannans_club.sqlite3"
MEMBER_DB_PATH = Path(os.environ.get(
    "HANNANS_MEMBER_DB_PATH",
    PACKAGED_MEMBER_DB_PATH if PACKAGED_MEMBER_DB_PATH.exists() else LOCAL_MEMBER_DB_PATH,
))
APP_SECRET = os.environ.get("HANNANS_APP_SECRET", "local-test-secret-please-change-before-use-12345")
ADMIN_PASSWORD = os.environ.get("HANNANS_ADMIN_PASSWORD", "hannans")
ADMIN_TIMEOUT_SECONDS = int(os.environ.get("HANNANS_ADMIN_TIMEOUT_SECONDS", "300"))
MANAGER_EMAIL = os.environ.get("HANNANS_MANAGER_EMAIL", "manager@hannansclub.com.au")
SMTP_HOST = os.environ.get("HANNANS_SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("HANNANS_SMTP_PORT", "587"))
SMTP_USERNAME = os.environ.get("HANNANS_SMTP_USERNAME", "")
SMTP_PASSWORD = os.environ.get("HANNANS_SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("HANNANS_SMTP_FROM", MANAGER_EMAIL)
ADMIN_SESSIONS: dict[str, float] = {}

MEMBER_NUMBER_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 -]{0,31}$")
PHONE_RE = re.compile(r"^\+?[0-9 ()-]{6,24}$")
EMAIL_RE = re.compile(r"^[^@\s]{1,80}@[^@\s]{1,120}\.[^@\s]{2,20}$")


def ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def default_admin_state() -> dict[str, Any]:
    return {
        "addedBookings": [],
        "bookingEdits": {},
        "eventNotes": {},
        "staffAssignments": {},
        "runSheetTasks": {},
        "staffMembers": [],
        "eventChecklists": {},
        "deletedBookingIds": [],
        "attachments": {},
        "emailLog": [],
    }


def read_json_body(environ: dict[str, Any]) -> dict[str, Any]:
    try:
      length = int(environ.get("CONTENT_LENGTH") or "0")
    except ValueError:
      length = 0
    if length <= 0:
        return {}
    try:
        return json.loads(environ["wsgi.input"].read(length) or b"{}")
    except json.JSONDecodeError:
        return {}


def read_admin_state() -> dict[str, Any]:
    ensure_data_dir()
    if not ADMIN_STATE_PATH.exists():
        return default_admin_state()
    try:
        data = json.loads(ADMIN_STATE_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return default_admin_state()
    state = default_admin_state()
    state.update({key: data.get(key, state[key]) for key in state})
    return state


def write_admin_state(data: dict[str, Any]) -> None:
    ensure_data_dir()
    state = default_admin_state()
    state.update({key: data.get(key, state[key]) for key in state})
    ADMIN_STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")


def send_email(to_email: str, subject: str, body: str) -> str:
    if not SMTP_HOST or not SMTP_USERNAME or not SMTP_PASSWORD:
        return "not_configured"
    message = EmailMessage()
    message["From"] = SMTP_FROM
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(message)
    return "sent"


def save_public_enquiry(payload: dict[str, Any]) -> dict[str, Any]:
    state = read_admin_state()
    booking = payload.get("booking") if isinstance(payload.get("booking"), dict) else {}
    if not booking.get("eventName") or not booking.get("date"):
        raise ValueError("Missing event details.")
    booking_id = f"WEB-{int(time.time())}-{secrets.token_hex(3)}"
    booking.update({
        "id": booking_id,
        "sourceCell": "Website enquiry",
        "status": "new enquiry",
        "depositStatus": "Not requested",
        "balanceStatus": "Not requested",
        "paymentDue": "",
        "submittedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    })
    state["addedBookings"].append(booking)
    attachments = payload.get("attachments") if isinstance(payload.get("attachments"), list) else []
    if attachments:
        state["attachments"][booking_id] = attachments[:5]

    manager_body = payload.get("managerEmailBody") or json.dumps(booking, indent=2)
    client_body = payload.get("clientEmailBody") or "Thank you for your enquiry. The Hannans Club will be in touch."
    email_log = []
    for to_email, subject, body, kind in [
        (MANAGER_EMAIL, "New Hannans Club venue enquiry", manager_body, "manager"),
        (booking.get("contactEmail", ""), "Your Hannans Club venue enquiry", client_body, "client"),
    ]:
        if not to_email:
            continue
        status = "not_sent"
        error = ""
        try:
            status = send_email(to_email, subject, body)
        except Exception as exc:  # noqa: BLE001
            status = "failed"
            error = str(exc)
        email_log.append({
            "bookingId": booking_id,
            "to": to_email,
            "kind": kind,
            "subject": subject,
            "status": status,
            "error": error,
            "createdAt": booking["submittedAt"],
        })
    state["emailLog"].extend(email_log)
    write_admin_state(state)
    return {"bookingId": booking_id, "emailLog": email_log}


def normalize_member_number(value: str) -> str:
    return re.sub(r"[\s-]+", "", value).upper()


def normalize_phone(value: str) -> str:
    digits = re.sub(r"\D", "", value)
    if digits.startswith("61") and len(digits) == 11:
        return "0" + digits[2:]
    return digits


def keyed_hash(kind: str, value: str) -> str:
    key = APP_SECRET.encode("utf-8")
    msg = f"{kind}:{value}".encode("utf-8")
    return hmac.new(key, msg, hashlib.sha256).hexdigest()


def member_response(row: sqlite3.Row) -> dict[str, str | int]:
    return {
        "id": row["id"],
        "memberNumber": row["member_number_display"],
        "name": f"{row['first_name']} {row['last_name']}".strip(),
        "phoneLast4": row["phone_last4"] or "",
        "email": row["email"] or "",
        "status": row["status"],
        "membershipType": row["membership_type"] or "",
    }


def lookup_members(value: str) -> tuple[int, dict[str, Any]]:
    clean = value.strip()
    if not clean:
        return HTTPStatus.BAD_REQUEST, {"error": "Enter a member number, phone number or email address."}
    if not MEMBER_NUMBER_RE.match(clean) and not PHONE_RE.match(clean) and not EMAIL_RE.match(clean.lower()):
        return HTTPStatus.BAD_REQUEST, {"error": "Enter a valid membership number, phone number or email address."}
    if not MEMBER_DB_PATH.exists():
        return HTTPStatus.INTERNAL_SERVER_ERROR, {"error": "The member database file could not be found on this hosted app."}

    is_email = bool(EMAIL_RE.match(clean.lower()))
    is_phone = bool(PHONE_RE.match(clean))
    is_member_number = bool(MEMBER_NUMBER_RE.match(clean))
    member_key = keyed_hash("member", normalize_member_number(clean)) if is_member_number and not is_email else ""
    phone_key = keyed_hash("phone", normalize_phone(clean)) if is_phone and not is_email else ""
    email_lookup = clean.lower() if is_email else ""

    with sqlite3.connect(MEMBER_DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            """
            SELECT *
            FROM members
            WHERE member_number_key = ? OR phone_key = ? OR lower(email) = ?
            ORDER BY last_name, first_name
            LIMIT 8
            """,
            (member_key, phone_key, email_lookup),
        ).fetchall()

    active_rows = [row for row in rows if row["status"] == "active"]
    if active_rows:
        return HTTPStatus.OK, {"members": [member_response(row) for row in active_rows]}
    if rows:
        return HTTPStatus.FORBIDDEN, {"code": "membership_inactive", "error": "This membership is not currently active."}
    return HTTPStatus.OK, {"members": []}


def json_response(start_response, status: int, payload: dict[str, Any]):
    body = json.dumps(payload).encode("utf-8")
    start_response(
        f"{status} {HTTPStatus(status).phrase}",
        [
            ("Content-Type", "application/json; charset=utf-8"),
            ("Content-Length", str(len(body))),
            ("Cache-Control", "no-store"),
        ],
    )
    return [body]


def file_response(start_response, path: str):
    if path in {"/", ""}:
        path = "/index.html"
    target = (BASE_DIR / unquote(path).lstrip("/")).resolve()
    if not str(target).startswith(str(BASE_DIR)) or not target.is_file():
        return json_response(start_response, HTTPStatus.NOT_FOUND, {"error": "Not found."})
    body = target.read_bytes()
    content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
    start_response(
        "200 OK",
        [
            ("Content-Type", content_type),
            ("Content-Length", str(len(body))),
            ("Cache-Control", "no-store"),
        ],
    )
    return [body]


def admin_authorized(environ: dict[str, Any]) -> bool:
    token = environ.get("HTTP_X_ADMIN_TOKEN", "")
    last_activity = ADMIN_SESSIONS.get(token)
    if not token or last_activity is None:
        return False
    if time.time() - last_activity > ADMIN_TIMEOUT_SECONDS:
        ADMIN_SESSIONS.pop(token, None)
        return False
    ADMIN_SESSIONS[token] = time.time()
    return True


def app(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET").upper()
    path = environ.get("PATH_INFO", "/")

    if method == "POST" and path == "/api/member-lookup":
        status, payload = lookup_members(str(read_json_body(environ).get("value", "")))
        return json_response(start_response, status, payload)

    if method == "POST" and path == "/api/enquiries":
        try:
            result = save_public_enquiry(read_json_body(environ))
        except ValueError as exc:
            return json_response(start_response, HTTPStatus.BAD_REQUEST, {"error": str(exc)})
        return json_response(start_response, HTTPStatus.OK, {"ok": True, **result})

    if method == "POST" and path == "/api/admin/login":
        password = str(read_json_body(environ).get("password", ""))
        if not hmac.compare_digest(password, ADMIN_PASSWORD):
            return json_response(start_response, HTTPStatus.FORBIDDEN, {"error": "Incorrect admin password."})
        token = secrets.token_urlsafe(32)
        ADMIN_SESSIONS[token] = time.time()
        return json_response(start_response, HTTPStatus.OK, {"ok": True, "token": token, "state": read_admin_state()})

    if method == "POST" and path == "/api/admin/logout":
        token = environ.get("HTTP_X_ADMIN_TOKEN", "")
        ADMIN_SESSIONS.pop(token, None)
        return json_response(start_response, HTTPStatus.OK, {"ok": True})

    if method == "GET" and path == "/api/admin/state":
        if not admin_authorized(environ):
            return json_response(start_response, HTTPStatus.UNAUTHORIZED, {"error": "Admin login required."})
        return json_response(start_response, HTTPStatus.OK, read_admin_state())

    if method == "POST" and path == "/api/admin/state":
        if not admin_authorized(environ):
            return json_response(start_response, HTTPStatus.UNAUTHORIZED, {"error": "Admin login required."})
        write_admin_state(read_json_body(environ))
        return json_response(start_response, HTTPStatus.OK, {"ok": True, "state": read_admin_state()})

    if method == "GET":
        return file_response(start_response, path)

    return json_response(start_response, HTTPStatus.METHOD_NOT_ALLOWED, {"error": "Method not allowed."})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8090"))
    with make_server("0.0.0.0", port, app) as server:
        print(f"The Hannans Club booking app is running at http://127.0.0.1:{port}")
        server.serve_forever()
