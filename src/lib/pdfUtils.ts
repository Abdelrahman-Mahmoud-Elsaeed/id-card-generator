import { Font } from "@react-pdf/renderer";
import { ArabicShaper } from "arabic-persian-reshaper";
import QRCode from "qrcode";

const PT_PER_CM = 28.3464567;
export const CARD_PAGE_SIZE: [number, number] = [8.6 * PT_PER_CM, 5.4 * PT_PER_CM];
export const BADGE_PAGE_SIZE: [number, number] = [9 * PT_PER_CM, 12 * PT_PER_CM];

let fontsRegistered = false;

export function ensurePdfFontsRegistered() {
  if (fontsRegistered) return;
  fontsRegistered = true;

  Font.register({
    family: "Inter",
    fonts: [
      { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/Inter-Medium.ttf", fontWeight: 500 },
      { src: "/fonts/Inter-SemiBold.ttf", fontWeight: 600 },
      { src: "/fonts/Inter-Bold.ttf", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "SpaceGrotesk",
    fonts: [{ src: "/fonts/SpaceGrotesk-Bold.ttf", fontWeight: 700 }],
  });

  Font.register({
    family: "Amiri",
    fonts: [{ src: "/fonts/Amiri-Bold.ttf", fontWeight: 700 }],
  });

  // Prevent hyphenation artifacts on names, emails, and job titles
  Font.registerHyphenationCallback((word) => [word]);
}

const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

export function hasArabicText(text: string): boolean {
  return ARABIC_REGEX.test(text);
}

export function shapeArabicText(text: string): string {
  return ArabicShaper.convertArabic(text);
}

export function formatPdfText(text: string): string {
  return hasArabicText(text) ? shapeArabicText(text) : text;
}

export function buildQrSvgPath(value: string): { size: number; path: string } {
  const qr = QRCode.create(value || " ", { errorCorrectionLevel: "M" });
  const { size, data } = qr.modules;
  const parts: string[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (data[row * size + col]) {
        parts.push(`M${col},${row}h1v1h-1z`);
      }
    }
  }

  return { size, path: parts.join("") };
}

export function downloadPdfBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
