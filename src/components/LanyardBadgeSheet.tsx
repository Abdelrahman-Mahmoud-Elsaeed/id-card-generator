import { useEffect, useState } from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { QRCodeSVG } from "qrcode.react";

import { LanyardBadgePdfDocument } from "@/components/pdf/LanyardBadgePdfDocument";
import { Button } from "@/components/ui/button";
import { downloadPdfBlob } from "@/lib/pdfUtils";
import {
  BASE_PUBLIC_URL,
  VARIANT_CODES,
} from "@/lib/variant";

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

function BadgeLogosRow() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
      <div className="flex h-7 items-center justify-center">
        <img
          src="/logos/military-academy.png"
          alt="Egyptian Military Academy"
          className="max-h-7 max-w-full object-contain"
        />
      </div>
      <span className="h-5 w-px bg-slate-300/80" />
      <div className="flex h-7 items-center justify-center px-2">
        <img
          src="/logos/digilians.png"
          alt="DiGiLiANS"
          className="max-h-7 max-w-full object-contain"
        />
      </div>
      <span className="h-5 w-px bg-slate-300/80" />
      <div className="flex h-7 items-center justify-center">
        <img
          src="/logos/mcit.png"
          alt="MCIT"
          className="max-h-6 max-w-full object-contain mix-blend-multiply"
        />
      </div>
    </div>
  );
}

function BadgeFront({
  platformCode,
  platformIdText,
}: {
  platformCode: string;
  platformIdText: string;
}) {
  const displayId =
    platformIdText.trim() ||
    (platformCode.trim() && !platformCode.trim().startsWith("http")
      ? platformCode.trim()
      : "Platform Code");
  return (
    <div
      className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50"
      style={DIAGONAL_BG}
    >
      {/* Top Navy Bar + Lanyard Punch Safe Zone */}
      <div>
        <div className="h-2 w-full bg-[#172554]" />
        <div className="flex justify-center pt-2 pb-1">
          <div className="h-1.5 w-10 rounded-full border border-slate-300/80 bg-slate-100/80" />
        </div>
        <div className="px-4 pt-1">
          <BadgeLogosRow />
          <div className="relative mt-2 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400" />
          </div>
        </div>
      </div>

      {/* Center Portrait, Name & Program Details (Clean White Space, No Email) */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-2 text-center">
        <div className="h-[3cm] w-[2.45cm] rounded-xl bg-white p-[2px] shadow-[0_2px_6px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <div className="h-full w-full overflow-hidden rounded-[10px] bg-[#132444]">
            <img
              src="/me.png"
              alt="Abdelrahman Mahmoud"
              className="h-full w-full object-cover object-[50%_22%]"
            />
          </div>
        </div>

        <h2 className="mt-3 font-heading text-[13.5pt] leading-tight font-bold tracking-tight text-slate-900">
          {BADGE_INFO.name}
        </h2>

        <div className="mt-2 flex flex-col gap-0.5 text-[8pt] leading-snug">
          <span className="font-bold text-slate-800">{BADGE_INFO.program}</span>
          <span className="font-semibold text-sky-800">{BADGE_INFO.track}</span>
        </div>

        {/* Front QR Code Reserved for Event Platform Code */}
        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          {platformCode.trim() ? (
            <QRCodeSVG
              value={platformCode.trim()}
              size={54}
              level="M"
              fgColor="#0f172a"
              bgColor="#ffffff"
              shapeRendering="crispEdges"
            />
          ) : (
            <div className="flex h-[54px] w-[54px] items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-center text-[7pt] leading-tight font-semibold text-slate-400">
              EVENT
              <br />
              QR
            </div>
          )}
          <div className="flex flex-col text-left">
            <span className="text-[7.5pt] font-bold tracking-wider text-slate-800 uppercase">
              FORUM ID
            </span>
            <span className="font-mono text-[7.5pt] font-semibold text-slate-600">
              {displayId}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#172554] px-4 py-1.5 text-center text-[7pt] font-semibold tracking-wider text-white">
        DIGILIANS • الرواد الرقميون
      </div>
    </div>
  );
}

function BadgeBack() {
  return (
    <div
      className="lanyard-badge-face relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-900"
      style={DIAGONAL_BG}
    >
      <div>
        <div className="h-2 w-full bg-[#172554]" />
        <div className="flex justify-center pt-2 pb-1">
          <div className="h-1.5 w-10 rounded-full border border-slate-300/80 bg-slate-100/80" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
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

      <div className="flex flex-col">
        <div className="pb-1.5 text-center text-[7pt] font-semibold tracking-wider text-slate-600">
          DIGILIANS • MCIT • Military Academy • NTI
        </div>
        <div className="h-2 w-full bg-[#172554]" />
      </div>
    </div>
  );
}

export function LanyardBadgeSheet() {
  const [platformCode, setPlatformCode] = useState("");
  const [platformIdText, setPlatformIdText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    document.title = "Lanyard Badge (9 × 12 cm) — Portrait";
  }, []);

  async function downloadBadgePdf() {
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <LanyardBadgePdfDocument
          info={BADGE_INFO}
          platformCode={platformCode}
          platformIdText={platformIdText}
        />
      ).toBlob();
      downloadPdfBlob(blob, "Abdelrahman-Mahmoud-badge-9x12.pdf");
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
              Hanging Lanyard Badge (9 cm × 12 cm)
            </h1>
            <p className="text-xs text-slate-500">
              Portrait event badge linking to {BADGE_INFO.qrUrl}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-lg border border-sky-600 bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white">
              /badge · Lanyard 9×12
            </span>
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
          <BadgeFront platformCode={platformCode} platformIdText={platformIdText} />
        </div>
        <div className="border border-slate-200 shadow-md print:border-0 print:shadow-none">
          <BadgeBack />
        </div>
      </div>
    </div>
  );
}
