import { sendComeCollectMail, sendTurnedDownMail } from "@/lib/mail";
import {
  pingAccepted,
  pingComeCollect,
  pingSent,
  pingTurnedDown,
} from "@/lib/ping";

export async function notifySent(to: string) {
  await pingSent(to);
}

export async function notifyAccepted(to: string) {
  await pingAccepted(to);
}

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
