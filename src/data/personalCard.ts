export interface PersonalCardFormData {
  name: string;
  jobProfile: string;
  email: string;
  phone: string;
  location: string;
  initiative: string;
  techStackInput: string;
  qrUrl: string;
}

export const EMPTY_PERSONAL_CARD: PersonalCardFormData = {
  name: "",
  jobProfile: "",
  email: "",
  phone: "",
  location: "",
  initiative: "DIGILIANS · MCIT",
  techStackInput: "",
  qrUrl: "",
};

const STORAGE_KEY = "digilians-personal-card-builder-v1";

export function loadPersonalCardData(): PersonalCardFormData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PERSONAL_CARD;
    const parsed = JSON.parse(raw) as Partial<PersonalCardFormData>;
    return {
      ...EMPTY_PERSONAL_CARD,
      ...parsed,
    };
  } catch {
    return EMPTY_PERSONAL_CARD;
  }
}

export function savePersonalCardData(data: PersonalCardFormData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearPersonalCardData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function parseTechStack(input: string): string[] {
  const items = input
    .split(/[,•\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return items.slice(0, 6);
}
