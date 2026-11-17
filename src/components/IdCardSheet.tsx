import { useEffect, useState } from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { QRCodeSVG } from "qrcode.react";

import { PersonalCardPdfDocument } from "@/components/pdf/PersonalCardPdfDocument";
import { Button } from "@/components/ui/button";
import { downloadPdfBlob } from "@/lib/pdfUtils";
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
    name: "2. Canva Organic Wave",
    subtitle: "Layered navy & sky SVG waves on crisp white canvas",
  },
  {
    id: "3",
    route: "/3",
    name: "3. Canva Diagonal Ribbon",
    subtitle: "Geometric diagonal navy & cyan corporate ribbon",
  },
  {
    id: "4",
    route: "/4",
    name: "4. Canva Curved Header",
    subtitle: "Curved navy-blue wave header & clean structured details",
  },
  {
    id: "5",
    route: "/5",
    name: "5. Canva Corner Geometry",
    subtitle: "Modern dual-tone corner ribbons & tech badge style",
  },
];

interface CardSpec {
  key: ProfileVariantKey;
  label: string;
  jobProfile: string;
  techStack: string[];
  qrUrl: string;
}

const PERSONAL_INFO = {
  name: "ABDELRAHMAN MAHMOUD",
  email: "abdelrahman.mahmoud.elsaeed@gmail.com",
  phone: "+20 109 516 0726",
  location: "Cairo",
  initiative: "DIGILIANS - MCIT",
};

const CARD_SPECS: CardSpec[] = [
  {
    key: "software",
    label: "Software Engineer",
    jobProfile: "SOFTWARE ENGINEER",
    techStack: ["System Design", "REST APIs", "TypeScript", "Databases", "CI/CD", "Cloud"],
    qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.software}`,
  },
  {
    key: "fullstack",
    label: "Full-Stack Developer",
    jobProfile: "FULL-STACK DEVELOPER",
    techStack: ["Next.js", "React", "Node.js", "Express", "PostgreSQL", "Docker"],
    qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.fullstack}`,
  },
  {
    key: "backend",
    label: "Back-End Engineer",
    jobProfile: "BACKEND & CLOUD ENGINEER",
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis", "AWS", "Terraform"],
    qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.backend}`,
  },
  {
    key: "frontend",
    label: "Front-End Engineer",
    jobProfile: "FRONT-END ENGINEER",
    techStack: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "UI Systems", "Web Perf"],
    qrUrl: `${BASE_PUBLIC_URL}/${VARIANT_CODES.frontend}`,
  },
];

const DIAGONAL_BG = {
  backgroundImage:
    "repeating-linear-gradient(-35deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 11px)",
};

function InitiativeText({ light = false }: { light?: boolean }) {
  return (
    <span
      className={cn(
        "text-[7pt] font-semibold tracking-[0.16em] uppercase",
        light ? "text-sky-200" : "text-slate-500"
      )}
    >
      DIGILIANS · MCIT
    </span>
  );
}

/* ---------------- THEME 1: DIGILIANS CLASSIC ---------------- */
function ClassicFront({ spec, showPhoto }: { spec: CardSpec; showPhoto: boolean }) {
  return (
    <div
      className="id-card-face relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50"
      style={DIAGONAL_BG}
    >
      <div className="h-1.5 w-full bg-[#172554]" />

      <div className={cn("flex flex-1 items-center gap-4 py-2", showPhoto ? "px-4" : "px-6")}>
        {showPhoto && (
          <div className="h-[2.3cm] w-[1.85cm] shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#132444] shadow-md">
            <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col text-left">
          <h2
            className={cn(
              "font-heading leading-tight font-bold tracking-tight text-slate-900",
              showPhoto ? "text-[11pt]" : "text-[12.5pt]"
            )}
          >
            {PERSONAL_INFO.name}
          </h2>
          <p className="mt-1 text-[8pt] font-bold tracking-[0.14em] text-sky-800 uppercase">
            {spec.jobProfile}
          </p>

          <div className="mt-3 flex flex-col gap-0.5 border-t border-slate-200/90 pt-2">
            <span className="text-[7.5pt] font-semibold break-all text-slate-700">
              {PERSONAL_INFO.email}
            </span>
            <span className="text-[7pt] font-medium text-slate-500">
              {PERSONAL_INFO.phone}  •  {PERSONAL_INFO.location}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={cn("flex items-center justify-end pb-1", showPhoto ? "px-4" : "px-6")}>
          <InitiativeText />
        </div>
        <div className="h-1.5 w-full bg-[#172554]" />
      </div>
    </div>
  );
}

/* ---------------- THEME 2: CANVA ORGANIC WAVE ---------------- */
function CanvaOrganicWaveFront({ spec, showPhoto }: { spec: CardSpec; showPhoto: boolean }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden bg-white">
      {/* Canva Layered Bottom-Right Organic SVG Waves */}
      <svg
        viewBox="0 0 320 200"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,144 C75,172 155,108 320,138 L320,200 L0,200 Z"
          fill="#e0f2fe"
        />
        <path
          d="M0,164 C95,180 185,126 320,156 L320,200 L0,200 Z"
          fill="#172554"
        />
        <path
          d="M0,0 L115,0 C82,34 38,38 0,68 Z"
          fill="#eff6ff"
        />
      </svg>

      {/* Center Content */}
      <div className={cn("relative z-10 flex flex-1 items-center gap-4 pt-3 pb-1", showPhoto ? "px-4" : "px-6")}>
        {showPhoto && (
          <div className="h-[2.2cm] w-[1.8cm] shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#132444] shadow-md ring-1 ring-sky-200">
            <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col text-left">
          <h2
            className={cn(
              "font-heading leading-tight font-bold text-slate-900",
              showPhoto ? "text-[11pt]" : "text-[12.5pt]"
            )}
          >
            {PERSONAL_INFO.name}
          </h2>
          <span className="mt-1 text-[8pt] font-bold tracking-[0.14em] text-sky-800 uppercase">
            {spec.jobProfile}
          </span>
          <span className="mt-2.5 text-[7.5pt] font-semibold break-all text-slate-700">
            {PERSONAL_INFO.email}
          </span>
        </div>
      </div>

      {/* Footer sitting cleanly on the Navy Wave */}
      <div className={cn("relative z-10 flex items-center justify-between pb-1.5 text-[7pt] font-semibold tracking-wider text-white", showPhoto ? "px-4" : "px-6")}>
        <span className="text-sky-200">{PERSONAL_INFO.phone}  •  {PERSONAL_INFO.location}</span>
        <InitiativeText light />
      </div>
    </div>
  );
}

/* ---------------- THEME 3: CANVA DIAGONAL RIBBON ---------------- */
function CanvaDiagonalRibbonFront({ spec, showPhoto }: { spec: CardSpec; showPhoto: boolean }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden bg-white">
      {/* Canva Diagonal Geometric Shapes */}
      <svg
        viewBox="0 0 320 200"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="242,0 320,0 320,200 198,200" fill="#172554" />
        <polygon points="222,0 245,0 201,200 178,200" fill="#0ea5e9" />
        <polygon points="210,0 222,0 178,200 166,200" fill="#bae6fd" />
      </svg>

      <div className="relative z-10 h-2" />

      {/* Main Content */}
      <div className={cn("relative z-10 flex flex-1 items-center gap-3.5 py-1", showPhoto ? "px-4" : "px-6")}>
        {showPhoto && (
          <div className="h-[2.2cm] w-[1.8cm] shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#132444] shadow-md">
            <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col text-left">
          <div className="border border-slate-200/90 bg-white/95 px-3 py-2.5 shadow-sm">
            <h2
              className={cn(
                "font-heading leading-tight font-bold text-slate-900",
                showPhoto ? "text-[10.5pt]" : "text-[11.5pt]"
              )}
            >
              {PERSONAL_INFO.name}
            </h2>
            <p className="mt-0.5 text-[7.5pt] font-bold tracking-[0.14em] text-sky-800 uppercase">
              {spec.jobProfile}
            </p>
            <div className="mt-2 border-t border-slate-200 pt-1.5 text-[7.5pt] font-semibold break-all text-slate-700">
              {PERSONAL_INFO.email}
            </div>
          </div>
        </div>
      </div>

      <div className={cn("relative z-10 flex items-center justify-between pb-1.5", showPhoto ? "px-4" : "px-6")}>
        <span className="text-[7pt] font-semibold text-slate-600">{PERSONAL_INFO.phone}  •  {PERSONAL_INFO.location}</span>
        <InitiativeText light />
      </div>
    </div>
  );
}

/* ---------------- THEME 4: CANVA CURVED HEADER ---------------- */
function CanvaCurvedHeaderFront({ spec, showPhoto }: { spec: CardSpec; showPhoto: boolean }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden bg-slate-50/40">
      {/* Navy Header Banner */}
      <div className={cn("relative z-10 bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#0284c7] py-2 text-white", showPhoto ? "px-4" : "px-6")}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[8pt] font-bold tracking-[0.14em] uppercase">
            {spec.jobProfile}
          </span>
          <InitiativeText light />
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("relative z-10 flex flex-1 items-center gap-4 py-1.5", showPhoto ? "px-4" : "px-6")}>
        {showPhoto && (
          <div className="h-[2.2cm] w-[1.8cm] shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#132444] shadow-md ring-1 ring-slate-200">
            <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
          <h2
            className={cn(
              "font-heading leading-tight font-bold text-slate-900",
              showPhoto ? "text-[11pt]" : "text-[12.5pt]"
            )}
          >
            {PERSONAL_INFO.name}
          </h2>
          <p className="text-[7.5pt] font-semibold break-all text-sky-800">
            {PERSONAL_INFO.email}
          </p>
          <p className="text-[7pt] font-medium text-slate-500">
            {PERSONAL_INFO.phone}  •  {PERSONAL_INFO.location}
          </p>
        </div>
      </div>

      {/* Bottom Navy Accent */}
      <div className="h-1.5 w-full bg-[#172554]" />
    </div>
  );
}

/* ---------------- THEME 5: CANVA CORNER GEOMETRY ---------------- */
function CanvaCornerGeometryFront({ spec, showPhoto }: { spec: CardSpec; showPhoto: boolean }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden bg-white">
      {/* Canva Geometric Corner Ribbons */}
      <svg
        viewBox="0 0 320 200"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="0,145 78,200 0,200" fill="#172554" />
        <polygon points="0,165 50,200 0,200" fill="#0ea5e9" />
        <polygon points="245,0 320,0 320,55" fill="#e0f2fe" />
        <polygon points="278,0 320,0 320,32" fill="#172554" />
      </svg>

      <div className="relative z-10 h-2" />

      {/* Center Content */}
      <div className={cn("relative z-10 flex flex-1 items-center gap-4 py-1", showPhoto ? "px-4" : "px-6")}>
        {showPhoto && (
          <div className="h-[2.2cm] w-[1.8cm] shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#132444] shadow-md ring-1 ring-slate-200">
            <img src="/me.png" alt="Abdelrahman Mahmoud" className="h-full w-full object-cover object-[50%_22%]" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col text-left">
          <h2
            className={cn(
              "font-heading leading-tight font-bold text-slate-900",
              showPhoto ? "text-[11pt]" : "text-[12.5pt]"
            )}
          >
            {PERSONAL_INFO.name}
          </h2>
          <span className="mt-1 text-[8pt] font-bold tracking-[0.14em] text-sky-800 uppercase">
            {spec.jobProfile}
          </span>
          <span className="mt-2.5 text-[7.5pt] font-semibold break-all text-slate-700">
            {PERSONAL_INFO.email}
          </span>
          <span className="mt-0.5 text-[7pt] font-medium text-slate-500">
            {PERSONAL_INFO.phone}  •  {PERSONAL_INFO.location}
          </span>
        </div>
      </div>

      <div className={cn("relative z-10 flex items-center justify-end pb-1.5", showPhoto ? "px-4" : "px-6")}>
        <InitiativeText />
      </div>
    </div>
  );
}

/* ---------------- UNIFIED BACK RENDERER PER THEME ---------------- */
function CardBack({ spec, themeId }: { spec: CardSpec; themeId: CardThemeId }) {
  const skillRows = [
    spec.techStack.slice(0, 2),
    spec.techStack.slice(2, 4),
    spec.techStack.slice(4, 6),
  ].filter((row) => row.length > 0);

  return (
    <div
      className="id-card-face relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-900"
      style={themeId === "1" ? DIAGONAL_BG : undefined}
    >
      {themeId === "2" && (
        <svg
          viewBox="0 0 320 200"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,172 C90,186 180,152 320,170 L320,200 L0,200 Z" fill="#172554" />
        </svg>
      )}
      {themeId === "3" && (
        <svg
          viewBox="0 0 320 200"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="0,0 24,0 10,200 0,200" fill="#172554" />
          <polygon points="24,0 30,0 16,200 10,200" fill="#0ea5e9" />
        </svg>
      )}

      <div className="relative z-10 h-1.5 w-full bg-[#172554]" />

      <div
        className={cn(
          "relative z-10 flex flex-1 items-center justify-between gap-4",
          themeId === "2" ? "pt-1.5 pb-4" : "py-2",
          themeId === "3" ? "pr-5 pl-8" : "px-6"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center text-left">
          <div className="flex flex-col gap-1.5 border-l-2 border-[#172554] pl-3 text-[7.5pt] leading-snug font-semibold text-slate-800">
            {skillRows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center gap-2 whitespace-nowrap">
                <span>{row[0]}</span>
                {row[1] && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span>{row[1]}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center border border-slate-200 bg-white p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <QRCodeSVG
            value={spec.qrUrl}
            size={72}
            level="M"
            fgColor="#0f172a"
            bgColor="#ffffff"
            shapeRendering="crispEdges"
          />
          <span className="mt-1 text-[7pt] leading-none font-bold tracking-wider text-slate-700 uppercase">
            SCAN ME
          </span>
          <span className="mt-0.5 text-[7pt] leading-none font-medium text-slate-500">
            CV &amp; Projects
          </span>
        </div>
      </div>

      {themeId !== "2" && <div className="relative z-10 h-1.5 w-full bg-[#172554]" />}
    </div>
  );
}

function CardFrontByTheme({
  spec,
  themeId,
  showPhoto,
}: {
  spec: CardSpec;
  themeId: CardThemeId;
  showPhoto: boolean;
}) {
  switch (themeId) {
    case "1":
      return <ClassicFront spec={spec} showPhoto={showPhoto} />;
    case "2":
      return <CanvaOrganicWaveFront spec={spec} showPhoto={showPhoto} />;
    case "3":
      return <CanvaDiagonalRibbonFront spec={spec} showPhoto={showPhoto} />;
    case "4":
      return <CanvaCurvedHeaderFront spec={spec} showPhoto={showPhoto} />;
    case "5":
      return <CanvaCornerGeometryFront spec={spec} showPhoto={showPhoto} />;
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
  const [showPhoto, setShowPhoto] = useState(false);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const activeTheme = CARD_THEMES.find((t) => t.id === themeId) ?? CARD_THEMES[0];

  useEffect(() => {
    document.title = `${activeTheme.name} — ID Card (8.6 × 5.4 cm)`;
  }, [activeTheme.name]);

  const visibleSpecs =
    selected === "all"
      ? CARD_SPECS
      : CARD_SPECS.filter((item) => item.key === selected);

  async function downloadCardPdf(spec: CardSpec) {
    setDownloadingKey(spec.key);
    try {
      const blob = await pdf(
        <PersonalCardPdfDocument
          spec={spec}
          themeId={themeId}
          showPhoto={showPhoto}
        />
      ).toBlob();
      downloadPdfBlob(
        blob,
        `Abdelrahman-Mahmoud-${spec.key}-design-${themeId}.pdf`
      );
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPhoto((prev) => !prev)}
              className={cn(
                "cursor-pointer rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                showPhoto
                  ? "border-sky-600 bg-sky-50 text-sky-800"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              )}
            >
              {showPhoto ? "Photo: On" : "Photo: Off"}
            </button>
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
                <div className="border border-slate-200 shadow-md print:border-0 print:shadow-none">
                  <CardFrontByTheme spec={spec} themeId={themeId} showPhoto={showPhoto} />
                </div>
                <div className="border border-slate-200 shadow-md print:border-0 print:shadow-none">
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
