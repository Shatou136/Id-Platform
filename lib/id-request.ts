import type { StudentIdCardInput } from "@/lib/card-fields";

export type RequestStatus =
  | "draft"
  | "sent"
  | "turned_down"
  | "accepted"
  | "printed"
  | "arrived"
  | "picked_up";

export type RequestReason = "first_card" | "lost_or_damaged";

export type IdRequest = {
  id: string;
  status: RequestStatus;
  reason: RequestReason;
  fields: StudentIdCardInput;
  turnDownReason: string;
  createdAt: string;
  updatedAt: string;
};

export function emptyFields(): StudentIdCardInput {
  return {
    fullName: "",
    sex: "Female",
    dateOfBirth: "",
    placeOfBirth: "",
    matricule: "",
    programme: "",
    campus: "",
    expiry: "",
    photoSrc: "",
  };
}

export function reasonLabel(reason: RequestReason) {
  return reason === "first_card" ? "First card" : "Lost / damaged";
}

export function statusLabel(status: RequestStatus) {
  switch (status) {
    case "draft":
      return "Draft";
    case "sent":
      return "Waiting for Admin";
    case "turned_down":
      return "Turned down";
    case "accepted":
      return "Accepted — not yet printed";
    case "printed":
      return "Printed — not yet at Campus";
    case "arrived":
      return "Ready for Pickup";
    case "picked_up":
      return "Collected";
  }
}
