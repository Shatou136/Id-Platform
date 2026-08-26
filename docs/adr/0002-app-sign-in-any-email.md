# Our app signs people in; any Email; Admin is the gate

We do not plug into the school portal. Students and staff sign in on this app. Passwords live in Supabase Auth, not in our own tables. Students often use Gmail, not @slui.org, so we do not lock the Email ending. They must click a link before they can send a Request. An Admin still checks that the person is a real student. We can lock the ending later in settings if the school starts issuing student mail.
