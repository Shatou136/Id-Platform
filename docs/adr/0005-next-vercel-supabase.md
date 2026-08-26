# Next.js 16 on Vercel, with Supabase and Prisma

The site must be on the internet so students can apply from home. We host the app on Vercel. Supabase holds Postgres, Auth, and Photo files. Prisma talks to that Postgres for Requests and settings. Resend sends “we said no” and “come pick up” mail, because Supabase’s built-in mail is too small for real use. Auth confirm and reset links can stay on Supabase at first. UI is Tailwind and shadcn. The app is a PWA so students can add it to their phone; email is the backup when the phone ping never arrives.
