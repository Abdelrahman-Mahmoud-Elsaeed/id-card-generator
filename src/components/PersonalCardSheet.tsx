import { useEffect, useState } from "react";
import { Download, Loader2, Printer, RotateCcw } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { QRCodeSVG } from "qrcode.react";

import {
  PersonalCardPdfDocument,
  type PersonalCardPdfDisplay,
} from "@/components/pdf/PersonalCardPdfDocument";
import { Button } from "@/components/ui/button";
import {
  clearPersonalCardData,
  EMPTY_PERSONAL_CARD,
  loadPersonalCardData,
  parseTechStack,
  savePersonalCardData,
  type PersonalCardFormData,
} from "@/data/personalCard";
import { downloadPdfBlob } from "@/lib/pdfUtils";
import { cn } from "@/lib/utils";

export type PersonalCardThemeId = "1" | "2" | "3" | "4" | "5";

export interface PersonalCardThemeMeta {
  id: PersonalCardThemeId;
  route: string;
  name: string;
  subtitle: string;
}

export const PERSONAL_CARD_THEMES: PersonalCardThemeMeta[] = [
  {
    id: "1",
    route: "/personal/1",
    name: "1. Digilians Classic",
    subtitle: "Official structured layout with diagonal lines",
  },
  {
    id: "2",
    route: "/personal/2",
    name: "2. Canva Organic Wave",
    subtitle: "Layered navy & sky SVG waves on crisp white canvas",
  },
  {
    id: "3",
    route: "/personal/3",
    name: "3. Canva Diagonal Ribbon",
    subtitle: "Geometric diagonal navy & cyan corporate ribbon",
  },
  {
    id: "4",
    route: "/personal/4",
    name: "4. Canva Curved Header",
    subtitle: "Curved navy-blue wave header & clean structured details",
  },
  {
    id: "5",
    route: "/personal/5",
    name: "5. Canva Corner Geometry",
    subtitle: "Modern dual-tone corner ribbons & tech badge style",
  },
];

const DEFAULT_TECH_STACK = [
  "Node.js",
  "Express",
  "PostgreSQL",
  "Redis",
  "AWS",
  "Terraform",
];

function resolveDisplay(form: PersonalCardFormData): PersonalCardPdfDisplay {
  const name = form.name.trim();
  const jobProfile = form.jobProfile.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const location = form.location.trim();
  const initiative = form.initiative.trim();
  const qrUrl = form.qrUrl.trim();
  const parsedStack = parseTechStack(form.techStackInput);

  return {
    name: name ? name.toUpperCase() : "YOUR FULL NAME",
    hasName: Boolean(name),
    jobProfile: jobProfile ? jobProfile.toUpperCase() : "SOFTWARE ENGINEER",
    hasJobProfile: Boolean(jobProfile),
    email: email || "you@example.com",
    hasEmail: Boolean(email),
    phone: phone || "+20 100 000 0000",
    hasPhone: Boolean(phone),
    location: location || "Cairo",
    hasLocation: Boolean(location),
    initiative: initiative || "DIGILIANS · MCIT",
    techStack: parsedStack.length > 0 ? parsedStack : DEFAULT_TECH_STACK,
    qrUrl: qrUrl || "https://example.com",
    hasQrUrl: Boolean(qrUrl),
  };
}

const DIAGONAL_BG = {
  backgroundImage:
    "repeating-linear-gradient(-35deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 11px)",
};

function InitiativeText({
  text,
  light = false,
}: {
  text: string;
  light?: boolean;
}) {
  return (
    <span
      className={cn(
        "text-[7pt] font-semibold tracking-[0.16em] uppercase",
        light ? "text-sky-200" : "text-slate-500"
      )}
    >
      {text}
    </span>
  );
}

/* ---------------- THEME 1: DIGILIANS CLASSIC ---------------- */
function ClassicFront({ d }: { d: PersonalCardPdfDisplay }) {
  return (
    <div
      className="id-card-face relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50"
      style={DIAGONAL_BG}
    >
      <div className="h-1.5 w-full bg-[#172554]" />

      <div className="flex flex-1 items-center px-6 py-2">
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <h2
            className={cn(
              "font-heading text-[12.5pt] leading-tight font-bold tracking-tight",
              d.hasName ? "text-slate-900" : "text-slate-400"
            )}
          >
            {d.name}
          </h2>
          <span
            className={cn(
              "mt-1 w-fit border border-sky-200/80 bg-sky-50 px-1.5 py-0.5 text-[7pt] font-bold tracking-wider uppercase",
              d.hasJobProfile ? "text-sky-800" : "text-slate-400"
            )}
          >
            {d.jobProfile}
          </span>

          <div className="mt-2.5 flex flex-col gap-1 border-t border-slate-200/90 pt-2 text-[7.2pt] leading-tight">
            <span
              className={cn(
                "font-semibold",
                d.hasPhone ? "text-slate-800" : "text-slate-400"
              )}
            >
              {d.phone}
            </span>
            <span
              className={cn(
                "truncate font-medium",
                d.hasEmail ? "text-slate-600" : "text-slate-400"
              )}
            >
              {d.email}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-end px-6 pb-1">
          <InitiativeText text={d.initiative} />
        </div>
        <div className="h-1.5 w-full bg-[#172554]" />
      </div>
    </div>
  );
}

/* ---------------- THEME 2: CANVA ORGANIC WAVE ---------------- */
function CanvaOrganicWaveFront({ d }: { d: PersonalCardPdfDisplay }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden bg-white">
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
        <path d="M0,0 L115,0 C82,34 38,38 0,68 Z" fill="#eff6ff" />
      </svg>

      <div className="relative z-10 flex flex-1 items-center px-6 pt-3 pb-1">
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <span
            className={cn(
              "w-fit bg-sky-100 px-1.5 py-0.5 text-[7pt] font-bold tracking-wider uppercase",
              d.hasJobProfile ? "text-sky-900" : "text-slate-400"
            )}
          >
            {d.jobProfile}
          </span>
          <h2
            className={cn(
              "mt-1 font-heading text-[12.5pt] leading-tight font-bold",
              d.hasName ? "text-slate-900" : "text-slate-400"
            )}
          >
            {d.name}
          </h2>

          <div className="mt-2 flex flex-col gap-0.5 border-l-2 border-sky-600 pl-2.5 text-[7.2pt]">
            <span className="font-semibold text-slate-800">{d.phone}</span>
            <span className="truncate font-medium text-slate-600">
              {d.email}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 pb-1.5 text-[7pt] font-semibold tracking-wider text-white">
        <span className="text-sky-200">{d.location}</span>
        <span>{d.initiative}</span>
      </div>
    </div>
  );
}

/* ---------------- THEME 3: CANVA DIAGONAL RIBBON ---------------- */
function CanvaDiagonalRibbonFront({ d }: { d: PersonalCardPdfDisplay }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden bg-white">
      <svg
        viewBox="0 0 320 200"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="225,0 320,0 320,200 175,200" fill="#172554" />
        <polygon points="205,0 228,0 178,200 155,200" fill="#0ea5e9" />
        <polygon points="193,0 205,0 155,200 143,200" fill="#bae6fd" />
      </svg>

      <div className="relative z-10 flex flex-1 items-center px-6 py-1">
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <div className="w-fit border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
            <h2
              className={cn(
                "font-heading text-[11.5pt] leading-tight font-bold",
                d.hasName ? "text-slate-900" : "text-slate-400"
              )}
            >
              {d.name}
            </h2>
            <p className="mt-0.5 text-[7pt] font-bold tracking-wider text-sky-800 uppercase">
              {d.jobProfile}
            </p>
            <div className="mt-1.5 flex flex-col gap-0.5 border-t border-slate-200 pt-1.5 text-[7pt] text-slate-700">
              <span className="font-semibold text-slate-900">{d.phone}</span>
              <span className="truncate font-medium text-slate-600">
                {d.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 pb-1.5">
        <span className="text-[7pt] font-semibold text-slate-500">
          {d.location}
        </span>
        <InitiativeText text={d.initiative} light />
      </div>
    </div>
  );
}

/* ---------------- THEME 4: CANVA CURVED HEADER ---------------- */
function CanvaCurvedHeaderFront({ d }: { d: PersonalCardPdfDisplay }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden bg-slate-50/40">
      <div className="relative z-10 bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#0284c7] px-6 py-2 text-white">
        <div className="flex items-center justify-between">
          <InitiativeText text={d.initiative} light />
          <span className="text-[7pt] font-medium text-sky-100">
            {d.location}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 items-center px-6 py-1.5">
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <h2
            className={cn(
              "font-heading text-[12.5pt] leading-tight font-bold",
              d.hasName ? "text-slate-900" : "text-slate-400"
            )}
          >
            {d.name}
          </h2>
          <p className="mt-0.5 text-[7.5pt] font-bold tracking-wider text-sky-700 uppercase">
            {d.jobProfile}
          </p>
          <div className="mt-2 flex flex-col gap-0.5 text-[7.2pt] text-slate-700">
            <span className="font-semibold text-slate-900">{d.phone}</span>
            <span className="truncate font-medium text-slate-600">
              {d.email}
            </span>
          </div>
        </div>
      </div>

      <div className="h-1.5 w-full bg-[#172554]" />
    </div>
  );
}

/* ---------------- THEME 5: CANVA CORNER GEOMETRY ---------------- */
function CanvaCornerGeometryFront({ d }: { d: PersonalCardPdfDisplay }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden bg-white">
      <svg
        viewBox="0 0 320 200"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="0,0 92,0 0,66" fill="#172554" />
        <polygon points="92,0 112,0 0,80 0,66" fill="#0ea5e9" />
        <polygon points="230,200 320,200 320,138" fill="#172554" />
        <polygon points="210,200 230,200 320,138 320,124" fill="#38bdf8" />
      </svg>

      <div className="h-3" />

      <div className="relative z-10 flex flex-1 items-center px-6 py-1">
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <span className="w-fit border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[7pt] font-bold tracking-wider text-sky-800 uppercase">
            {d.jobProfile}
          </span>
          <h2
            className={cn(
              "mt-1 font-heading text-[12.5pt] leading-tight font-bold",
              d.hasName ? "text-slate-900" : "text-slate-400"
            )}
          >
            {d.name}
          </h2>

          <div className="mt-2 flex flex-col gap-0.5 text-[7.2pt]">
            <span className="font-semibold text-slate-900">{d.phone}</span>
            <span className="truncate font-medium text-slate-600">
              {d.email}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-end px-6 pb-1.5">
        <InitiativeText text={d.initiative} />
      </div>
    </div>
  );
}

/* ---------------- SHARED BACK FACE ---------------- */
function CardBack({
  d,
  themeId,
}: {
  d: PersonalCardPdfDisplay;
  themeId: PersonalCardThemeId;
}) {
  const rows: [string, string | undefined][] = [];
  for (let i = 0; i < d.techStack.length; i += 2) {
    rows.push([d.techStack[i], d.techStack[i + 1]]);
  }

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
          <path
            d="M0,162 C90,180 180,136 320,160 L320,200 L0,200 Z"
            fill="#172554"
          />
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
          "relative z-10 flex flex-1 items-center justify-between gap-3 py-2",
          themeId === "3" ? "pr-5 pl-9" : "px-6"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start border-l-2 border-[#172554] pl-3 text-left">
          <div className="flex flex-col gap-1.5">
            {rows.map((row) => (
              <div
                key={row[0]}
                className="flex items-center gap-1.5 text-[7.5pt] font-semibold text-slate-800"
              >
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
            value={d.qrUrl}
            size={72}
            level="M"
            fgColor={d.hasQrUrl ? "#0f172a" : "#94a3b8"}
            bgColor="#ffffff"
            shapeRendering="crispEdges"
          />
          <span className="mt-1 text-[7pt] leading-none font-bold tracking-wider text-slate-700 uppercase">
            {d.hasQrUrl ? "SCAN ME" : "ADD QR URL"}
          </span>
          <span className="mt-0.5 text-[7pt] leading-none font-medium text-slate-500">
            CV &amp; Projects
          </span>
        </div>
      </div>

      {themeId !== "2" && (
        <div className="relative z-10 h-1.5 w-full bg-[#172554]" />
      )}
    </div>
  );
}

function CardFrontByTheme({
  d,
  themeId,
}: {
  d: PersonalCardPdfDisplay;
  themeId: PersonalCardThemeId;
}) {
  switch (themeId) {
    case "1":
      return <ClassicFront d={d} />;
    case "2":
      return <CanvaOrganicWaveFront d={d} />;
    case "3":
      return <CanvaDiagonalRibbonFront d={d} />;
    case "4":
      return <CanvaCurvedHeaderFront d={d} />;
    case "5":
      return <CanvaCornerGeometryFront d={d} />;
  }
}

export function PersonalCardSheet({
  themeId,
  onSelectTheme,
}: {
  themeId: PersonalCardThemeId;
  onSelectTheme: (id: PersonalCardThemeId) => void;
}) {
  const [form, setForm] = useState<PersonalCardFormData>(() =>
    loadPersonalCardData()
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const activeTheme =
    PERSONAL_CARD_THEMES.find((t) => t.id === themeId) ??
    PERSONAL_CARD_THEMES[0];
  const display = resolveDisplay(form);

  useEffect(() => {
    document.title = `${activeTheme.name} — Personal Card Builder (8.6 × 5.4 cm)`;
  }, [activeTheme.name]);

  function updateField<K extends keyof PersonalCardFormData>(
    key: K,
    value: PersonalCardFormData[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      savePersonalCardData(next);
      return next;
    });
  }

  function handleReset() {
    clearPersonalCardData();
    setForm(EMPTY_PERSONAL_CARD);
  }

  async function downloadCardPdf() {
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <PersonalCardPdfDocument d={display} themeId={themeId} />
      ).toBlob();

      const safeName = (form.name.trim() || "personal-card")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      downloadPdfBlob(blob, `${safeName}-personal-design-${themeId}.pdf`);
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
              Personal Card Builder — {activeTheme.name} (8.6 × 5.4 cm)
            </h1>
            <p className="text-xs text-slate-500">
              {activeTheme.subtitle} · Saved locally in your browser
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {PERSONAL_CARD_THEMES.map((theme) => (
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
                /{theme.id} · {theme.name.replace(/^\d+\.\s*/, "")}
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
              onClick={downloadCardPdf}
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
              Job Profile / Role
              <input
                type="text"
                value={form.jobProfile}
                onChange={(e) => updateField("jobProfile", e.target.value)}
                placeholder="e.g. Backend & Cloud Engineer"
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
              Header / Footer Label
              <input
                type="text"
                value={form.initiative}
                onChange={(e) => updateField("initiative", e.target.value)}
                placeholder="DIGILIANS · MCIT"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
            Tech Stack / Skills (up to 6, comma-separated)
            <input
              type="text"
              value={form.techStackInput}
              onChange={(e) => updateField("techStackInput", e.target.value)}
              placeholder="Node.js, Express, PostgreSQL, Redis, AWS, Terraform"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-normal text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </label>

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
        </section>

        {/* Live Preview */}
        <section className="flex flex-col items-center gap-4 print:block">
          <div className="flex flex-col items-center gap-1.5 print:block">
            <span className="text-xs font-semibold text-slate-500 print:hidden">
              Front Side (Page 1 — 8.6 × 5.4 cm)
            </span>
            <div className="border border-slate-200 shadow-md print:border-0 print:shadow-none">
              <CardFrontByTheme d={display} themeId={themeId} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 print:block">
            <span className="text-xs font-semibold text-slate-500 print:hidden">
              Back Side with QR (Page 2 — 8.6 × 5.4 cm)
            </span>
            <div className="border border-slate-200 shadow-md print:border-0 print:shadow-none">
              <CardBack d={display} themeId={themeId} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
