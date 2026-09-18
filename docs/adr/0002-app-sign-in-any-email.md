# Our app signs people in; any Email; Admin is the gate

We do not plug into the school portal. Students and staff sign in on this app. Passwords and sessions live in Better Auth. Students often use Gmail, not @slui.org, so we do not lock the Email ending. Sign-in is enough to send a Request (ADR 0014). An Admin still checks that the person is a real student. We can lock the ending later in settings if the school starts issuing student mail.
