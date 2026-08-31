# Confirm the Email before Send; store Photos as files

A Student must click a link sent to their Email before they can send a Request (ADR 0002). Until Resend is connected, sign-in issues a confirm token and the Student can open `/confirm/[token]`. Mail will use that same link later.

Photos belong in files, not in the Request row. v1 writes them under `data/photos/` and serves `/api/photos/...`. Supabase Storage can replace the disk later without changing the card face.
