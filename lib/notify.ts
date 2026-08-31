import { sendComeCollectMail, sendTurnedDownMail } from "@/lib/mail";
import { pingComeCollect, pingTurnedDown } from "@/lib/ping";

export async function notifyTurnedDown(
  to: string,
  fullName: string,
  turnDownReason: string,
) {
  await Promise.all([
    sendTurnedDownMail(to, fullName, turnDownReason),
    pingTurnedDown(to, turnDownReason),
  ]);
}

export async function notifyComeCollect(
  to: string,
  fullName: string,
  campus: string,
) {
  await Promise.all([
    sendComeCollectMail(to, fullName, campus),
    pingComeCollect(to, campus),
  ]);
}
