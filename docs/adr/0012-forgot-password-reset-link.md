# Forgot password is an Email link through Better Auth

CONTEXT.md: a forgot-password link is sent to the same Email, and a Super Admin can also reset a password. Both actions go through Better Auth. Opening `/reset/[token]` lets the person choose a new password, then they sign in with it.
