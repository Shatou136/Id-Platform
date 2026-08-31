# Resend for confirm, turned down, and come collect

Auth confirm can stay in this app until Supabase Auth is wired. “We said no” and “come pick up” are school mail, not printer events. Resend sends those three messages. Pickup mail goes out at Arrival, never at Print.

If `RESEND_API_KEY` is missing, the same copy is written to `data/mail-log.json` so the path can be tried locally. The Student still sees a confirm link in the app until mail is connected.
