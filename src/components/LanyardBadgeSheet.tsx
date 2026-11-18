import { Fragment, useEffect, useRef, useState } from "react";
import {
  Download,
  ImagePlus,
  Loader2,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
  User,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { QRCodeSVG } from "qrcode.react";

import {
  LanyardBadgePdfDocument,
  type BadgePdfInfo,
} from "@/components/pdf/LanyardBadgePdfDocument";
import { Button } from "@/components/ui/button";
import {
  clearBadgeData,
  DEFAULT_BADGE_LOGOS,
  EMPTY_BADGE_DATA,
  loadBadgeData,
  saveBadgeData,
  type BadgeFormData,
} from "@/data/badgeBuilder";
import { downloadPdfBlob } from "@/lib/pdfUtils";
import { cn } from "@/lib/utils";

export type BadgeThemeId = "1" | "2" | "3" | "4" | "5" | "6";

export interface BadgeThemeMeta {
  id: BadgeThemeId;
  route: string;
  name: string;
  subtitle: string;
}

export const BADGE_THEMES: BadgeThemeMeta[] = [
  {
    id: "1",
    route: "/1",
    name: "1. Digilians Classic",
    subtitle: "Official structured lanyard badge with diagonal lines",
  },
  {
    id: "2",
    route: "/2",
    name: "2. Canva Organic Wave",
    subtitle: "Layered navy & sky-blue SVG waves with circular avatar",
  },
  {
    id: "3",
    route: "/3",
    name: "3. Canva Split Ribbon",
    subtitle: "Vertical-diagonal side ribbon with editorial left alignment",
  },
  {
    id: "4",
    route: "/4",
    name: "4. Canva Dark Event Pass",
    subtitle: "Curved navy event-pass header with floating logo bar & pill badge",
  },
  {
    id: "5",
    route: "/5",
    name: "5. Digilians Dark Split",
    subtitle: "High-contrast dark diagonal split, watermarked portrait & dark brand back",
  },
  {
    id: "6",
    route: "/6",
    name: "6. Royal Navy & Gold Ribbon",
    subtitle: "Sweeping navy & gold-trimmed ribbons with concentric gold portrait rings",
  },
];

function resolveBadgeDisplay(form: BadgeFormData): BadgePdfInfo {
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const location = form.location.trim();
  const program = form.program.trim();
  const track = form.track.trim();
  const qrUrl = form.qrUrl.trim();
  const footerText = form.footerText.trim();

  return {
    name: name ? name.toUpperCase() : "YOUR FULL NAME",
    hasName: Boolean(name),
    email: email || "you@example.com",
    hasEmail: Boolean(email),
    phone: phone || "+20 100 000 0000",
    hasPhone: Boolean(phone),
    location: location || "Cairo",
    hasLocation: Boolean(location),
    program: program ? program.toUpperCase() : "SPECIALIZED DIPLOMA",
    track: track ? track.toUpperCase() : "AI BASED SOFTWARE DEVELOPMENT",
    qrUrl: qrUrl || "https://example.com",
    hasQrUrl: Boolean(qrUrl),
    footerText: footerText || "DiGiLiANS • MCIT • Military Academy • NTI",
    photoDataUrl: form.photoDataUrl,
    logos: form.logos,
  };
}

const DIAGONAL_BG = {
  backgroundImage:
    "repeating-linear-gradient(-35deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 11px)",
};

function BadgeLogosRow({
  logos,
  compact = false,
}: {
  logos: string[];
  compact?: boolean;
}) {
  if (logos.length === 0) return null;
  return (
    <div className="flex items-center justify-between">
      {logos.map((src, index) => (
        <Fragment key={`${src.slice(0, 32)}-${index}`}>
          {index > 0 && (
            <span
              className={cn(
                "w-px shrink-0 bg-slate-300/80",
                compact ? "h-4" : "h-5"
              )}
            />
          )}
          <div
            className={cn(
              "flex flex-1 items-center justify-center px-1",
              compact ? "h-5" : "h-7"
            )}
          >
            <img
              src={src}
              alt={`Header logo ${index + 1}`}
              className={cn(
                "max-w-full object-contain",
                compact ? "max-h-5" : "max-h-7"
              )}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function PunchHole({ light = false }: { light?: boolean }) {
  return (
    <div className="relative z-10 flex justify-center pt-2 pb-1">
      <div
        className={cn(
          "h-2.5 w-2.5 rounded-full border",
          light
            ? "border-sky-200 bg-white"
            : "border-slate-300/80 bg-slate-100/80"
        )}
      />
    </div>
  );
}

function ForumQrCard({
  displayId,
  compact = false,
}: {
  displayId: string;
  compact?: boolean;
}) {
  if (!displayId.trim()) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]",
        compact ? "px-3.5 py-1.5" : "px-4 py-2"
      )}
    >
      <span className="text-[7pt] font-bold tracking-wider text-slate-500 uppercase">
        FORUM ID
      </span>
      <span className="h-3 w-px bg-slate-200" />
      <span className="font-mono text-[8pt] font-bold tracking-wide text-slate-900">
        {displayId}
      </span>
    </div>
  );
}

function PortraitAvatar({
  photoDataUrl,
  circular = false,
}: {
  photoDataUrl: string;
  circular?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white p-[2px] shadow-[0_2px_6px_rgba(15,23,42,0.12)] ring-1 ring-slate-200",
        circular
          ? "h-[2.2cm] w-[2.2cm] rounded-full"
          : "h-[2.5cm] w-[2.05cm] rounded-xl"
      )}
    >
      <div
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden",
          photoDataUrl ? "bg-[#132444]" : "bg-slate-100 text-slate-400",
          circular ? "rounded-full" : "rounded-[10px]"
        )}
      >
        {photoDataUrl ? (
          <img
            src={photoDataUrl}
            alt="Portrait"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <User className="h-6 w-6" />
        )}
      </div>
    </div>
  );
}

function BadgeFrontByTheme({
  themeId,
  d,
  displayId,
}: {
  themeId: BadgeThemeId;
  d: BadgePdfInfo;
  displayId: string;
}) {
  if (themeId === "2") {
    return (
      <div className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-white">
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,0 L255,0 L255,66 C185,90 85,48 0,76 Z" fill="#eff6ff" />
          <path d="M0,0 L255,0 L255,44 C170,66 75,32 0,54 Z" fill="#e0f2fe" />
          <path d="M0,285 C75,264 165,305 255,278 L255,340 L0,340 Z" fill="#bae6fd" />
          <path d="M0,302 C85,284 175,318 255,296 L255,340 L0,340 Z" fill="#172554" />
        </svg>

        <div className="relative z-10">
          <PunchHole />
          <div className="px-4 pt-1">
            <BadgeLogosRow logos={d.logos} compact />
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-1 text-center">
          <PortraitAvatar photoDataUrl={d.photoDataUrl} circular />
          <h2 className="mt-2.5 font-heading text-[13pt] leading-tight font-bold tracking-tight text-slate-900">
            {d.name}
          </h2>
          <div className="mt-1.5 flex flex-col gap-0.5 text-[7.8pt] leading-snug">
            <span className="font-bold text-slate-800">{d.program}</span>
            <span className="font-semibold text-sky-800">{d.track}</span>
          </div>
          <div className="mt-2.5">
            <ForumQrCard displayId={displayId} compact />
          </div>
        </div>

        <div className="relative z-10 pb-1.5 text-center text-[7pt] font-semibold tracking-wider text-white">
          DIGILIANS • الرواد الرقميون
        </div>
      </div>
    );
  }

  if (themeId === "3") {
    return (
      <div className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-white">
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="0,0 24,0 14,340 0,340" fill="#172554" />
          <polygon points="24,0 30,0 20,340 14,340" fill="#0ea5e9" />
          <polygon points="195,0 255,0 255,58" fill="#e0f2fe" />
        </svg>

        <div className="relative z-10">
          <PunchHole />
          <div className="pr-3.5 pl-9 pt-1">
            {d.logos.length > 0 && (
              <div className="rounded-md border border-slate-200/80 bg-white/95 px-2 py-1 shadow-2xs">
                <BadgeLogosRow logos={d.logos} compact />
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center gap-2.5 pr-4 pl-9 text-left">
          <PortraitAvatar photoDataUrl={d.photoDataUrl} />
          <div>
            <h2 className="font-heading text-[12.5pt] leading-tight font-bold tracking-tight text-slate-900">
              {d.name}
            </h2>
            <div className="mt-1.5 flex flex-col border-l-2 border-sky-600 pl-2 text-[7.5pt] leading-snug">
              <span className="font-bold text-slate-800">{d.program}</span>
              <span className="font-semibold text-sky-800">{d.track}</span>
            </div>
          </div>
          <div className="w-fit">
            <ForumQrCard displayId={displayId} compact />
          </div>
        </div>

        <div className="relative z-10 bg-[#172554] px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white">
          DIGILIANS • الرواد الرقميون
        </div>
      </div>
    );
  }

  if (themeId === "4") {
    return (
      <div className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-slate-50/40">
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,0 L255,0 L255,104 Q127.5,134 0,104 Z" fill="#172554" />
          <path d="M0,98 Q127.5,128 255,98 L255,106 Q127.5,136 0,106 Z" fill="#0ea5e9" />
          <polygon points="205,340 255,340 255,294" fill="#e0f2fe" />
        </svg>

        <div className="relative z-10">
          <PunchHole light />
          <div className="px-3.5 pt-1">
            {d.logos.length > 0 && (
              <div className="rounded-md bg-white px-2.5 py-1 shadow-xs">
                <BadgeLogosRow logos={d.logos} compact />
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
          <PortraitAvatar photoDataUrl={d.photoDataUrl} circular />
          <h2 className="mt-2.5 font-heading text-[13pt] leading-tight font-bold tracking-tight text-slate-900">
            {d.name}
          </h2>
          <span className="mt-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[7pt] font-bold tracking-wide text-sky-900">
            {d.program}
          </span>
          <span className="mt-1 text-[7.5pt] font-semibold text-sky-800">
            {d.track}
          </span>
          <div className="mt-2.5">
            <ForumQrCard displayId={displayId} compact />
          </div>
        </div>

        <div className="relative z-10 bg-[#172554] px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white">
          DIGILIANS • الرواد الرقميون
        </div>
      </div>
    );
  }

  if (themeId === "5") {
    return (
      <div className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-white">
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Exact circle centered at (127.5, 88) with r=54 + straight tangent band (slope dx/dy=0.86) */}
          <polygon
            points="0,0 123,0 168.4,52.8 86.6,123.2 0,22.5"
            fill="#0b1120"
          />
          <circle cx="127.5" cy="88" r="54" fill="#0b1120" />
          {/* Top-right triangle with parallel edge (dx/dy≈0.86) & rounded inner corners */}
          <path
            d="M163,0 L255,0 L255,107 Q255,114 249,107 L159,4 Q156,0 163,0 Z"
            fill="#0b1120"
          />
          {/* Bottom-left accent with parallel edge (dx/dy=0.86) */}
          <path
            d="M0,38.5 L42,87.3 Q48,94 43,104 C32,132 18,160 0,185 Z"
            fill="#0b1120"
          />
          {/* Bottom-left lower dark wave */}
          <path
            d="M0,248 C34,268 48,304 62,340 L0,340 Z"
            fill="#0b1120"
          />
          {/* Right-edge cobalt/navy orb accent */}
          <circle cx="244" cy="256" r="38" fill="#172554" />
          <circle cx="244" cy="256" r="24" fill="#1d4ed8" fillOpacity="0.45" />
        </svg>

        {/* Punch hole + DiGiLiANS transparent white-text logo */}
        <div className="relative z-10">
          <PunchHole light />
          <img
            src="/logos/digilians-white.png"
            alt="DiGiLiANS"
            className="absolute top-2.5 left-3 h-8 w-auto object-contain"
          />
        </div>

        {/* Portrait locked to exact circle center (127.5, 88) with diameter 92 */}
        <div
          className="absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-white"
          style={{ top: "12.35%", width: "36.08%", height: "27.06%" }}
        >
          <img
            src="/logos/digilians-full.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto h-4/5 w-4/5 object-contain opacity-15"
          />
          {d.photoDataUrl ? (
            <img
              src={d.photoDataUrl}
              alt="Portrait"
              className="relative z-10 h-full w-full object-cover object-center"
            />
          ) : (
            <User className="relative z-10 h-7 w-7 text-slate-400" />
          )}
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-2 text-center">
          <h2 className="font-heading text-[12.5pt] leading-tight font-bold tracking-tight text-slate-900">
            {d.name}
          </h2>
          <span className="mt-1 text-[7.5pt] font-bold tracking-wide text-slate-800 uppercase">
            {d.track}
          </span>
          <span className="mt-0.5 text-[7pt] font-semibold text-sky-800">
            {d.program}
          </span>

          <div className="mt-2.5">
            <ForumQrCard displayId={displayId} compact />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-3 pb-2.5">
          <img
            src="/logos/military-academy.png"
            alt="Egyptian Military Academy"
            className="h-5 w-auto object-contain"
          />
          <img
            src="/logos/mcit.png"
            alt="MCIT"
            className="h-4 w-auto object-contain mix-blend-multiply"
          />
        </div>
      </div>
    );
  }

  if (themeId === "6") {
    return (
      <div className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-white">
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ribbonCobalt" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f2862" />
              <stop offset="55%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Subtle watermark pattern in upper-right white area */}
          <g opacity="0.045" stroke="#64748b" strokeWidth="1" fill="none">
            <path d="M180 40 L200 52 L200 76 L180 88 L160 76 L160 52 Z" />
            <path d="M220 64 L240 76 L240 100 L220 112 L200 100 L200 76 Z" />
            <path d="M180 88 L200 100 L200 124 L180 136 L160 124 L160 100 Z" />
          </g>

          {/* Top-right sweeping navy + cobalt ribbon */}
          <path d="M148,0 L255,0 L255,112 C226,80 194,26 148,0 Z" fill="#0b152c" />
          <path d="M170,0 C206,24 232,66 255,92 L255,70 C235,48 214,18 192,0 Z" fill="url(#ribbonCobalt)" />
          <path d="M148,0 C194,26 226,80 255,112" stroke="#c8a45d" strokeWidth="1.4" fill="none" />

          {/* Left-side curved dark navy ribbon with inner gold contour */}
          <path d="M0,40 C26,66 44,96 38,128 C34,148 16,170 0,192 Z" fill="#0b152c" />
          <path d="M0,54 C18,74 30,98 25,124 C21,140 10,156 0,170" stroke="#c8a45d" strokeWidth="1.1" fill="none" />
          <path d="M0,40 C26,66 44,96 38,128 C34,148 16,170 0,192" stroke="#c8a45d" strokeWidth="1.2" fill="none" />

          {/* Main sweeping S-wave ribbon across middle */}
          <path
            d="M0,168 C48,124 102,168 158,148 C202,132 234,98 255,58 L255,134 C214,184 162,196 108,180 C64,168 28,190 0,234 Z"
            fill="#0b152c"
          />
          <path
            d="M0,186 C48,148 100,172 158,154 C202,140 232,114 255,78 L255,100 C228,136 192,160 148,164 C96,168 48,156 0,198 Z"
            fill="url(#ribbonCobalt)"
          />
          <path d="M0,168 C48,124 102,168 158,148 C202,132 234,98 255,58" stroke="#c8a45d" strokeWidth="1.4" fill="none" />
          <path d="M0,234 C28,190 64,168 108,180 C162,196 214,184 255,134" stroke="#c8a45d" strokeWidth="1.5" fill="none" />

          {/* Right-edge double-ring cobalt/navy orb */}
          <circle cx="250" cy="246" r="32" fill="#0f1e42" />
          <circle cx="250" cy="246" r="19" fill="#1e3a8a" />

          {/* Bottom-left navy & gold wave */}
          <path d="M0,264 C28,278 52,306 72,340 L0,340 Z" fill="#0b152c" />
          <path d="M0,276 C22,290 40,314 54,340 L34,340 C22,318 10,302 0,292 Z" fill="url(#ribbonCobalt)" />
          <path d="M0,264 C28,278 52,306 72,340" stroke="#c8a45d" strokeWidth="1.4" fill="none" />
        </svg>

        {/* Gold-rimmed punch hole + Top-left DiGiLiANS & Arabic */}
        <div className="relative z-10">
          <div className="flex justify-center pt-2 pb-1">
            <div className="h-3 w-3 rounded-full border-[1.5px] border-[#c8a45d] bg-slate-50 shadow-inner" />
          </div>
          <div className="absolute top-2 left-3">
            <img
              src="/logos/digilians.png"
              alt="DiGiLiANS"
              className="h-11 w-auto object-contain"
            />
          </div>
        </div>

        {/* Clean Navy Ring around Portrait */}
        <div
          className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#0b152c] p-[5px] shadow-md"
          style={{ top: "12.5%", width: "39%", height: "29.25%" }}
        >
          <div className="h-full w-full overflow-hidden rounded-full bg-white p-[2px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#132444]">
              {d.photoDataUrl ? (
                <img
                  src={d.photoDataUrl}
                  alt="Portrait"
                  className="h-full w-full scale-105 object-cover object-center"
                />
              ) : (
                <User className="h-7 w-7 text-slate-300" />
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-3 pb-2 text-center">
          <h2 className="font-heading text-[11pt] leading-tight font-bold tracking-tight text-slate-900">
            {d.name}
          </h2>
          <span className="mt-1 text-[6.8pt] font-bold tracking-wide text-[#0b152c] uppercase">
            {d.track}
          </span>
          <span className="mt-0.5 text-[6.5pt] font-semibold text-[#b08a42]">
            {d.program}
          </span>

          <div className="mt-2.5">
            <ForumQrCard displayId={displayId} compact />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-3.5 pt-0.5 pb-2.5">
          <img
            src="/logos/military-academy.png"
            alt="Egyptian Military Academy"
            className="h-8 w-auto object-contain"
          />
          <span className="h-6 w-px bg-slate-300" />
          <img
            src="/logos/mcit.png"
            alt="MCIT"
            className="h-7 w-auto object-contain mix-blend-multiply"
          />
        </div>
      </div>
    );
  }

  // Theme 1: Digilians Classic
  return (
    <div
      className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50"
      style={DIAGONAL_BG}
    >
      <div>
        <div className="h-2 w-full bg-[#172554]" />
        <PunchHole />
        <div className="px-4 pt-1">
          <BadgeLogosRow logos={d.logos} />
          <div className="relative mt-2 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-2 text-center">
        <PortraitAvatar photoDataUrl={d.photoDataUrl} />
        <h2 className="mt-3 font-heading text-[13.5pt] leading-tight font-bold tracking-tight text-slate-900">
          {d.name}
        </h2>
        <div className="mt-2 flex flex-col gap-0.5 text-[8pt] leading-snug">
          <span className="font-bold text-slate-800">{d.program}</span>
          <span className="font-semibold text-sky-800">{d.track}</span>
        </div>
        <div className="mt-3">
          <ForumQrCard displayId={displayId} />
        </div>
      </div>

      <div className="bg-[#172554] px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white">
        DIGILIANS • الرواد الرقميون
      </div>
    </div>
  );
}

function BadgeBackByTheme({
  themeId,
  d,
}: {
  themeId: BadgeThemeId;
  d: BadgePdfInfo;
}) {
  if (themeId === "6") {
    return (
      <div className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-white text-slate-900">
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M150,0 L255,0 L255,102 C228,74 196,24 150,0 Z" fill="#0b152c" />
          <path d="M168,0 C206,24 232,64 255,86 L255,66 C236,46 214,18 192,0 Z" fill="#1e3a8a" />
          <path d="M150,0 C196,24 228,74 255,102" stroke="#c8a45d" strokeWidth="1.3" fill="none" />
          <path d="M0,44 C24,68 42,96 36,128 C32,148 16,170 0,192 Z" fill="#0b152c" />
          <path d="M0,44 C24,68 42,96 36,128 C32,148 16,170 0,192" stroke="#c8a45d" strokeWidth="1.2" fill="none" />
          <path d="M0,264 C28,278 52,306 72,340 L0,340 Z" fill="#0b152c" />
          <path d="M0,264 C28,278 52,306 72,340" stroke="#c8a45d" strokeWidth="1.3" fill="none" />
        </svg>

        <div className="relative z-10 flex justify-center pt-2 pb-1">
          <div className="h-3 w-3 rounded-full border-[1.5px] border-[#c8a45d] bg-slate-50 shadow-inner" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 text-center">
          <div className="flex flex-col items-center rounded-xl border border-[#c8a45d] bg-white p-3 shadow-[0_2px_8px_rgba(11,21,44,0.08)]">
            <QRCodeSVG
              value={d.qrUrl}
              size={112}
              level="M"
              fgColor={d.hasQrUrl ? "#0b152c" : "#94a3b8"}
              bgColor="#ffffff"
              shapeRendering="crispEdges"
            />
            <span className="mt-2.5 text-[7.5pt] font-bold tracking-widest text-[#0b152c] uppercase">
              {d.hasQrUrl ? "SCAN ME" : "ADD QR URL"}
            </span>
            <span className="text-[7pt] font-semibold text-[#b08a42]">
              CV, Projects &amp; vCard
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-1 text-[7.5pt] font-medium text-slate-600">
            <span className="font-semibold text-slate-800">
              {d.phone} • {d.location}
            </span>
            <span className="break-all text-slate-700">{d.email}</span>
          </div>
        </div>

        <div className="relative z-10 border-t border-[#c8a45d] bg-[#0b152c] px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white">
          {d.footerText}
        </div>
      </div>
    );
  }

  if (themeId === "5") {
    return (
      <div className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-[#0b1120] text-white">
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,0 L76,0 C54,18 42,58 0,68 Z" fill="#ffffff" />
          <path d="M255,0 L179,0 C201,18 213,58 255,68 Z" fill="#ffffff" />
          <circle cx="228" cy="260" r="48" fill="#1e3a8a" fillOpacity="0.28" />
          <circle cx="28" cy="220" r="36" fill="#0284c7" fillOpacity="0.14" />
        </svg>

        <div className="relative z-10 flex flex-col items-center">
          <PunchHole light />
          <img
            src="/logos/digilians-white.png"
            alt="DiGiLiANS"
            className="mt-1 h-16 w-auto object-contain"
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="flex flex-col items-center rounded-xl bg-white p-2.5 shadow-md">
            <QRCodeSVG
              value={d.qrUrl}
              size={112}
              level="M"
              fgColor={d.hasQrUrl ? "#0f172a" : "#94a3b8"}
              bgColor="#ffffff"
              shapeRendering="crispEdges"
            />
            <span className="mt-1.5 text-[7pt] font-bold tracking-widest text-slate-800 uppercase">
              {d.hasQrUrl ? "SCAN ME" : "ADD QR URL"}
            </span>
            <span className="text-[6.5pt] font-medium text-slate-500">
              CV, Projects &amp; vCard
            </span>
          </div>

          <div className="mt-2.5 flex flex-col gap-0.5 text-[7pt]">
            <span className="font-semibold text-slate-200">
              {d.phone} • {d.location}
            </span>
            <span className="break-all text-slate-400">{d.email}</span>
          </div>
        </div>

        <div className="relative z-10 flex justify-center pb-2.5">
          <div className="flex items-center gap-2.5 rounded-md bg-white px-2.5 py-1 shadow-xs">
            <img
              src="/logos/military-academy.png"
              alt="Egyptian Military Academy"
              className="h-4 w-auto object-contain"
            />
            <img
              src="/logos/mcit.png"
              alt="MCIT"
              className="h-3.5 w-auto object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "lanyard-badge-face relative flex flex-col justify-between overflow-hidden text-slate-900",
        themeId === "1"
          ? "bg-gradient-to-br from-slate-50 via-white to-indigo-50/50"
          : "bg-white"
      )}
      style={themeId === "1" ? DIAGONAL_BG : undefined}
    >
      {themeId === "2" && (
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,0 L255,0 L255,66 C185,90 85,48 0,76 Z" fill="#eff6ff" />
          <path d="M0,0 L255,0 L255,44 C170,66 75,32 0,54 Z" fill="#e0f2fe" />
          <path d="M0,285 C75,264 165,305 255,278 L255,340 L0,340 Z" fill="#bae6fd" />
          <path d="M0,302 C85,284 175,318 255,296 L255,340 L0,340 Z" fill="#172554" />
        </svg>
      )}
      {themeId === "3" && (
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="0,0 24,0 14,340 0,340" fill="#172554" />
          <polygon points="24,0 30,0 20,340 14,340" fill="#0ea5e9" />
        </svg>
      )}
      {themeId === "4" && (
        <svg
          viewBox="0 0 255 340"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,0 L255,0 L255,48 Q127.5,68 0,48 Z" fill="#172554" />
          <polygon points="205,340 255,340 255,294" fill="#e0f2fe" />
        </svg>
      )}

      <div className="relative z-10">
        {themeId === "1" && <div className="h-2 w-full bg-[#172554]" />}
        <PunchHole light={themeId === "4"} />
      </div>

      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col items-center justify-center text-center",
          themeId === "3" ? "pr-4 pl-9" : "px-5"
        )}
      >
        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <QRCodeSVG
            value={d.qrUrl}
            size={112}
            level="M"
            fgColor={d.hasQrUrl ? "#0f172a" : "#94a3b8"}
            bgColor="#ffffff"
            shapeRendering="crispEdges"
          />
          <span className="mt-2.5 text-[7.5pt] font-bold tracking-widest text-slate-700 uppercase">
            {d.hasQrUrl ? "SCAN ME" : "ADD QR URL"}
          </span>
          <span className="text-[7pt] font-medium text-slate-500">
            CV, Projects &amp; vCard
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-1 text-[7.5pt] font-medium text-slate-600">
          <span>
            {d.phone} • {d.location}
          </span>
          <span className="break-all text-slate-700">{d.email}</span>
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white",
          themeId === "2" ? "bg-transparent" : "bg-[#172554]"
        )}
      >
        {d.footerText}
      </div>
    </div>
  );
}

export function LanyardBadgeSheet({
  themeId,
  onSelectTheme,
}: {
  themeId: BadgeThemeId;
  onSelectTheme: (id: BadgeThemeId) => void;
}) {
  const [form, setForm] = useState<BadgeFormData>(() => loadBadgeData());
  const [isDownloading, setIsDownloading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const activeTheme =
    BADGE_THEMES.find((t) => t.id === themeId) ?? BADGE_THEMES[0];
  const display = resolveBadgeDisplay(form);
  const displayId = form.forumId.trim();

  useEffect(() => {
    document.title = `${activeTheme.name} — Lanyard Badge Builder (7.5 × 10.5 cm)`;
  }, [activeTheme.name]);

  function updateField<K extends keyof BadgeFormData>(
    key: K,
    value: BadgeFormData[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      saveBadgeData(next);
      return next;
    });
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("photoDataUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("logos", [...form.logos, reader.result]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleReset() {
    clearBadgeData();
    setForm(EMPTY_BADGE_DATA);
  }

  async function downloadBadgePdf() {
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <LanyardBadgePdfDocument
          themeId={themeId}
          info={display}
          platformIdText={displayId}
        />
      ).toBlob();
      const safeName = (form.name.trim() || "lanyard-badge")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      downloadPdfBlob(blob, `${safeName}-badge-7.5x10.5-design-${themeId}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-slate-100 p-4 print:bg-white print:p-0">
      {/* Screen-Only Controls */}
      <div className="mx-auto mb-6 flex max-w-5xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h1 className="font-heading text-base font-bold text-slate-900">
              Badge Builder — {activeTheme.name} (7.5 cm × 10.5 cm)
            </h1>
            <p className="text-xs text-slate-500">
              {activeTheme.subtitle} · Saved locally in your browser
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {BADGE_THEMES.map((theme) => (
              <a
                key={theme.id}
                href={theme.route}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTheme(theme.id);
                }}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                  theme.id === themeId
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                {theme.route} · {theme.name.replace(/^\d+\.\s*/, "")}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => window.print()}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isDownloading}
              onClick={downloadBadgePdf}
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>
                {isDownloading ? "Generating..." : "Download Vector PDF"}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] print:block print:max-w-none">
        {/* Form */}
        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              Full Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Abdelrahman Mahmoud"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              Forum / Event ID (optional)
              <input
                type="text"
                value={form.forumId}
                onChange={(e) => updateField("forumId", e.target.value)}
                placeholder="Leave empty to hide, e.g. DIGI-2026-1098"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              Program
              <input
                type="text"
                value={form.program}
                onChange={(e) => updateField("program", e.target.value)}
                placeholder="Specialized Diploma"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              Track / Specialization
              <input
                type="text"
                value={form.track}
                onChange={(e) => updateField("track", e.target.value)}
                placeholder="AI Based Software Development"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              Phone
              <input
                type="text"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+20 100 000 0000"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              Location
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Cairo"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
              Back Footer Text
              <input
                type="text"
                value={form.footerText}
                onChange={(e) => updateField("footerText", e.target.value)}
                placeholder="DiGiLiANS • MCIT • Military Academy • NTI"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
            QR Code URL (CV, Portfolio, or LinkedIn)
            <input
              type="url"
              value={form.qrUrl}
              onChange={(e) => updateField("qrUrl", e.target.value)}
              placeholder="https://linkedin.com/in/your-profile"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </label>

          {/* Photo & Header Logos */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => photoInputRef.current?.click()}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              <span>{form.photoDataUrl ? "Change Photo" : "Upload Photo"}</span>
            </Button>
            {form.photoDataUrl && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => updateField("photoDataUrl", "")}
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                <span>Remove Photo</span>
              </Button>
            )}

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => logoInputRef.current?.click()}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Header Logo</span>
            </Button>
            {form.logos.length !== DEFAULT_BADGE_LOGOS.length && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => updateField("logos", DEFAULT_BADGE_LOGOS)}
              >
                Restore Default Logos
              </Button>
            )}
          </div>

          {form.logos.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              {form.logos.map((src, idx) => (
                <div
                  key={`${src.slice(0, 24)}-${idx}`}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1"
                >
                  <img
                    src={src}
                    alt={`Logo ${idx + 1}`}
                    className="h-5 w-auto max-w-[48px] object-contain"
                  />
                  <button
                    type="button"
                    aria-label={`Remove logo ${idx + 1}`}
                    onClick={() =>
                      updateField(
                        "logos",
                        form.logos.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Badge Preview / Print Pages */}
        <section className="flex flex-wrap items-start justify-center gap-6 print:block print:max-w-none">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md print:rounded-none print:border-0 print:shadow-none">
            <BadgeFrontByTheme
              themeId={themeId}
              d={display}
              displayId={displayId}
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md print:rounded-none print:border-0 print:shadow-none">
            <BadgeBackByTheme themeId={themeId} d={display} />
          </div>
        </section>
      </div>
    </div>
  );
}
