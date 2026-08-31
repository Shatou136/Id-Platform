export type Sex = "Male" | "Female";

export type StudentIdCardInput = {
  fullName: string;
  sex: Sex;
  dateOfBirth: string;
  placeOfBirth: string;
  matricule: string;
  programme: string;
  campus: string;
  expiry: string;
  photoSrc: string;
};

export type FormattedCardFields = {
  fullName: string;
  sex: string;
  dateOfBirth: string;
  placeOfBirth: string;
  matricule: string;
  programme: string;
  campus: string;
  validityYear: string;
  photoSrc: string;
};

export function validityYearFromExpiry(expiry: string): string {
  const trimmed = expiry.trim();
  const year = trimmed.match(/^(\d{4})/);
  return year ? year[1] : trimmed;
}

export function formatUkDate(isoDate: string): string {
  const match = isoDate.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return isoDate.trim();
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export function formatCardFields(input: StudentIdCardInput): FormattedCardFields {
  return {
    fullName: input.fullName.trim().toUpperCase(),
    sex: input.sex.trim().toUpperCase(),
    dateOfBirth: formatUkDate(input.dateOfBirth),
    placeOfBirth: input.placeOfBirth.trim().toUpperCase(),
    matricule: input.matricule.trim().toUpperCase(),
    programme: input.programme.trim().toUpperCase(),
    campus: input.campus.trim().toUpperCase(),
    validityYear: validityYearFromExpiry(input.expiry),
    photoSrc: input.photoSrc,
  };
}

export function cardQrPayload(fields: FormattedCardFields): string {
  return [
    "ST LOUIS UNIVERSITY INSTITUTE",
    fields.fullName,
    `MATRICULE: ${fields.matricule}`,
    `SEX: ${fields.sex}`,
    `DATE OF BIRTH: ${fields.dateOfBirth}`,
    `PLACE OF BIRTH: ${fields.placeOfBirth}`,
    `PROGRAM: ${fields.programme}`,
    `CAMPUS: ${fields.campus}`,
    `VALIDITY: ${fields.validityYear}`,
  ].join("\n");
}

/** Typed fields from the photographed card, for layout comparison only. */
export const PHOTOGRAPHED_SPECIMEN: StudentIdCardInput = {
  fullName: "Isatu Mohamadu",
  sex: "Female",
  dateOfBirth: "2004-10-31",
  placeOfBirth: "Kumba",
  matricule: "SE/24/0103",
  programme: "HND Software Engineering",
  campus: "Bonamoussadi",
  expiry: "2026",
  photoSrc: "",
};
