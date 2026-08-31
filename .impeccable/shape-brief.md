# Shape brief: Request → Pickup

Confirmed. Do not re-interview.

## Job and audience

Operate mode. Signed-in Students on a phone at home. Signed-in Admins at a desk, including the Windows Evolis PC. Super Admin settings are out of this brief.

Students need to know what to do next. Admins need to clear a short queue without mixing up accept, Print, and Pickup.

## Outcome and proof

The Student sends one Request. The Admin accepts or turns it down (with a written reason), Prints, marks Arrival, then Pickup.

Success: nobody is told to collect before the plastic is at the Campus. Accept is never treated as Print. The Photo is a real face you can judge.

Use real SLUI fields. Do not invent a logo, quotes, or other schools.

## Selected direction

A normal school admin app, played straight. Standing visual preference in PRODUCT.md.

Craft bar: cardPresso (the Print job), a university self-service portal (the Student phone flow), Linear (the Admin list). Copy their craft, not their logo.

Desk: sidebar + list + detail. Phone: no sidebar, status first, one main button.

The loudest thing on every screen is the next step: Send Request, turn down with a reason, Print, Mark Arrival, Come collect.

Build with Next.js, Tailwind, and shadcn, code-first. No poster look.

## Scope and boundaries

Full path, all real states, after sign-in.

Out: sign-up, forgot password, first Super Admin setup, school settings.

Do not change card fields, back copy, Photo rules, or the words in CONTEXT.md.

Do not build a digital ID, a library app, or a “ready” ping at Print time.

## States and ranges

A few Campuses, a few dozen Programmes, tens of Open Requests.

Student: no Request, draft, waiting, turned down, accepted, printed (not ready), arrived (come collect), picked up.

Admin: empty queue, short list, detail, accept (set Expiry), turn down, take back a yes before Print, Print preview, Print failed (still accepted), Arrival, Pickup.

Also: loading, error, Student vs Admin.

## Interaction and layout

Phone: one job per screen. Photo big enough to check. Main button stays in reach.

Desk: sidebar for to-check / to-Print / at Campus. Rows show name, Matricule, Campus, reason, Photo thumb.

Print is a credit-card page in the browser.

Empty states say the next step, not “nothing here.”

## Constraints and open

Web PWA. English. Mixed phone networks. Windows print desk.

Logo and an existing-card photo will be supplied. Use labeled blanks until then.

Still open: real Campus and Programme names; later Email-ending lock.
