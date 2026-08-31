# Email session until Supabase Auth is connected

Passwords will live in Supabase Auth (ADR 0002). This slice still needs a sign-in gate so a Student and an Admin are different people and drafts stay with the Student.

Until Supabase is wired, sign-in takes Email and a password of at least eight characters. The password is not stored. Role comes from the Admin Email list (`SLUI_ADMIN_EMAILS`). Requests persist in SQLite through Prisma so they survive a refresh. Switching the datasource to Supabase Postgres later does not change the Request model.
