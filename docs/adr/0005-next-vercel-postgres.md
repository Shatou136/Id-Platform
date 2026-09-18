# Next.js 16 on Vercel, with Postgres, Prisma, and Better Auth

The site must be on the internet so students can apply from home. We host the app on Vercel. Postgres holds Requests, settings, and Better Auth users and sessions. Prisma talks to that Postgres. Resend sends “we said no”, “come pick up”, and password-reset mail. UI is Tailwind and shadcn. The app is a PWA so students can add it to their phone; email is the backup when the phone ping never arrives.
