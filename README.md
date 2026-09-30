# Taksha Nexus website

React and Vite frontend with an Express, Prisma, PostgreSQL backend. Vercel also supports the standalone contact function in api/contact.js.

## Local development

1. Install frontend dependencies with npm ci.
2. In backend, install dependencies with npm ci and configure backend/.env with DATABASE_URL, JWT_SECRET, the existing storage settings, and email settings.
3. In backend, run npx prisma generate. Apply pending migrations only to the intended database using npx prisma migrate deploy after reviewing its migration history.
4. Start the backend with npm start from backend. It listens on port 5000 by default.
5. Start the frontend with npm run dev from the project root. Its /api requests proxy to port 5000.

The backend runs overdue project processing at startup. Use a development database for local testing.

## Hosting

For a separately hosted backend, set VITE_API_URL to its full API base (including /api) before building the frontend. Configure CLIENT_URL on the backend with the public frontend origin. A static frontend alone cannot provide login, applications, or portal data.

Contact delivery requires RESEND_API_KEY in the environment serving /api/contact. Optional INTERNAL_NOTIFICATION_EMAIL and CONTACT_FROM_EMAIL override the recipient and verified sender. Missing credentials return an unavailable error; they never simulate a delivered inquiry. Optional TURNSTILE_SECRET_KEY requires a valid token supplied by the frontend integration; do not enable it without adding a Turnstile widget.

The 20260930000000_portal_preferences_and_leave migration adds stored notification preferences and leave requests. Run it and generate Prisma before deploying these portal changes. It has not been applied automatically to an existing database.

## Verification

- npm run lint: static checks.
- npm test: contact delivery, validation, password settings, leave ownership, preferences, and removal of credential hashes. These tests use simulated email and database adapters and send no emails.
- npm run build: production frontend build.

Live login, storage, email delivery, and database migration require validation in the intended hosting environment. The homepage uses lightweight CSS clay shapes. Shared design tokens and src/styles/design.css define the clay, neumorphic, and brutalist styling.
