# SLUI Student ID Cards

In-house Student ID Card requests, Admin check, Print, Campus Arrival, and Pickup for St. Louis University Institute.

## Run on localhost:3000

```bash
pnpm install
pnpm exec prisma generate
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000). `pnpm dev` is locked to port 3000.

## Postgres and Better Auth

Copy `.env.example` to `.env` and fill `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`. Local Postgres:

```bash
docker compose up -d
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm dev
```

Better Auth is the only sign-in and session system. Photos are stored under `data/photos/` and served at `/api/photos`. Requests and settings live in Postgres through Prisma.

Sign up with any Email, then sign in. Use `admin@slui.org` and a password of at least 8 characters to enter as Super Admin. New people must sign up before they can sign in.

## App routes

| Path | Who |
| --- | --- |
| `/sign-in` | Everyone |
| `/sign-up` | Everyone |
| `/student` | Student |
| `/pings` | Student |
| `/admin` | Admin and Super Admin |
| `/print` | Admin Print desk |
| `/print/preview` | Card template |
| `/settings` | Super Admin |

Admin pages other than `/admin` have a Back button. On a phone, a Request detail has Back to list.
