# Better Auth is the session system

Sign-in takes Email and a password of at least eight characters. Better Auth stores the password and issues the session cookie. Role still comes from the Admin Email list (`SLUI_ADMIN_EMAILS` / Staff table). Requests persist in Postgres through Prisma so they survive a refresh.
