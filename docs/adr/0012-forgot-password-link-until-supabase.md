# Forgot password is an Email link until Supabase Auth

CONTEXT.md: a forgot-password link is sent to the same Email, and a Super Admin can also reset a password. Passwords still live in Supabase Auth (ADR 0002, 0007), which is not wired yet.

Until then, both actions send a sign-in link to that Email. Opening `/reset/[token]` writes the session. We do not store a new password. When Supabase Auth is connected, the same screens become a real password reset.
