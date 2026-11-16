import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import {
  BASE_PUBLIC_URL,
  VARIANT_CODES,
  type ProfileVariantKey,
} from "@/lib/variant";
import { cn } from "@/lib/utils";

export type CardThemeId = "1" | "2" | "3" | "4" | "5";

export interface CardThemeMeta {
  id: CardThemeId;
  route: string;
  name: string;
  subtitle: string;
}

export const CARD_THEMES: CardThemeMeta[] = [
  {
    id: "1",
    route: "/1",
    name: "1. Digilians Classic",
    subtitle: "Official structured layout with diagonal lines",
  },
  {
    id: "2",
    route: "/2",
    name: "2. Asymmetric Split",
    subtitle: "Deep navy identity panel + crisp white data zone",
  },
  {
    id: "3",
    route: "/3",
    name: "3. Executive Obsidian",
    subtitle: "Dark matte corporate monolith with cyan accents",
  },
  {
    id: "4",
    route: "/4",
    name: "4. Swiss Framed Grid",
    subtitle: "Architectural blueprint frame with corner markers",
  },
  {
    id: "5",
    route: "/5",
    name: "5. Minimal Typographic",
    subtitle: "Bold Space Grotesk typography & generous whitespace",
  },
];

interface CardSpec {
  key: ProfileVariantKey;
  label: string;
  jobProfile: string;
  qrUrl: string;
}

const CARD_SPECS: CardSpec[] = [
  {
    key: "software",
    label: "Software Engineer",
    jobProfile: "SOFTWARE ENGINEER",
    qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.software}`,
  },
  {
    key: "fullstack",
    label: "Full-Stack Developer",
    jobProfile: "FULL-STACK DEVELOPER",
    qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.fullstack}`,
  },
  {
    key: "backend",
    label: "Back-End Engineer",
    jobProfile: "BACKEND & CLOUD ENGINEER",
    qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.backend}`,
  },
  {
    key: "frontend",
    label: "Front-End Engineer",
    jobProfile: "FRONT-END ENGINEER",
    qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.frontend}`,
  },
];

const DIAGONAL_BG = {
  backgroundImage:
    "repeating-linear-gradient(-35deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 11px)",
};

const DOT_GRID_BG = {
  backgroundImage:
    "radial-gradient(rgba(100, 116, 139, 0.16) 0.75px, transparent 0.75px)",
  backgroundSize: "8px 8px",
};

function LogosRow({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
      <div className={cn("flex items-center justify-center", compact ? "h-5" : "h-7")}>
        <img
          src="/logos/military-academy.png"
          alt="Egyptian Military Academy"
          className={cn("max-w-full object-contain", compact ? "max-h-5" : "max-h-7")}
        />
      </div>
      <span className={cn("w-px bg-slate-300/80", compact ? "h-4" : "h-6")} />
      <div className={cn("flex items-center justify-center px-2", compact ? "h-5" : "h-7")}>
        <img
          src="/logos/digilians.png"
          alt="DiGiLiANS"
          className={cn("max-w-full object-contain", compact ? "max-h-5" : "max-h-7")}
        />
      </div>
      <span className={cn("w-px bg-slate-300/80", compact ? "h-4" : "h-6")} />
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

/* ---------------- THEME 1: DIGILIANS CLASSIC ---------------- */
function ClassicFront({ spec }: { spec: CardSpec }) {
  const rows = [
    { label: "NAME", value: "ABDELRAHMAN MAHMOUD" },
    { label: "EMAIL", value: "abdelrahman.mahmoud.elsaeed" },
    { label: "PROGRAM", value: "SPECIALIZED DIPLOMA" },
    { label: "TRACK", value: "AI BASED SOFTWARE DEVELOPMENT" },
    { label: "JOB PROFILE", value: spec.jobProfile },
  ];

  return (
    <div
      className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 shadow-md"
      style={DIAGONAL_BG}
    >
      <div className="h-1.5 w-full bg-[#172554]" />
      <div className="px-4 pt-1.5">
        <LogosRow />
        <div className="relative mt-1.5 flex items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          <span className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3 px-4 py-1.5">
        <div className="h-[2.35cm] w-[1.95cm] shrink-0 overflow-hidden rounded-lg border border-white bg-[#132444] shadow-md">
          <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[54px_6px_1fr] items-center text-[7.5px] leading-tight">
              <span className="font-medium tracking-wide text-slate-500">{row.label}</span>
              <span className="text-sky-400/80">|</span>
              <span className="truncate font-bold text-slate-900">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-2 pb-1 text-[6.8px] font-medium tracking-wide text-slate-600">
          <span className="h-1 w-1 rounded-full bg-[#172554]" />
          <span>DIGILIANS • الرواد الرقميون</span>
          <span className="h-1 w-1 rounded-full bg-[#172554]" />
        </div>
        <div className="h-1.5 w-full bg-[#172554]" />
      </div>
    </div>
  );
}

/* ---------------- THEME 2: ASYMMETRIC SPLIT ---------------- */
function SplitFront({ spec }: { spec: CardSpec }) {
  const details = [
    { label: "EMAIL", value: "abdelrahman.mahmoud.elsaeed" },
    { label: "PROGRAM", value: "SPECIALIZED DIPLOMA" },
    { label: "TRACK", value: "AI BASED SOFTWARE DEV" },
  ];

  return (
    <div className="id-card-face relative grid grid-cols-[2.9cm_1fr] overflow-hidden border border-slate-200 bg-white shadow-md">
      {/* Left Brand Panel */}
      <div className="flex flex-col items-center justify-between bg-[#172554] px-2.5 py-3 text-center text-white">
        <div className="h-[2.1cm] w-[1.8cm] overflow-hidden border-2 border-white/80 bg-[#132444] shadow-sm">
          <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
        </div>
        <div className="flex flex-col items-center">
          <span className="font-heading text-[8.2px] leading-tight font-bold tracking-wide uppercase">
            Abdelrahman
          </span>
          <span className="font-heading text-[8.2px] leading-tight font-bold tracking-wide text-sky-300 uppercase">
            Mahmoud
          </span>
          <span className="mt-1 border border-sky-400/40 bg-sky-400/15 px-1.5 py-0.5 text-[5.8px] font-semibold tracking-wider text-sky-200 uppercase">
            {spec.jobProfile}
          </span>
        </div>
        <span className="text-[5.8px] tracking-widest text-slate-300/80 uppercase">
          DIGILIANS
        </span>
      </div>

      {/* Right Data Zone */}
      <div className="flex flex-col justify-between bg-white px-3.5 py-2.5">
        <div className="border-b border-slate-100 pb-1.5">
          <LogosRow compact />
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          {details.map((item) => (
            <div key={item.label} className="flex flex-col">
              <span className="text-[6px] font-semibold tracking-wider text-slate-400 uppercase">
                {item.label}
              </span>
              <span className="truncate text-[7.5px] font-bold text-slate-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-[6px] font-medium text-slate-400">
          <span>Cairo, Egypt</span>
          <span>الرواد الرقميون</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- THEME 3: EXECUTIVE OBSIDIAN ---------------- */
function ObsidianFront({ spec }: { spec: CardSpec }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-800 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0F172A] text-white shadow-md">
      {/* Crisp White Top Logo Bar */}
      <div className="bg-white/95 px-4 py-1.5">
        <LogosRow compact />
      </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400" />

      {/* Center Content */}
      <div className="flex flex-1 items-center gap-3.5 px-4 py-2">
        <div className="h-[2.25cm] w-[1.85cm] shrink-0 overflow-hidden border border-sky-400/50 bg-[#132444] shadow-md">
          <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col text-left">
          <span className="w-fit border border-sky-400/30 bg-sky-400/10 px-1.5 py-0.5 text-[6px] font-bold tracking-widest text-sky-300 uppercase">
            {spec.jobProfile}
          </span>
          <h2 className="mt-1.5 font-heading text-[11px] leading-tight font-bold tracking-tight text-white">
            ABDELRAHMAN MAHMOUD
          </h2>
          <span className="mt-0.5 truncate text-[7px] text-slate-300">
            abdelrahman.mahmoud.elsaeed
          </span>

          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-700/80 pt-1.5 text-[6.5px]">
            <div>
              <span className="block text-[5.5px] tracking-wider text-slate-400 uppercase">PROGRAM</span>
              <span className="font-semibold text-slate-100">SPECIALIZED DIPLOMA</span>
            </div>
            <div>
              <span className="block text-[5.5px] tracking-wider text-slate-400 uppercase">TRACK</span>
              <span className="font-semibold text-slate-100">AI SOFTWARE DEV</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex items-center justify-between bg-slate-950/60 px-4 py-1 text-[6px] tracking-wider text-slate-400">
        <span>DIGILIANS • الرواد الرقميون</span>
        <span className="text-sky-400">CAIRO, EGYPT</span>
      </div>
    </div>
  );
}

/* ---------------- THEME 4: SWISS FRAMED GRID ---------------- */
function SwissGridFront({ spec }: { spec: CardSpec }) {
  return (
    <div
      className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-300 bg-white p-2 shadow-md"
      style={DOT_GRID_BG}
    >
      {/* Architectural Inner Frame */}
      <div className="relative flex h-full w-full flex-col justify-between border border-slate-300/90 bg-white/85 px-3 py-2">
        {/* Left Accent Stripe */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-sky-600" />

        {/* Corner Registration Marks */}
        <span className="absolute -top-1.5 -right-1 text-[8px] leading-none text-slate-400">+</span>
        <span className="absolute -bottom-1.5 -right-1 text-[8px] leading-none text-slate-400">+</span>

        <div className="border-b border-slate-200 pb-1.5 pl-1.5">
          <LogosRow compact />
        </div>

        <div className="flex flex-1 items-center gap-3 py-1 pl-1.5">
          <div className="h-[2.15cm] w-[1.8cm] shrink-0 overflow-hidden border border-slate-300 bg-[#132444]">
            <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col text-left">
            <span className="text-[6px] font-bold tracking-widest text-sky-700 uppercase">
              // {spec.jobProfile}
            </span>
            <h2 className="mt-0.5 font-heading text-[10.5px] leading-tight font-bold text-slate-900">
              ABDELRAHMAN MAHMOUD
            </h2>
            <span className="mt-0.5 truncate text-[6.8px] text-slate-500">
              abdelrahman.mahmoud.elsaeed
            </span>
            <div className="mt-1.5 flex flex-col gap-0.5 border-t border-slate-200 pt-1 text-[6.5px] text-slate-700">
              <span>
                <strong className="text-slate-400">PRG:</strong> SPECIALIZED DIPLOMA
              </span>
              <span>
                <strong className="text-slate-400">TRK:</strong> AI BASED SOFTWARE DEV
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-1 pl-1.5 text-[6px] font-semibold tracking-wider text-slate-500 uppercase">
          <span>ID // DIGILIANS</span>
          <span>الرواد الرقميون</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- THEME 5: MINIMAL TYPOGRAPHIC ---------------- */
function MinimalTypographicFront({ spec }: { spec: CardSpec }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-2.5 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
        <div className="w-44">
          <LogosRow compact />
        </div>
        <span className="bg-slate-900 px-1.5 py-0.5 text-[6px] font-bold tracking-widest text-white uppercase">
          AI TRACK
        </span>
      </div>

      <div className="flex flex-1 items-center justify-between gap-3 py-1">
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <span className="text-[6.5px] font-bold tracking-[0.14em] text-sky-600 uppercase">
            {spec.jobProfile}
          </span>
          <h2 className="mt-1 font-heading text-[13px] leading-[1.08] font-bold tracking-tight text-slate-900">
            ABDELRAHMAN
            <br />
            MAHMOUD
          </h2>
          <div className="mt-2 flex flex-col gap-0.5 text-[6.8px] text-slate-500">
            <span className="truncate font-medium text-slate-700">
              abdelrahman.mahmoud.elsaeed
            </span>
            <span>Specialized Diploma • AI Software Dev</span>
          </div>
        </div>

        <div className="h-[2.3cm] w-[1.9cm] shrink-0 overflow-hidden border border-slate-200 bg-[#132444] shadow-sm">
          <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200/80 pt-1 text-[6px] font-medium tracking-wider text-slate-400">
        <span>DIGILIANS • الرواد الرقميون</span>
        <span>CAIRO, EGYPT</span>
      </div>
    </div>
  );
}

/* ---------------- UNIFIED BACK RENDERER PER THEME ---------------- */
function CardBack({ spec, themeId }: { spec: CardSpec; themeId: CardThemeId }) {
  const isDark = themeId === "3";

  return (
    <div
      className={cn(
        "id-card-face relative flex flex-col justify-between overflow-hidden border shadow-md",
        isDark
          ? "border-slate-800 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#0F172A] text-white"
          : "border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-900"
      )}
      style={themeId === "1" ? DIAGONAL_BG : themeId === "4" ? DOT_GRID_BG : undefined}
    >
      <div className={cn("h-1.5 w-full", isDark ? "bg-sky-500" : "bg-[#172554]")} />

      <div className="flex flex-1 items-center justify-between gap-3 px-5 py-2">
        <div className="flex min-w-0 flex-1 flex-col items-start text-left">
          <span
            className={cn(
              "border px-1.5 py-0.5 text-[7px] font-bold tracking-wider uppercase",
              isDark
                ? "border-sky-400/30 bg-sky-400/10 text-sky-300"
                : "border-sky-200/80 bg-sky-50 text-sky-700"
            )}
          >
            {spec.jobProfile}
          </span>
          <h2 className="mt-1.5 font-heading text-[11px] font-bold tracking-tight">
            ABDELRAHMAN MAHMOUD
          </h2>
          <p className={cn("mt-0.5 text-[7.5px] font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
            Scan QR for CV, Projects &amp; vCard
          </p>
          <div className={cn("mt-2 flex flex-col gap-0.5 text-[7px]", isDark ? "text-slate-400" : "text-slate-500")}>
            <span>+20 109 516 0726</span>
            <span>Cairo, Egypt</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center border border-slate-200/90 bg-white p-2 shadow-sm">
          <QRCodeSVG
            value={spec.qrUrl}
            size={84}
            level="M"
            fgColor="#0f172a"
            bgColor="#ffffff"
          />
          <span className="mt-1 text-[6px] font-semibold tracking-widest text-slate-400 uppercase">
            SCAN ME
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={cn("pb-1 text-center text-[6.5px] font-medium tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
          DiGiLiANS • MCIT • Military Academy • NTI
        </div>
        <div className={cn("h-1.5 w-full", isDark ? "bg-sky-500" : "bg-[#172554]")} />
      </div>
    </div>
  );
}

function CardFrontByTheme({ spec, themeId }: { spec: CardSpec; themeId: CardThemeId }) {
  switch (themeId) {
    case "1":
      return <ClassicFront spec={spec} />;
    case "2":
      return <SplitFront spec={spec} />;
    case "3":
      return <ObsidianFront spec={spec} />;
    case "4":
      return <SwissGridFront spec={spec} />;
    case "5":
      return <MinimalTypographicFront spec={spec} />;
  }
}

export function IdCardSheet({
  themeId,
  onSelectTheme,
}: {
  themeId: CardThemeId;
  onSelectTheme: (id: CardThemeId) => void;
}) {
  const [selected, setSelected] = useState<ProfileVariantKey | "all">("all");
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const faceRefs = useRef<
    Record<string, { front: HTMLDivElement | null; back: HTMLDivElement | null }>
  >({});

  const activeTheme = CARD_THEMES.find((t) => t.id === themeId) ?? CARD_THEMES[0];

  useEffect(() => {
    document.title = `${activeTheme.name} — ID Card (8.6 × 5.4 cm)`;
  }, [activeTheme.name]);

  const visibleSpecs =
    selected === "all"
      ? CARD_SPECS
      : CARD_SPECS.filter((item) => item.key === selected);

  async function downloadCardPdf(spec: CardSpec) {
    const refs = faceRefs.current[spec.key];
    if (!refs?.front || !refs?.back) return;

    setDownloadingKey(spec.key);
    try {
      const [frontImg, backImg] = await Promise.all([
        toPng(refs.front, { pixelRatio: 4, cacheBust: true }),
        toPng(refs.back, { pixelRatio: 4, cacheBust: true }),
      ]);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "cm",
        format: [8.6, 5.4],
      });

      pdf.addImage(frontImg, "PNG", 0, 0, 8.6, 5.4);
      pdf.addPage([8.6, 5.4], "landscape");
      pdf.addImage(backImg, "PNG", 0, 0, 8.6, 5.4);
      pdf.save(`Abdelrahman-Mahmoud-${spec.key}-design-${themeId}.pdf`);
    } finally {
      setDownloadingKey(null);
    }
  }

  return (
    <div className="min-h-dvh bg-slate-100 p-4 print:bg-white print:p-0">
      {/* Screen-Only Controls */}
      <div className="mx-auto mb-6 flex max-w-4xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
        {/* Design Route Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h1 className="font-heading text-base font-bold text-slate-900">
              {activeTheme.name} (8.6 cm × 5.4 cm)
            </h1>
            <p className="text-xs text-slate-500">{activeTheme.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {CARD_THEMES.map((theme) => (
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

        {/* Role Filter + Print */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelected("all")}
              className={cn(
                "cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                selected === "all"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              )}
            >
              All 4 Cards
            </button>
            {CARD_SPECS.map((spec) => (
              <button
                key={spec.key}
                type="button"
                onClick={() => setSelected(spec.key)}
                className={cn(
                  "cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                  selected === spec.key
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                {spec.label}
              </button>
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </Button>
        </div>
      </div>

      {/* Cards Preview / Print Pages */}
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 print:max-w-none print:gap-0">
        {visibleSpecs.map((spec) => {
          const isBusy = downloadingKey === spec.key;
          return (
            <div
              key={spec.key}
              className="flex flex-col items-center gap-3 print:block"
            >
              <div className="flex w-full items-center justify-between gap-4 print:hidden">
                <div>
                  <span className="text-sm font-semibold text-slate-800">
                    {spec.label}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">
                    {spec.qrUrl}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => downloadCardPdf(spec)}
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  <span>{isBusy ? "Generating..." : "Download PDF (2 Pages)"}</span>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-4 print:block">
                <div
                  ref={(el) => {
                    faceRefs.current[spec.key] = {
                      ...faceRefs.current[spec.key],
                      front: el,
                    };
                  }}
                >
                  <CardFrontByTheme spec={spec} themeId={themeId} />
                </div>
                <div
                  ref={(el) => {
                    faceRefs.current[spec.key] = {
                      ...faceRefs.current[spec.key],
                      back: el,
                    };
                  }}
                >
                  <CardBack spec={spec} themeId={themeId} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
