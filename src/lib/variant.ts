export type ProfileVariantKey = "software" | "fullstack" | "backend" | "frontend";

export const BASE_PUBLIC_URL = "https://abdelrahman-bio.vercel.app";

export const VARIANT_CODES: Record<ProfileVariantKey, string> = {
  software: "s2q6",
  fullstack: "f8m2",
  backend: "b4x9",
  frontend: "e7k3",
};

/**
 * Opaque URL codes mapped to profile variants so the role name
 * is never exposed in the shared link.
 */
const CODE_TO_VARIANT: Record<string, ProfileVariantKey> = {
  s2q6: "software",
  f8m2: "fullstack",
  b4x9: "backend",
  e7k3: "frontend",
};

export function isCardPrintPage(): boolean {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return path === "cards" || path === "print";
}

export function resolveProfileVariant(): ProfileVariantKey {
  const pathCode = window.location.pathname.replace(/^\/+|\/+$/g, "");
  const queryCode = new URLSearchParams(window.location.search).get("c") ?? "";
  const hashCode = window.location.hash.replace(/^#/, "");

  const code = pathCode || queryCode || hashCode;
  const matched = CODE_TO_VARIANT[code];

  if (matched && (window.location.pathname !== "/" || window.location.search || window.location.hash)) {
    window.history.replaceState(null, "", "/");
  }

  return matched ?? "software";
}
