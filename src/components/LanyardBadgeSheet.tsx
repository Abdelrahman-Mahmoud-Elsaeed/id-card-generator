import { useEffect, useState } from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { QRCodeSVG } from "qrcode.react";

import { LanyardBadgePdfDocument } from "@/components/pdf/LanyardBadgePdfDocument";
import { Button } from "@/components/ui/button";
import { downloadPdfBlob } from "@/lib/pdfUtils";
import { cn } from "@/lib/utils";
import { BASE_PUBLIC_URL, VARIANT_CODES } from "@/lib/variant";

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

const BADGE_INFO = {
  name: "ABDELRAHMAN MAHMOUD",
  email: "abdelrahman.mahmoud.elsaeed@gmail.com",
  phone: "+20 109 516 0726",
  location: "Cairo",
  program: "SPECIALIZED DIPLOMA",
  track: "AI BASED SOFTWARE DEVELOPMENT",
  qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.software}`,
};

const DIAGONAL_BG = {
  backgroundImage:
    "repeating-linear-gradient(-35deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 11px)",
};

function BadgeLogosRow({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
      <div className={cn("flex items-center justify-center", compact ? "h-5" : "h-7")}>
        <img
          src="/logos/military-academy.png"
          alt="Egyptian Military Academy"
          className={cn("max-w-full object-contain", compact ? "max-h-5" : "max-h-7")}
        />
      </div>
      <span className={cn("w-px bg-slate-300/80", compact ? "h-4" : "h-5")} />
      <div className={cn("flex items-center justify-center px-2", compact ? "h-5" : "h-7")}>
        <img
          src="/logos/digilians.png"
          alt="DiGiLiANS"
          className={cn("max-w-full object-contain", compact ? "max-h-5" : "max-h-7")}
        />
      </div>
      <span className={cn("w-px bg-slate-300/80", compact ? "h-4" : "h-5")} />
      <div className={cn("flex items-center justify-center", compact ? "h-5" : "h-7")}>
        <img
          src="/logos/mcit.png"
          alt="MCIT"
          className={cn("max-w-full object-contain mix-blend-multiply", compact ? "max-h-4" : "max-h-6")}
        />
      </div>
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
  platformCode,
  displayId,
  compact = false,
}: {
  platformCode: string;
  displayId: string;
  compact?: boolean;
}) {
  const qrSize = compact ? 44 : 54;
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]",
        compact ? "px-2.5 py-1" : "px-3 py-1.5"
      )}
    >
      {platformCode.trim() ? (
        <QRCodeSVG
          value={platformCode.trim()}
          size={qrSize}
          level="M"
          fgColor="#0f172a"
          bgColor="#ffffff"
          shapeRendering="crispEdges"
        />
      ) : (
        <div
          style={{ width: qrSize, height: qrSize }}
          className="flex items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-center text-[6.5pt] leading-tight font-semibold text-slate-400"
        >
          EVENT
          <br />
          QR
        </div>
      )}
      <div className="flex flex-col text-left">
        <span className="text-[7pt] font-bold tracking-wider text-slate-800 uppercase">
          FORUM ID
        </span>
        <span className="font-mono text-[7pt] font-semibold text-slate-600">
          {displayId}
        </span>
      </div>
    </div>
  );
}

function PortraitAvatar({ circular = false }: { circular?: boolean }) {
  return (
    <div
      className={cn(
        "bg-white p-[2px] shadow-[0_2px_6px_rgba(15,23,42,0.12)] ring-1 ring-slate-200",
        circular ? "h-[2.6cm] w-[2.6cm] rounded-full" : "h-[3cm] w-[2.45cm] rounded-xl"
      )}
    >
      <div
        className={cn(
          "h-full w-full overflow-hidden bg-[#132444]",
          circular ? "rounded-full" : "rounded-[10px]"
        )}
      >
        <img
          src="/me.png"
          alt="Abdelrahman Mahmoud"
          className="h-full w-full object-cover object-[50%_22%]"
        />
      </div>
    </div>
  );
}

function BadgeFrontByTheme({
  themeId,
  platformCode,
  displayId,
}: {
  themeId: BadgeThemeId;
  platformCode: string;
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
            <BadgeLogosRow compact />
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-1 text-center">
          <PortraitAvatar circular />
          <h2 className="mt-2.5 font-heading text-[13pt] leading-tight font-bold tracking-tight text-slate-900">
            {BADGE_INFO.name}
          </h2>
          <div className="mt-1.5 flex flex-col gap-0.5 text-[7.8pt] leading-snug">
            <span className="font-bold text-slate-800">{BADGE_INFO.program}</span>
            <span className="font-semibold text-sky-800">{BADGE_INFO.track}</span>
          </div>
          <div className="mt-2.5">
            <ForumQrCard platformCode={platformCode} displayId={displayId} compact />
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
            <div className="rounded-md border border-slate-200/80 bg-white/95 px-2 py-1 shadow-2xs">
              <BadgeLogosRow compact />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center gap-2.5 pr-4 pl-9 text-left">
          <PortraitAvatar />
          <div>
            <h2 className="font-heading text-[12.5pt] leading-tight font-bold tracking-tight text-slate-900">
              {BADGE_INFO.name}
            </h2>
            <div className="mt-1.5 flex flex-col border-l-2 border-sky-600 pl-2 text-[7.5pt] leading-snug">
              <span className="font-bold text-slate-800">{BADGE_INFO.program}</span>
              <span className="font-semibold text-sky-800">{BADGE_INFO.track}</span>
            </div>
          </div>
          <div className="w-fit">
            <ForumQrCard platformCode={platformCode} displayId={displayId} compact />
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
            <div className="rounded-md bg-white px-2.5 py-1 shadow-xs">
              <BadgeLogosRow compact />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
          <PortraitAvatar circular />
          <h2 className="mt-2.5 font-heading text-[13pt] leading-tight font-bold tracking-tight text-slate-900">
            {BADGE_INFO.name}
          </h2>
          <span className="mt-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[7pt] font-bold tracking-wide text-sky-900">
            {BADGE_INFO.program}
          </span>
          <span className="mt-1 text-[7.5pt] font-semibold text-sky-800">
            {BADGE_INFO.track}
          </span>
          <div className="mt-2.5">
            <ForumQrCard platformCode={platformCode} displayId={displayId} compact />
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
          className="absolute left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full bg-white"
          style={{ top: "12.35%", width: "36.08%", height: "27.06%" }}
        >
          <img
            src="/logos/digilians-full.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto h-4/5 w-4/5 object-contain opacity-15"
          />
          <img
            src="/me.png"
            alt="Abdelrahman Mahmoud"
            className="relative z-10 h-full w-full object-cover object-[50%_22%]"
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-2 text-center">
          <h2 className="font-heading text-[12.5pt] leading-tight font-bold tracking-tight text-slate-900">
            {BADGE_INFO.name}
          </h2>
          <span className="mt-1 text-[7.5pt] font-bold tracking-wide text-slate-800 uppercase">
            {BADGE_INFO.track}
          </span>
          <span className="mt-0.5 text-[7pt] font-semibold text-sky-800">
            {BADGE_INFO.program}
          </span>

          <div className="mt-2.5">
            <ForumQrCard platformCode={platformCode} displayId={displayId} compact />
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
          <circle cx="240" cy="246" r="34" fill="#0f1e42" />
          <circle cx="240" cy="246" r="21" fill="#1e3a8a" />

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
          <div className="absolute top-2 left-3 flex items-center gap-1.5">
            <img
              src="/logos/digilians.png"
              alt="DiGiLiANS"
              className="h-6 w-auto object-contain"
            />
            <span className="text-[7.5pt] font-bold text-slate-900">
              الرواد الرقميون
            </span>
          </div>
        </div>

        {/* Luxury Navy + Concentric Double Gold Rings around Portrait (slightly lower, kissing ribbon) */}
        <div
          className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full border-[1.5px] border-[#c8a45d] bg-[#0b152c] p-[5px] shadow-md"
          style={{ top: "12.5%", width: "39%", height: "29.25%" }}
        >
          <div className="h-full w-full rounded-full border-[1.5px] border-[#c8a45d] bg-[#0b152c] p-[5px]">
            <div className="h-full w-full overflow-hidden rounded-full border border-[#d4af37] bg-[#132444]">
              <img
                src="/me.png"
                alt="Abdelrahman Mahmoud"
                className="h-full w-full scale-105 object-cover object-[50%_20%]"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-4 pb-2 text-center">
          <h2 className="font-heading text-[12.5pt] leading-tight font-bold tracking-tight text-slate-900">
            {BADGE_INFO.name}
          </h2>
          <span className="mt-1 text-[7.5pt] font-bold tracking-wide text-[#0b152c] uppercase">
            {BADGE_INFO.track}
          </span>
          <span className="mt-0.5 text-[7pt] font-semibold text-[#b08a42]">
            {BADGE_INFO.program}
          </span>

          <div className="mt-2.5">
            <ForumQrCard platformCode={platformCode} displayId={displayId} compact />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-2.5 pb-2.5">
          <img
            src="/logos/military-academy.png"
            alt="Egyptian Military Academy"
            className="h-5 w-auto object-contain"
          />
          <span className="h-3.5 w-px bg-slate-300" />
          <img
            src="/logos/mcit.png"
            alt="MCIT"
            className="h-4 w-auto object-contain mix-blend-multiply"
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
          <BadgeLogosRow />
          <div className="relative mt-2 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5 py-2 text-center">
        <PortraitAvatar />
        <h2 className="mt-3 font-heading text-[13.5pt] leading-tight font-bold tracking-tight text-slate-900">
          {BADGE_INFO.name}
        </h2>
        <div className="mt-2 flex flex-col gap-0.5 text-[8pt] leading-snug">
          <span className="font-bold text-slate-800">{BADGE_INFO.program}</span>
          <span className="font-semibold text-sky-800">{BADGE_INFO.track}</span>
        </div>
        <div className="mt-3">
          <ForumQrCard platformCode={platformCode} displayId={displayId} />
        </div>
      </div>

      <div className="bg-[#172554] px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white">
        DIGILIANS • الرواد الرقميون
      </div>
    </div>
  );
}

function BadgeBackByTheme({ themeId }: { themeId: BadgeThemeId }) {
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
          <div className="flex flex-col items-center rounded-xl border border-[#c8a45d] bg-white p-3.5 shadow-[0_2px_8px_rgba(11,21,44,0.08)]">
            <QRCodeSVG
              value={BADGE_INFO.qrUrl}
              size={136}
              level="M"
              fgColor="#0b152c"
              bgColor="#ffffff"
              shapeRendering="crispEdges"
            />
            <span className="mt-2.5 text-[7.5pt] font-bold tracking-widest text-[#0b152c] uppercase">
              SCAN ME
            </span>
            <span className="text-[7pt] font-semibold text-[#b08a42]">
              CV, Projects &amp; vCard
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-1 text-[7.5pt] font-medium text-slate-600">
            <span className="font-semibold text-slate-800">
              {BADGE_INFO.phone} • {BADGE_INFO.location}
            </span>
            <span className="break-all text-slate-700">{BADGE_INFO.email}</span>
          </div>
        </div>

        <div className="relative z-10 border-t border-[#c8a45d] bg-[#0b152c] px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white">
          DiGiLiANS • MCIT • Military Academy • NTI
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
              value={BADGE_INFO.qrUrl}
              size={112}
              level="M"
              fgColor="#0f172a"
              bgColor="#ffffff"
              shapeRendering="crispEdges"
            />
            <span className="mt-1.5 text-[7pt] font-bold tracking-widest text-slate-800 uppercase">
              SCAN ME
            </span>
            <span className="text-[6.5pt] font-medium text-slate-500">
              CV, Projects &amp; vCard
            </span>
          </div>

          <div className="mt-2.5 flex flex-col gap-0.5 text-[7pt]">
            <span className="font-semibold text-slate-200">
              {BADGE_INFO.phone} • {BADGE_INFO.location}
            </span>
            <span className="break-all text-slate-400">{BADGE_INFO.email}</span>
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
        <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <QRCodeSVG
            value={BADGE_INFO.qrUrl}
            size={140}
            level="M"
            fgColor="#0f172a"
            bgColor="#ffffff"
            shapeRendering="crispEdges"
          />
          <span className="mt-2.5 text-[7.5pt] font-bold tracking-widest text-slate-700 uppercase">
            SCAN ME
          </span>
          <span className="text-[7pt] font-medium text-slate-500">
            CV, Projects &amp; vCard
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-1 text-[7.5pt] font-medium text-slate-600">
          <span>
            {BADGE_INFO.phone} • {BADGE_INFO.location}
          </span>
          <span className="break-all text-slate-700">{BADGE_INFO.email}</span>
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white",
          themeId === "2" ? "bg-transparent" : "bg-[#172554]"
        )}
      >
        DiGiLiANS • MCIT • Military Academy • NTI
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
  const [platformCode, setPlatformCode] = useState("");
  const [platformIdText, setPlatformIdText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const activeTheme =
    BADGE_THEMES.find((t) => t.id === themeId) ?? BADGE_THEMES[0];

  const displayId =
    platformIdText.trim() ||
    (platformCode.trim() && !platformCode.trim().startsWith("http")
      ? platformCode.trim()
      : "Platform Code");

  useEffect(() => {
    document.title = `${activeTheme.name} — Lanyard Badge (9 × 12 cm)`;
  }, [activeTheme.name]);

  async function downloadBadgePdf() {
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <LanyardBadgePdfDocument
          themeId={themeId}
          info={BADGE_INFO}
          platformCode={platformCode}
          platformIdText={platformIdText}
        />
      ).toBlob();
      downloadPdfBlob(
        blob,
        `Abdelrahman-Mahmoud-badge-9x12-design-${themeId}.pdf`
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-slate-100 p-4 print:bg-white print:p-0">
      {/* Screen-Only Controls */}
      <div className="mx-auto mb-6 flex max-w-4xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h1 className="font-heading text-base font-bold text-slate-900">
              {activeTheme.name} (9 cm × 12 cm)
            </h1>
            <p className="text-xs text-slate-500">{activeTheme.subtitle}</p>
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
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <input
              id="forum-platform-code"
              type="text"
              value={platformCode}
              onChange={(e) => setPlatformCode(e.target.value)}
              placeholder="Forum QR URL or Code..."
              aria-label="Forum QR URL or Code"
              className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
            <input
              id="forum-platform-id-text"
              type="text"
              value={platformIdText}
              onChange={(e) => setPlatformIdText(e.target.value)}
              placeholder="Manual ID Number (e.g. #1042)..."
              aria-label="Manual ID Number"
              className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </div>

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
              <span>{isDownloading ? "Generating..." : "Download PDF (2 Pages)"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Badge Preview / Print Pages */}
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6 print:block print:max-w-none">
        <div className="border border-slate-200 shadow-md print:border-0 print:shadow-none">
          <BadgeFrontByTheme
            themeId={themeId}
            platformCode={platformCode}
            displayId={displayId}
          />
        </div>
        <div className="border border-slate-200 shadow-md print:border-0 print:shadow-none">
          <BadgeBackByTheme themeId={themeId} />
        </div>
      </div>
    </div>
  );
}
