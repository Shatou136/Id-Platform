# Postgres holds app data; Better Auth holds passwords and sessions

Prisma talks to Postgres for Requests, Person, Staff, Campuses, Programmes, settings, and Better Auth tables. Passwords and sessions live in Better Auth. Photos are stored under `data/photos/` and served through `/api/photos`. Reset links use Better Auth tokens and Resend. Sign-in is enough to send a Request (ADR 0014).
