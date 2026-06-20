# Hosting The Hannans Club Booking App

This folder is ready to deploy as a Python web app.

The local URL `http://127.0.0.1:8090/` cannot be sent to clients. It only works on the computer running the app. To send it to people, deploy this folder to a host and send them the public hosted URL.

## Recommended Option: Render

This folder includes `render.yaml`, so it can be deployed as a Render web service with a persistent disk.

Use:

- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn booking_app:app`
- Persistent disk mount path: `/var/data/hannans`

## Required Environment Variables

Set these in the hosting provider dashboard:

- `HANNANS_ADMIN_PASSWORD`: the password for the admin portal.
- `HANNANS_APP_SECRET`: the same secret used to hash member numbers and phone numbers in the member database.
- `HANNANS_DATA_DIR`: a persistent data folder supplied by the host, for example `/var/data/hannans`.
- `HANNANS_MEMBER_DB_PATH`: full path to the hosted `hannans_club.sqlite3` member database.
- `HANNANS_ADMIN_TIMEOUT_SECONDS`: admin timeout in seconds. Use `300` for 5 minutes.
- `HANNANS_MANAGER_EMAIL`: manager email address for enquiry notifications.
- `HANNANS_SMTP_HOST`: outgoing email server.
- `HANNANS_SMTP_PORT`: usually `587`.
- `HANNANS_SMTP_USERNAME`: outgoing email username.
- `HANNANS_SMTP_PASSWORD`: outgoing email password or app password.
- `HANNANS_SMTP_FROM`: email address shown as the sender.

## Persistent Data

The hosted app writes admin changes to:

`booking_admin_state.json`

inside `HANNANS_DATA_DIR`. This stores added bookings, edited bookings, deleted bookings, cancelled bookings, event notes, checklists, reports data, and staff assignments.

If SMTP is not configured, enquiries will still be saved in admin and the intended emails will be logged in the admin data as not configured.

The member database should be copied to the host as:

`hannans_club.sqlite3`

and `HANNANS_MEMBER_DB_PATH` should point to it.

For Render, use:

`/var/data/hannans/hannans_club.sqlite3`

## Start Command

Most Python hosts can use:

`gunicorn booking_app:app`

The included `Procfile` already contains that command for platforms that support Procfiles.

## Local Test

From this folder:

`pip install -r requirements.txt`

`python booking_app.py`

Then open:

`http://127.0.0.1:8090/`
