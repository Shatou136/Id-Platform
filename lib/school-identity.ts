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

/** Campus dropdown groups. The card prints only the site name, uppercase. */
export const CAMPUS_GROUPS = [
  {
    label: "Bamenda",
    campuses: ["Mile 3, Nkwen", "Upstation Bamenda GRA"],
  },
  {
    label: "Yaounde",
    campuses: ["Simbock", "Ngousso", "Ekoumdoum"],
  },
  {
    label: "Douala",
    campuses: ["Bonaberi", "Ndogbassi", "Bonamoussadi", "Kotto"],
  },
] as const;

export const SEED_CAMPUSES = CAMPUS_GROUPS.flatMap((group) => [
  ...group.campuses,
]);

/** Photographed-card Programme name. Dropped once SEED_PROGRAMMES is written. */
export const PHOTOGRAPHED_PROGRAMME_SEED = "HND Software Engineering";

/** Programme dropdown groups. Names are the PROGRAM line on the Student ID Card. */
export const PROGRAMME_GROUPS = [
  {
    label: "Health & Biomedical Sciences — HND",
    programmes: [
      "HND NURSING",
      "HND MIDWIFERY",
      "HND PHYSIOTHERAPY",
      "HND PHARMACY TECHNOLOGY",
      "HND MEDICAL LAB SCIENCES",
      "HND DENTAL THERAPY",
      "HND MEDICAL IMAGING TECHNOLOGY",
    ],
  },
  {
    label: "Health & Biomedical Sciences — Direct Bachelors",
    programmes: [
      "DIRECT BACHELORS NURSING",
      "DIRECT BACHELORS MIDWIFERY",
      "DIRECT BACHELORS PHYSIOTHERAPY",
      "DIRECT BACHELORS PHARMACY TECHNOLOGY",
      "DIRECT BACHELORS MEDICAL LAB SCIENCES",
      "DIRECT BACHELORS DENTAL THERAPY",
      "DIRECT BACHELORS MEDICAL IMAGING TECHNOLOGY",
    ],
  },
  {
    label: "Health & Biomedical Sciences — Masters",
    programmes: [
      "MASTERS NURSING ANAESTHESIA",
      "MASTERS PEDIATRIC NURSING",
      "MASTERS ONCOLOGY NURSING",
      "MASTERS GERIATRIC NURSING",
      "MASTERS MEDICAL SURGICAL NURSING",
      "MASTERS CHEMICAL PATHOLOGY",
      "MASTERS HEMATOLOGY AND BLOOD BANKING",
      "MASTERS MEDICAL MICROBIOLOGY AND PARASITOLOGY",
      "MASTERS PUBLIC HEALTH",
      "MASTERS MIDWIFERY SCIENCES",
      "MASTERS PHYSIOTHERAPY",
      "MASTERS ORAL HEALTH SCIENCES",
      "MASTERS MEDICAL IMAGING TECHNOLOGY",
      "MASTERS PHARMACEUTICAL ENGINEERING",
    ],
  },
  {
    label: "Engineering & Technology — HND",
    programmes: [
      "HND SOFTWARE ENGINEERING",
      "HND NETWORK AND SECURITY",
      "HND TELECOMMUNICATIONS",
      "HND ELECTRICAL POWER SYSTEMS",
      "HND COMPUTER HARDWARE MAINTENANCE",
    ],
  },
  {
    label: "Engineering & Technology — B-TECH",
    programmes: [
      "B-TECH SOFTWARE ENGINEERING",
      "B-TECH NETWORK AND SECURITY",
      "B-TECH ELECTRICAL ENGINEERING",
    ],
  },
  {
    label: "Agriculture — HND",
    programmes: [
      "HND FOOD PROCESSING TECHNOLOGY",
      "HND CROP PRODUCTION TECHNOLOGY",
      "HND AGRO-PASTORAL ADVICE",
      "HND ANIMAL PRODUCTION TECHNOLOGY",
      "HND AGRICULTURE ECONOMICS AND BUSINESS",
      "HND AGRICULTURAL EXTENSION SERVICES",
    ],
  },
  {
    label: "Agriculture — Direct Bachelors",
    programmes: [
      "DIRECT BACHELORS AGRONOMY",
      "DIRECT BACHELORS ANIMAL PRODUCTION",
      "DIRECT BACHELORS FISHERY AND AQUACULTURE",
      "DIRECT BACHELORS FOOD SCIENCE AND TECHNOLOGY",
      "DIRECT BACHELORS AGRICULTURAL ECONOMICS AND BUSINESS",
      "DIRECT BACHELORS NUTRITION AND DIETETICS",
    ],
  },
] as const;

export const SEED_PROGRAMMES = PROGRAMME_GROUPS.flatMap((group) => [
  ...group.programmes,
]);

export function sortProgrammes(names: string[]) {
  const rank = new Map<string, number>(
    SEED_PROGRAMMES.map((name, index) => [name, index]),
  );
  return [...names].sort((a, b) => {
    const left = rank.get(a);
    const right = rank.get(b);
    if (left != null && right != null) return left - right;
    if (left != null) return -1;
    if (right != null) return 1;
    return a.localeCompare(b);
  });
}

export function officialProgrammes(extra: Iterable<string> = []) {
  const names = new Set<string>(SEED_PROGRAMMES);
  for (const name of extra) {
    const trimmed = name.trim();
    if (trimmed) names.add(trimmed);
  }
  return sortProgrammes([...names]);
}

export function sortCampuses(names: string[]) {
  const rank = new Map<string, number>(
    SEED_CAMPUSES.map((name, index) => [name, index]),
  );
  return [...names].sort((a, b) => {
    const left = rank.get(a);
    const right = rank.get(b);
    if (left != null && right != null) return left - right;
    if (left != null) return -1;
    if (right != null) return 1;
    return a.localeCompare(b);
  });
}

export function officialCampuses(extra: Iterable<string> = []) {
  const names = new Set<string>(SEED_CAMPUSES);
  for (const name of extra) {
    const trimmed = name.trim();
    if (trimmed) names.add(trimmed);
  }
  return sortCampuses([...names]);
}
