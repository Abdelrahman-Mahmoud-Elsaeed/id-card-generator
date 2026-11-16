export interface ProgramOption {
  id: string;
  label: string;
  shortCode: string;
  tracks: string[];
}

export interface JobProfileGroup {
  category: string;
  profiles: string[];
}

export const PROGRAM_OPTIONS: ProgramOption[] = [
  {
    id: "sd",
    label: "Specialized Diploma",
    shortCode: "SD",
    tracks: [
      "AI Based Software Development",
      "AI & Data Science",
      "Applied AI & Data Analytics",
      "Cybersecurity",
    ],
  },
  {
    id: "pm",
    label: "Professional Master",
    shortCode: "PM",
    tracks: [
      "AI Powered Software Development",
      "Artificial Intelligence & Data Science",
      "Business Analytics",
      "Cyber Security",
    ],
  },
];

export const JOB_PROFILE_GROUPS: JobProfileGroup[] = [
  {
    category: "Artificial Intelligence",
    profiles: [
      "Professional Big Data",
      "Data Engineer Specialist",
      "Machine Learning Developer",
    ],
  },
  {
    category: "Software Development",
    profiles: [
      "Professional Mobile App Developer",
      "DevOps Specialist",
      "Professional React Web",
      "Beginner Web Developer",
      "Software Testing Specialist",
    ],
  },
  {
    category: "Infrastructure & CyberSecurity",
    profiles: [
      "Network Administration Specialist",
      "Cisco Network Administration Professional",
      "Cisco Cybersecurity Professional",
      "Vulnerability Analysis & Penetration Testing",
    ],
  },
  {
    category: "Data Analysis",
    profiles: [
      "Professional Data Analyst",
      "Junior Data Analyst",
    ],
  },
  {
    category: "Digital Arts",
    profiles: [
      "Digital Marketing Specialist",
      "Digital Media Production Specialist",
      "Graphic Design Specialist",
      "UI/UX Professional Designer",
    ],
  },
  {
    category: "Applied Technologies",
    profiles: [
      "Agriculture Tech Specialist",
    ],
  },
];

export interface ElementOffset {
  x: number;
  y: number;
}

export const DEFAULT_LOGOS: string[] = [
  "/logos/military-academy.png",
  "/logos/digilians.png",
  "/logos/mcit.png",
];

export interface CardFormData {
  name: string;
  email: string;
  program: string;
  track: string;
  jobProfile: string;
  phone: string;
  location: string;
  qrUrl: string;
  accreditationFooter: string;
  photoDataUrl: string;
  logos: string[];
  elementOffsets: Record<string, ElementOffset>;
}

export const EMPTY_CARD_DATA: CardFormData = {
  name: "",
  email: "",
  program: "Specialized Diploma",
  track: "AI Based Software Development",
  jobProfile: "",
  phone: "",
  location: "Cairo, Egypt",
  qrUrl: "",
  accreditationFooter: "DiGiLiANS • MCIT • Military Academy • NTI",
  photoDataUrl: "",
  logos: [...DEFAULT_LOGOS],
  elementOffsets: {},
};

const STORAGE_KEY = "digilians-id-card-data-v1";

export function loadLocalCardData(): CardFormData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CARD_DATA;
    return { ...EMPTY_CARD_DATA, ...JSON.parse(raw) };
  } catch {
    return EMPTY_CARD_DATA;
  }
}

export function saveLocalCardData(data: CardFormData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors for very large images
  }
}

export function clearLocalCardData(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
