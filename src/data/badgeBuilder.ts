export interface BadgeFormData {
  name: string;
  program: string;
  track: string;
  forumId: string;
  phone: string;
  email: string;
  location: string;
  qrUrl: string;
  footerText: string;
  photoDataUrl: string;
  logos: string[];
}

export const DEFAULT_BADGE_LOGOS = [
  "/logos/military-academy.png",
  "/logos/digilians.png",
  "/logos/mcit.png",
];

export const EMPTY_BADGE_DATA: BadgeFormData = {
  name: "",
  program: "SPECIALIZED DIPLOMA",
  track: "AI BASED SOFTWARE DEVELOPMENT",
  forumId: "",
  phone: "",
  email: "",
  location: "Cairo",
  qrUrl: "",
  footerText: "DiGiLiANS • MCIT • Military Academy • NTI",
  photoDataUrl: "",
  logos: DEFAULT_BADGE_LOGOS,
};

const STORAGE_KEY = "digilians-badge-builder-v1";

export function loadBadgeData(): BadgeFormData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_BADGE_DATA;
    const parsed = JSON.parse(raw) as Partial<BadgeFormData>;
    return {
      ...EMPTY_BADGE_DATA,
      ...parsed,
      logos: Array.isArray(parsed.logos) ? parsed.logos : DEFAULT_BADGE_LOGOS,
    };
  } catch {
    return EMPTY_BADGE_DATA;
  }
}

export function saveBadgeData(data: BadgeFormData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearBadgeData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
