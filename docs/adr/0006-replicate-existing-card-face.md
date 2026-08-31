# Replicate the existing printed Student ID Card face

The school already issues plastic cards. Old and new cards will sit in the same wallets and be looked at side by side. Print therefore copies the photographed face rather than inventing a new layout, palette, or logo.

Source of truth for the plastic:

- Front photo: `public/id-front.jpg`
- Back photo: `public/id-back.jpg`
- Official logo: `public/logo.jpg`

The app still uses the domain words Programme and Expiry. The plastic prints those as PROGRAM and VALIDITY (year only), matching the existing card. The Barcode encodes the Matricule (the stripe on the existing card is short). The QR Code encodes the card facts, not a website link.

A staff signature is visible on the photographed Photo. No clean signature file was supplied, so Print does not invent one.

The one spelling correction: the photographed faculties line has “Egineering”; new cards print “Engineering.”
