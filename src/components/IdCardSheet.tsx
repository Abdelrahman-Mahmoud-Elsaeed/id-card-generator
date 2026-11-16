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

const CARD_BG_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(-35deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 11px)",
};

function CardFront({ spec }: { spec: CardSpec }) {
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
      style={CARD_BG_STYLE}
    >
      {/* Top Navy Bar */}
      <div className="h-1.5 w-full bg-[#172554]" />

      {/* Top Institutional Logos */}
      <div className="px-4 pt-1.5">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
          <div className="flex h-7 items-center justify-center">
            <img
              src="/logos/military-academy.png"
              alt="Egyptian Military Academy"
              className="max-h-7 max-w-full object-contain"
            />
          </div>
          <span className="h-6 w-px bg-slate-300/80" />
          <div className="flex h-7 items-center justify-center px-2">
            <img
              src="/logos/digilians.png"
              alt="DiGiLiANS"
              className="max-h-7 max-w-full object-contain"
            />
          </div>
          <span className="h-6 w-px bg-slate-300/80" />
          <div className="flex h-7 items-center justify-center">
            <img
              src="/logos/mcit.png"
              alt="MCIT"
              className="max-h-6 max-w-full object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* Thin Horizontal Accent Line with Centered Dot */}
        <div className="relative mt-1.5 flex items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          <span className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </div>
      </div>

      {/* Main Content: Portrait + Info Table */}
      <div className="flex flex-1 items-center gap-3 px-4 py-1.5">
        <div className="h-[2.35cm] w-[1.95cm] shrink-0 overflow-hidden rounded-lg border border-white bg-[#132444] shadow-md">
          <img
            src="/me.png"
            alt="Abdelrahman Mahmoud"
            className="h-full w-full object-cover object-[50%_22%]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[54px_6px_1fr] items-center text-[7.5px] leading-tight"
            >
              <span className="font-medium tracking-wide text-slate-500">
                {row.label}
              </span>
              <span className="text-sky-400/80">|</span>
              <span className="truncate font-bold text-slate-900">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Accent Bar */}
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

function CardBack({ spec }: { spec: CardSpec }) {
  return (
    <div
      className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 shadow-md"
      style={CARD_BG_STYLE}
    >
      <div className="h-1.5 w-full bg-[#172554]" />

      {/* Center Content: QR Code + Scan Info */}
      <div className="flex flex-1 items-center justify-between gap-3 px-5 py-2">
        <div className="flex min-w-0 flex-1 flex-col items-start text-left">
          <span className="rounded border border-sky-200/80 bg-sky-50 px-1.5 py-0.5 text-[7px] font-bold tracking-wider text-sky-700 uppercase">
            {spec.jobProfile}
          </span>
          <h2 className="mt-1.5 font-heading text-[11px] font-bold tracking-tight text-slate-900">
            ABDELRAHMAN MAHMOUD
          </h2>
          <p className="mt-0.5 text-[7.5px] font-medium text-slate-600">
            Scan QR for CV, Projects &amp; vCard
          </p>
          <div className="mt-2 flex flex-col gap-0.5 text-[7px] text-slate-500">
            <span>+20 109 516 0726</span>
            <span>Cairo, Egypt</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center rounded-xl border border-slate-200/90 bg-white p-2 shadow-sm">
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
        <div className="pb-1 text-center text-[6.5px] font-medium tracking-wider text-slate-500">
          DiGiLiANS • MCIT • Military Academy • NTI
        </div>
        <div className="h-1.5 w-full bg-[#172554]" />
      </div>
    </div>
  );
}

export function IdCardSheet() {
  const [selected, setSelected] = useState<ProfileVariantKey | "all">("all");
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const faceRefs = useRef<
    Record<string, { front: HTMLDivElement | null; back: HTMLDivElement | null }>
  >({});

  useEffect(() => {
    document.title = "ID Card Generator (8.6 × 5.4 cm)";
  }, []);

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
      pdf.save(`Abdelrahman-Mahmoud-${spec.key}-card.pdf`);
    } finally {
      setDownloadingKey(null);
    }
  }

  return (
    <div className="min-h-dvh bg-slate-100 p-4 print:bg-white print:p-0">
      {/* Screen-Only Controls */}
      <div className="mx-auto mb-6 flex max-w-4xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-base font-bold text-slate-900">
            ID Card Generator (8.6 cm × 5.4 cm)
          </h1>
          <p className="text-xs text-slate-500">
            Click Download PDF on any card for a 2-page 8.6 × 5.4 cm PDF (Front + QR Back)
          </p>
        </div>

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
                  <CardFront spec={spec} />
                </div>
                <div
                  ref={(el) => {
                    faceRefs.current[spec.key] = {
                      ...faceRefs.current[spec.key],
                      back: el,
                    };
                  }}
                >
                  <CardBack spec={spec} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
