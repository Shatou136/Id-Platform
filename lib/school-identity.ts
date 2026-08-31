/** Fixed copy and marks from the photographed SLUI Student ID Card. */

export const SCHOOL = {
  name: "St. Louis University Institute",
  nameOnCard: "ST LOUIS UNIVERSITY INSTITUTE",
  shortName: "SLUI",
  logoSrc: "/logo.jpg",
  facultiesLine:
    "Medical Studies, Engineering & Technology, Agriculture",
  authorisation:
    "AUTHORISATION NO 22-02 902/L/MINESUP/DDES/SD-ESUP/SDA/ANAP OF 09 MAY, 2022",
  frontTitle: "STUDENT IDENTITY CARD",
  phones: "+237 675 937 038 / 675 708 688",
  email: "info@slui.org",
} as const;

export const CARD_BACK = {
  republic: "REPUBLIC OF CAMEROON",
  motto: "PEACE – WORK – FATHERLAND",
  thisWord: "This",
  cardKind: "STUDENT ID CARD/LIBRARY CARD",
  propertyOf: "Is the property of",
  school: SCHOOL.nameOnCard,
  returnTo: "If found, please return to",
  tel: `Tel: ${SCHOOL.phones}`,
  email: `Email: ${SCHOOL.email}`,
} as const;

/** Known from the photographed card. Super Admin will extend these lists. */
export const SEED_CAMPUSES = ["Bonamoussadi"] as const;

export const SEED_PROGRAMMES = ["HND Software Engineering"] as const;
