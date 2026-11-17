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
    family: "Cairo",
    fonts: [{ src: "/fonts/Cairo-SemiBold.ttf", fontWeight: 600 }],
  });

  // Prevent hyphenation artifacts on names, emails, and job titles
  Font.registerHyphenationCallback((word) => [word]);
}

export function shapeArabicText(text: string): string {
  const shaped = ArabicShaper.convertArabic(text);
  return [...shaped].reverse().join("");
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
