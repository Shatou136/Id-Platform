# Sign in is enough; Admin is still the gate

The in-app “click to confirm Email” step (ADR 0008) was a stand-in until Auth was connected. Students now sign in with Email and password in Better Auth. That is enough to send a Request. An Admin still checks that the person is a real student (ADR 0002). Confirm tokens and the in-app Confirm Email link are no longer issued.
