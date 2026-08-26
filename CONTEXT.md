# Student ID Cards

This context is about making and printing photo ID cards for students at one university. The school does all of this work itself.

## Language

**University**:
St. Louis University Institute (SLUI) in Cameroon. All ID card work happens inside this school. Its name, logo, list of Campuses, and list of Programmes live in settings. Only a Super Admin can change them. An Email ending can be stored for later, but we do not lock sign-up to it yet. The app is in English.
_Avoid_: institution, tenant, client

**Student ID Card**:
A physical photo card people look at to see who a student is. The front shows the school name, Photo, full name (one line), Sex, Date of birth, Place of birth, Matricule, Programme, Expiry, Campus, a Barcode, and a QR Code. It does not show a “student number.” The back shows:

REPUBLIC OF CAMEROON  
PEACE-WORK-FATHERLAND  
This STUDENT ID CARD / LIBRARY CARD is the property of ST LOUIS UNIVERSITY INSTITUTE. If found please return to Tel: +237 675 937 038 / 675 708 688, Email: info@slui.org

“Library card” is words on the plastic only. Library staff look at the card. There is no library system in this product.
_Avoid_: digital ID, access card, payment card, badge, library card (as a separate thing)

**Email**:
The address a person uses to sign in. They must click a link sent to that Email before they can send a Request. Students often use Gmail or other mail, not @slui.org. We do not lock the Email ending. Admin checks that the person is a real student. A “forgot password” link is sent to the same Email. A Super Admin can also reset a password.
_Avoid_: school email, username, account (as a synonym for this address)

**Student**:
A person who signs in and asks for a Student ID Card. Their Email is not on the Admin or Super Admin list.
_Avoid_: user, applicant, candidate

**Admin**:
A staff member who checks Requests, may fix typed details, set Expiry, accept or turn down a Request, print Student ID Cards, mark Arrival at a Campus, and mark Pickup as done. Any Admin may mark Arrival and Pickup. They may not change the Photo, school settings, or who is an Admin. Accept and print are two different steps. Until a card is printed, they can take back a yes and turn the Request down instead.
_Avoid_: reviewer, operator, staff (as a synonym)

**Super Admin**:
A staff member who can do everything an Admin can, plus change school settings and add or remove Admins and Super Admins. The person created at setup is the first Super Admin, not a separate kind of user. The last Super Admin cannot be removed.
_Avoid_: first admin, superadmin, root, owner, super user

**Request**:
One ask from a Student for a Student ID Card. It holds the details they typed (including Sex, Date of birth, Place of birth, and Matricule), their Photo, the Campus where they will pick up the card, and a reason: first card, or lost / damaged. If an Admin turns it down, it is still the same Request: the Student fixes it and sends it again. A “no” must include a written reason. The Student sees that reason when they open the app, and they also get a phone ping and an email. They can save a draft before sending. A draft is not an Open Request and Admins do not see it. Once a Request is sent, the Student cannot change it or take it back. They wait for an Admin. If an Admin says no, they can fix it and send it again.
_Avoid_: submission, application, ticket, form (as a name for this thing)

**Open Request**:
A Request that is not yet collected. A Student may have only one Open Request. They may send a lost-card Request only after the last card was collected.
_Avoid_: pending request, active request

**Matricule**:
The number the University gives the Student. It stays valid until the end of their Programme. It is printed on the Student ID Card. Only one Open Request may use a given Matricule. After Pickup, a replacement Request uses the same Matricule.
_Avoid_: student number, ID, user id

**Sex**:
Whether the Student is male or female, as printed on the Student ID Card. The Student picks it on the Request. An Admin may still fix it.
_Avoid_: gender (unless you later say they are different)

**Date of birth**:
The Student’s birth date, as printed on the Student ID Card. The Student types it. An Admin may still fix it.
_Avoid_: birthday, DOB (in speech we can say date of birth)

**Place of birth**:
Where the Student was born, as printed on the Student ID Card. The Student types it. An Admin may still fix it.
_Avoid_: hometown, village, origin

**Programme**:
The study programme shown on the Student ID Card. A Super Admin keeps the list. The Student picks from that list. An Admin may still fix it.
_Avoid_: course, department, major, program

**Expiry**:
When the Student ID Card stops being valid: the end of the Student's Programme. The Admin sets it when they accept the Request. The Student does not pick it.
_Avoid_: expiration, validity date

**Photo**:
The Student's face picture on the Request and on the Student ID Card. It must be one person, face clear, no sunglasses, no hat, looking at the camera. A bad Photo is turned down. An Admin cannot replace it.
_Avoid_: picture, image, headshot, selfie (as the name of this thing)

**Barcode**:
A scannable stripe on the front of the Student ID Card. It holds the same facts as the QR Code: name, Matricule, Sex, Date of birth, Place of birth, Programme, Campus, and Expiry. It is not a link to a website. The system draws it. The Student does not type it.
_Avoid_: scan code (as a name for this thing)

**QR Code**:
A square code on the front of the Student ID Card. A phone can read the same facts as the front: name, Matricule, Sex, Date of birth, Place of birth, Programme, Campus, and Expiry. It is not a link to a website. The system draws it. The Student does not type it. The Barcode holds this same payload.
_Avoid_: QR, qrcode (in writing, use QR Code)

**Print**:
The step that makes the physical Student ID Card, after a Request is accepted. If Print fails, the Request stays accepted and the Admin can try Print again. Cards are printed at one central desk on an Evolis PVC card printer, credit-card size. The Admin on that PC opens a card-sized page and prints from the browser (no Evolis extra kit in v1). Admins may accept Requests from anywhere. After Print, the plastic is sent to the Student's Campus outside this system. Pickup happens at that Campus. The site is on the internet so Students can apply from home.
_Avoid_: export, render, issue (as a synonym for this step)

**Campus**:
A site of the University where a Student picks up their Student ID Card. The Request names the Campus. A Super Admin manages the list of Campuses. An Admin may change the Campus only before Print. After Print, a Campus change means print the same Request again. Print is not at every Campus. It is at one central desk.
_Avoid_: branch, location, site (as the name of this thing)

**Arrival**:
A staff member at the Campus marking that the printed plastic has got there. Only then is the Student told to come. Printed is not the same as ready for Pickup.
_Avoid_: delivered, received, in stock

**Pickup**:
The Student collecting the printed Student ID Card at their Campus, after Arrival. When it is ready, the Student gets a phone ping and an email. An Admin marks it collected when they hand it over.
_Avoid_: delivery, shipping, dispatch
