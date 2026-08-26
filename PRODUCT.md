# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 on Vercel. Supabase for Postgres, Auth, and Photo files. Prisma for Requests and settings. Tailwind and shadcn for UI. PWA so Students can add the app on a phone. Resend for “we said no” and “come pick up” mail; Auth confirm and reset links may stay on Supabase at first. Confirmed in `docs/adr/0005-next-vercel-supabase.md`. No app scaffold exists in the repo yet.

## Users

**Student:** A person who signs in and asks for a Student ID Card. They apply from home, often on a phone, often with Gmail or other mail rather than @slui.org. Their Email is not on the Admin or Super Admin list. Job: send a Request (first card, or lost / damaged), wait, fix and resend if turned down, then collect the plastic at their Campus after they are told it is ready.

**Admin:** A staff member who checks Requests, may fix typed details, set Expiry, accept or turn down a Request, print Student ID Cards at the central Evolis desk, mark Arrival at a Campus, and mark Pickup as done. Any Admin may mark Arrival and Pickup. They may not change the Photo, school settings, or who is an Admin.

**Super Admin:** A staff member who can do everything an Admin can, plus change school settings and add or remove Admins and Super Admins. The person created at setup is the first Super Admin. The last Super Admin cannot be removed.

All three roles are first-class. The product is for this one university only.

## Product Purpose

SLUI used to send cards to an outside person. This product keeps every step of making and printing Student ID Cards inside the school.

A Student ID Card is a physical photo card people look at to see who a student is. Success is: a Student can request from home; an Admin can check, accept or turn down, and print on the school’s Evolis; Campus staff can mark Arrival then Pickup; the Student is told to come only when the plastic is actually there.

## Positioning

In-house look-at photo ID for St. Louis University Institute only. The mechanism a neighboring product could not truthfully copy is this school’s own Request → accept → central Print → Campus Arrival → Pickup path, with Admin as the human gate (not a school-portal integration, not an outside bureau).

It is not a digital ID, access card, payment card, badge, or a library system. “Library card” is words on the plastic only.

## Operating Context

- One university: St. Louis University Institute (SLUI) in Cameroon. English.
- Students apply from the internet, typically a phone. The app is a PWA; email is the backup when a phone ping never arrives.
- Print is at one central desk on a Windows PC, credit-card size, Evolis PVC printer, from the browser (no Evolis extra kit in v1). Admins may accept Requests from anywhere. After Print, the plastic is sent to the Student’s Campus outside this system.
- Pickup is at the Campus named on the Request, only after Arrival. Pinging at Print time would send Students to an empty desk.
- Passwords live in Supabase Auth. Students must click a confirm link before they can send a Request. Admin still checks that the person is a real student.

## Capabilities and Constraints

**Request:** One ask from a Student. Holds typed details (Sex, Date of birth, Place of birth, Matricule), Photo, pickup Campus, and reason (first card, or lost / damaged). Drafts stay with the Student; Admins do not see them. Once sent, the Student cannot change it or take it back. A Student may have only one Open Request. A lost-card Request is allowed only after the last card was collected. Only one Open Request may use a given Matricule.

**Photo:** Must be one person, face clear, no sunglasses, no hat, looking at the camera. A bad Photo is turned down. An Admin cannot replace it.

**Admin check:** May fix typed details and Campus (Campus only before Print). Sets Expiry (end of Programme) on accept. A “no” must include a written reason; the Student sees it in the app and gets a phone ping and an email. Until Print, an Admin can take back a yes and turn the Request down instead. Accept and Print are separate. If Print fails, the Request stays accepted and Print can be tried again. After Print, a Campus change means print the same Request again.

**Card face (front):** School name, Photo, full name (one line), Sex, Date of birth, Place of birth, Matricule, Programme, Expiry, Campus, a Barcode, and a QR Code. No “student number.” Barcode and QR Code hold the same facts (not a website link); the system draws them.

**Card back (fixed copy):**

REPUBLIC OF CAMEROON
PEACE-WORK-FATHERLAND
This STUDENT ID CARD / LIBRARY CARD is the property of ST LOUIS UNIVERSITY INSTITUTE. If found please return to Tel: +237 675 937 038 / 675 708 688, Email: info@slui.org

**Settings (Super Admin only):** University name, logo, list of Campuses, list of Programmes. An Email ending can be stored for later; sign-up is not locked to it yet.

**Terminology to preserve:** University, Student ID Card, Email, Student, Admin, Super Admin, Request, Open Request, Matricule, Sex, Date of birth, Place of birth, Programme, Expiry, Photo, Barcode, QR Code, Print, Campus, Arrival, Pickup. Do not substitute the avoided synonyms in `CONTEXT.md`.

**Undecided:** Whether the school will later lock sign-up to an Email ending; whether the Evolis developer kit is needed if the Windows driver is not good enough.

## Brand Commitments

- Name: St. Louis University Institute (SLUI). Avoid “institution,” “tenant,” “client.”
- Voice: English, domain vocabulary from `CONTEXT.md`.
- Identity on the card: school name and logo from settings; Cameroon republic lines and the found-card contacts on the back are fixed.
- Official SLUI logo and a photo of an existing printed card will be supplied by the product owner. Until those files are in the repo, do not invent a logo, palette, or card face.

## Evidence on Hand

- Domain record: `CONTEXT.md` and `docs/adr/0001`–`0005`.
- Promised, not yet in the repo: official SLUI logo; photo of an existing printed Student ID Card.
- Absent and must not be fabricated: testimonials, named customers other than SLUI, benchmarks, pricing, press, or a stand-in logo.

## Product Principles

1. Keep every ID-card step inside SLUI. Do not imply an outside bureau, a school-portal login, a digital ID, door access, payment, or a library product.
2. Students request from home on a phone; the school still decides who is real, what is printed, and when to come collect.
3. Accept is not Print, and Print is not ready for Pickup. Arrival is the gate that protects Students from an empty Campus desk.
4. The plastic is the product people look at. Front fields, back copy, Matricule, Photo rules, and codes are facts, not decoration to drop.
5. One university, one Open Request, one central printer. Lists of Campuses and Programmes, and the school logo, live in settings — not hard-coded into the design of the workflow.

## Accessibility & Inclusion

No named WCAG target yet. Students must be able to request from a phone (PWA, small screens, mixed connections). The Print Admin must be able to open a card-sized page and print from a Windows PC at the Evolis desk. Email is the backup when a phone ping never arrives.
