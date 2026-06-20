# Sharing The Hannans Club Booking App

The local link, `http://127.0.0.1:8090/`, only works on this computer.

To send the app to other people, deploy this folder to a web host. Once hosted, you will send clients the public URL from the host, for example:

`https://hannans-club-booking.onrender.com`

## Recommended Host

Render is the simplest option for this app because it supports Python apps and persistent storage.

## Files Included

- `booking_app.py`: the hosted web app.
- `index.html`, `app.js`, `styles.css`, `assets/`: the booking interface.
- `bookings-data.js`: imported 2026 events.
- `requirements.txt`: hosting dependencies.
- `Procfile`: start command for Procfile hosts.
- `render.yaml`: Render deployment setup.
- `.env.example`: environment variables to set on the host.

## Important

Do not send people the local `127.0.0.1` link. It will only open on the machine running the app.

The hosted app needs these environment variables:

- `HANNANS_ADMIN_PASSWORD`
- `HANNANS_APP_SECRET`
- `HANNANS_DATA_DIR`
- `HANNANS_MEMBER_DB_PATH`
- `HANNANS_ADMIN_TIMEOUT_SECONDS`

The member database file should be uploaded to the host as:

`/var/data/hannans/hannans_club.sqlite3`

The booking admin state will be saved at:

`/var/data/hannans/booking_admin_state.json`

## What To Send Clients

Send clients only the public hosted URL.

Keep the admin password private.
