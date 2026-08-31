# SLUI Student ID Cards

In-house Student ID Card requests, Admin check, Print, Campus Arrival, and Pickup for St. Louis University Institute.

## Run on localhost:3000

```bash
pnpm install
pnpm exec prisma generate
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000). `pnpm dev` is locked to port 3000.

Sign in with any Email. Use `admin@slui.org` and a password of at least 8 characters to enter as Super Admin.

## App routes

| Path | Who |
| --- | --- |
| `/sign-in` | Everyone |
| `/student` | Student |
| `/admin` | Admin and Super Admin |
| `/print` | Admin Print desk |
| `/print/preview` | Card template |
| `/settings` | Super Admin |

Admin pages other than `/admin` have a Back button. On a phone, a Request detail has Back to list.
