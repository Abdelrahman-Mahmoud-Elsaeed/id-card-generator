import { useEffect, useRef, useState } from "react";
import {
  Download,
  ImagePlus,
  Loader2,
  Move,
  Printer,
  RotateCcw,
  Trash2,
  User,
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import {
  clearLocalCardData,
  DEFAULT_LOGOS,
  EMPTY_CARD_DATA,
  JOB_PROFILE_GROUPS,
  loadLocalCardData,
  PROGRAM_OPTIONS,
  saveLocalCardData,
  type CardFormData,
  type ElementOffset,
} from "@/data/programs";
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

interface ResolvedCardDisplay {
  name: string;
  hasName: boolean;
  email: string;
  hasEmail: boolean;
  program: string;
  hasProgram: boolean;
  track: string;
  hasTrack: boolean;
  jobProfile: string;
  hasJobProfile: boolean;
  phone: string;
  hasPhone: boolean;
  location: string;
  hasLocation: boolean;
  qrUrl: string;
  hasQrUrl: boolean;
  accreditationFooter: string;
  photoDataUrl: string;
  logos: [string, string, string];
}

interface DragProps {
  offsets: Record<string, ElementOffset>;
  dragEnabled: boolean;
  onMove: (id: string, offset: ElementOffset) => void;
}

function resolveDisplay(data: CardFormData): ResolvedCardDisplay {
  const name = data.name.trim();
  const email = data.email.trim();
  const program = data.program.trim();
  const track = data.track.trim();
  const jobProfile = data.jobProfile.trim();
  const phone = data.phone.trim();
  const location = data.location.trim();
  const qrUrl = data.qrUrl.trim();
  const accreditationFooter = data.accreditationFooter.trim();

  return {
    name: name ? name.toUpperCase() : "YOUR FULL NAME",
    hasName: Boolean(name),
    email: email || "name@digilians.gov.eg",
    hasEmail: Boolean(email),
    program: program ? program.toUpperCase() : "SPECIALIZED DIPLOMA",
    hasProgram: Boolean(program),
    track: track ? track.toUpperCase() : "AI BASED SOFTWARE DEVELOPMENT",
    hasTrack: Boolean(track),
    jobProfile: jobProfile ? jobProfile.toUpperCase() : "YOUR JOB PROFILE",
    hasJobProfile: Boolean(jobProfile),
    phone: phone || "+20 1XX XXX XXXX",
    hasPhone: Boolean(phone),
    location: location || "Cairo, Egypt",
    hasLocation: Boolean(location),
    qrUrl: qrUrl || "https://digilians.gov.eg",
    hasQrUrl: Boolean(qrUrl),
    accreditationFooter:
      accreditationFooter || "DiGiLiANS • MCIT • Military Academy",
    photoDataUrl: data.photoDataUrl,
    logos: data.logos?.length === 3 ? data.logos : [...DEFAULT_LOGOS],
  };
}

function DraggableBox({
  id,
  drag,
  className,
  children,
}: {
  id: string;
  drag: DragProps;
  className?: string;
  children: React.ReactNode;
}) {
  const offset = drag.offsets[id] ?? { x: 0, y: 0 };
  const startRef = useRef<{
    pointerX: number;
    pointerY: number;
    origX: number;
    origY: number;
  } | null>(null);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.dragEnabled) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.dragEnabled || !startRef.current) return;
    const dx = Math.round(e.clientX - startRef.current.pointerX);
    const dy = Math.round(e.clientY - startRef.current.pointerY);
    drag.onMove(id, {
      x: startRef.current.origX + dx,
      y: startRef.current.origY + dy,
    });
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!startRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    startRef.current = null;
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform:
          offset.x || offset.y
            ? `translate(${offset.x}px, ${offset.y}px)`
            : undefined,
      }}
      className={cn(
        drag.dragEnabled &&
          "touch-none cursor-grab select-none outline-1 outline-dashed outline-sky-400/70 hover:outline-sky-600 active:cursor-grabbing print:outline-none",
        className
      )}
    >
      {children}
    </div>
  );
}

const DIAGONAL_BG = {
  backgroundImage:
    "repeating-linear-gradient(-35deg, rgba(148, 163, 184, 0.08) 0px, rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 11px)",
};

function PortraitBox({
  photoDataUrl,
  className,
  dark = false,
}: {
  photoDataUrl: string;
  className: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-lg",
        dark ? "bg-slate-800" : "bg-slate-100",
        className
      )}
    >
      {photoDataUrl ? (
        <img
          src={photoDataUrl}
          alt="Card Portrait"
          draggable={false}
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-center gap-1 border border-dashed px-1 text-center",
            dark
              ? "border-slate-600 text-slate-400"
              : "border-slate-300 text-slate-400"
          )}
        >
          <User className="h-5 w-5 opacity-70" />
          <span className="text-[6px] leading-tight font-medium">
            Your Photo
          </span>
        </div>
      )}
    </div>
  );
}

function LogosRow({
  logos,
  compact = false,
}: {
  logos: [string, string, string];
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center">
      <div className={cn("flex items-center justify-center", compact ? "h-5" : "h-7")}>
        <img
          src={logos[0]}
          alt="Left Institution Logo"
          draggable={false}
          className={cn("max-w-full object-contain", compact ? "max-h-5" : "max-h-7")}
        />
      </div>
      <span className={cn("w-px bg-slate-300/80", compact ? "h-4" : "h-6")} />
      <div className={cn("flex items-center justify-center px-2", compact ? "h-5" : "h-7")}>
        <img
          src={logos[1]}
          alt="Center Institution Logo"
          draggable={false}
          className={cn("max-w-full object-contain", compact ? "max-h-5" : "max-h-7")}
        />
      </div>
      <span className={cn("w-px bg-slate-300/80", compact ? "h-4" : "h-6")} />
      <div className={cn("flex items-center justify-center", compact ? "h-5" : "h-7")}>
        <img
          src={logos[2]}
          alt="Right Institution Logo"
          draggable={false}
          className={cn("max-w-full object-contain mix-blend-multiply", compact ? "max-h-4" : "max-h-6")}
        />
      </div>
    </div>
  );
}

/* ---------------- THEME 1: DIGILIANS CLASSIC ---------------- */
function ClassicFront({ d, drag }: { d: ResolvedCardDisplay; drag: DragProps }) {
  const rows = [
    { label: "NAME", value: d.name, filled: d.hasName },
    { label: "EMAIL", value: d.email, filled: d.hasEmail },
    { label: "PROGRAM", value: d.program, filled: d.hasProgram },
    { label: "TRACK", value: d.track, filled: d.hasTrack },
    { label: "JOB PROFILE", value: d.jobProfile, filled: d.hasJobProfile },
  ];

  return (
    <div
      className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 shadow-md"
      style={DIAGONAL_BG}
    >
      <div className="h-1.5 w-full bg-[#172554]" />
      <div className="px-4 pt-1.5">
        <DraggableBox id="front-logos" drag={drag}>
          <LogosRow logos={d.logos} />
        </DraggableBox>
        <div className="relative mt-1.5 flex items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          <span className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400" />
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3 px-4 py-1.5">
        <DraggableBox id="front-photo" drag={drag}>
          <PortraitBox
            photoDataUrl={d.photoDataUrl}
            className="h-[2.35cm] w-[1.95cm] border border-white shadow-md"
          />
        </DraggableBox>
        <DraggableBox id="front-info" drag={drag} className="min-w-0 flex-1">
          <div className="flex flex-col gap-1.5 text-left">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[54px_6px_1fr] items-center text-[7.3px] leading-tight"
              >
                <span className="font-medium tracking-wide text-slate-500">
                  {row.label}
                </span>
                <span className="text-sky-400/80">|</span>
                <span
                  className={cn(
                    "truncate font-bold",
                    row.filled ? "text-slate-900" : "text-slate-400"
                  )}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </DraggableBox>
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

/* ---------------- THEME 2: CANVA ORGANIC WAVE ---------------- */
function CanvaOrganicWaveFront({ d, drag }: { d: ResolvedCardDisplay; drag: DragProps }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-white shadow-md">
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

      <div className="relative z-10 px-4 pt-2.5">
        <DraggableBox id="front-logos" drag={drag}>
          <LogosRow logos={d.logos} compact />
        </DraggableBox>
      </div>

      <div className="relative z-10 flex flex-1 items-center gap-3.5 px-4 py-1">
        <DraggableBox id="front-photo" drag={drag}>
          <PortraitBox
            photoDataUrl={d.photoDataUrl}
            className="h-[2.3cm] w-[1.9cm] border-2 border-white shadow-md ring-1 ring-sky-200"
          />
        </DraggableBox>

        <DraggableBox id="front-info" drag={drag} className="min-w-0 flex-1">
          <div className="flex flex-col text-left">
            <span
              className={cn(
                "w-fit bg-sky-100 px-1.5 py-0.5 text-[6px] font-bold tracking-wider uppercase",
                d.hasJobProfile ? "text-sky-900" : "text-sky-600/70"
              )}
            >
              {d.jobProfile}
            </span>
            <h2
              className={cn(
                "mt-1 truncate font-heading text-[10.8px] leading-tight font-bold",
                d.hasName ? "text-slate-900" : "text-slate-400"
              )}
            >
              {d.name}
            </h2>
            <span
              className={cn(
                "mt-0.5 truncate text-[6.8px] font-semibold",
                d.hasEmail ? "text-slate-600" : "text-slate-400"
              )}
            >
              {d.email}
            </span>

            <div className="mt-2 flex flex-col gap-0.5 border-l-2 border-sky-600 pl-2 text-[6.3px] text-slate-800">
              <span className="truncate font-bold">{d.program}</span>
              <span className="truncate font-medium text-slate-600">{d.track}</span>
            </div>
          </div>
        </DraggableBox>
      </div>

      <div className="relative z-10 flex items-center justify-between px-4 pb-1.5 text-[6.2px] font-semibold tracking-wider text-white">
        <span className="text-sky-200">{d.location.toUpperCase()}</span>
        <span>DIGILIANS • الرواد الرقميون</span>
      </div>
    </div>
  );
}

/* ---------------- THEME 3: CANVA DIAGONAL RIBBON ---------------- */
function CanvaDiagonalRibbonFront({ d, drag }: { d: ResolvedCardDisplay; drag: DragProps }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-white shadow-md">
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

      <div className="relative z-10 px-4 pt-2.5">
        <DraggableBox id="front-logos" drag={drag}>
          <div className="border border-slate-200/80 bg-white/95 px-2.5 py-1 shadow-sm">
            <LogosRow logos={d.logos} compact />
          </div>
        </DraggableBox>
      </div>

      <div className="relative z-10 flex flex-1 items-center gap-3 px-4 py-1.5">
        <DraggableBox id="front-photo" drag={drag}>
          <PortraitBox
            photoDataUrl={d.photoDataUrl}
            className="h-[2.3cm] w-[1.9cm] border-2 border-white shadow-md"
          />
        </DraggableBox>

        <DraggableBox id="front-info" drag={drag} className="min-w-0 flex-1">
          <div className="w-full border border-slate-200/80 bg-white px-2.5 py-1.5 text-left shadow-sm">
            <h2
              className={cn(
                "truncate font-heading text-[10.2px] leading-tight font-bold",
                d.hasName ? "text-slate-900" : "text-slate-400"
              )}
            >
              {d.name}
            </h2>
            <p
              className={cn(
                "mt-0.5 truncate text-[6.5px] font-bold tracking-wider uppercase",
                d.hasJobProfile ? "text-sky-800" : "text-sky-600/60"
              )}
            >
              {d.jobProfile}
            </p>
            <div className="mt-1.5 flex flex-col gap-0.5 border-t border-slate-200 pt-1 text-[6px] text-slate-700">
              <span
                className={cn(
                  "truncate font-semibold",
                  d.hasEmail ? "text-slate-900" : "text-slate-400"
                )}
              >
                {d.email}
              </span>
              <span className="truncate">
                {d.program} • {d.track}
              </span>
            </div>
          </div>
        </DraggableBox>
      </div>

      <div className="relative z-10 flex items-center justify-between px-4 pb-1.5 text-[6px] font-bold tracking-wider">
        <span className="text-slate-700">MCIT • MILITARY ACADEMY</span>
        <span className="text-white">DIGILIANS</span>
      </div>
    </div>
  );
}

/* ---------------- THEME 4: CANVA CURVED HEADER ---------------- */
function CanvaCurvedHeaderFront({ d, drag }: { d: ResolvedCardDisplay; drag: DragProps }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-slate-50/40 shadow-md">
      <div className="relative z-10 bg-white px-4 pt-2 pb-1">
        <DraggableBox id="front-logos" drag={drag}>
          <LogosRow logos={d.logos} compact />
        </DraggableBox>
      </div>

      <div className="relative z-10 -mt-0.5">
        <div className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#0284c7] px-4 py-1 text-center text-white">
          <span className="block truncate text-[6.8px] font-bold tracking-[0.14em] uppercase">
            {d.jobProfile}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 items-center gap-3.5 px-4 py-1.5">
        <DraggableBox id="front-photo" drag={drag}>
          <PortraitBox
            photoDataUrl={d.photoDataUrl}
            className="h-[2.25cm] w-[1.85cm] border-2 border-white shadow-md ring-1 ring-slate-200"
          />
        </DraggableBox>

        <DraggableBox id="front-info" drag={drag} className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 text-left">
            <div>
              <h2
                className={cn(
                  "truncate font-heading text-[10.5px] leading-tight font-bold",
                  d.hasName ? "text-slate-900" : "text-slate-400"
                )}
              >
                {d.name}
              </h2>
              <p
                className={cn(
                  "truncate text-[6.6px] font-semibold",
                  d.hasEmail ? "text-sky-800" : "text-slate-400"
                )}
              >
                {d.email}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-0.5 border-t border-slate-200 pt-1 text-[5.9px]">
              <div className="flex items-center justify-between gap-1">
                <span className="shrink-0 font-medium text-slate-600">PROGRAM</span>
                <span className="truncate font-bold text-slate-900">{d.program}</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <span className="shrink-0 font-medium text-slate-600">TRACK</span>
                <span className="truncate font-bold text-slate-900">{d.track}</span>
              </div>
            </div>
          </div>
        </DraggableBox>
      </div>

      <div className="flex items-center justify-between bg-[#172554] px-4 py-1 text-[6px] font-semibold tracking-wider text-white">
        <span>الرواد الرقميون • DIGILIANS</span>
        <span className="text-sky-200">{d.location.toUpperCase()}</span>
      </div>
    </div>
  );
}

/* ---------------- THEME 5: CANVA CORNER GEOMETRY ---------------- */
function CanvaCornerGeometryFront({ d, drag }: { d: ResolvedCardDisplay; drag: DragProps }) {
  return (
    <div className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200 bg-white shadow-md">
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

      <div className="relative z-10 px-4 pt-2.5 pr-8">
        <DraggableBox id="front-logos" drag={drag}>
          <LogosRow logos={d.logos} compact />
        </DraggableBox>
      </div>

      <div className="relative z-10 flex flex-1 items-center gap-3.5 px-4 py-1">
        <DraggableBox id="front-photo" drag={drag}>
          <PortraitBox
            photoDataUrl={d.photoDataUrl}
            className="h-[2.3cm] w-[1.9cm] border-2 border-white shadow-md ring-1 ring-slate-200"
          />
        </DraggableBox>

        <DraggableBox id="front-info" drag={drag} className="min-w-0 flex-1">
          <div className="flex flex-col text-left">
            <h2
              className={cn(
                "truncate font-heading text-[10.8px] leading-tight font-bold",
                d.hasName ? "text-slate-900" : "text-slate-400"
              )}
            >
              {d.name}
            </h2>
            <span className="mt-1 w-fit max-w-full truncate bg-[#172554] px-2 py-0.5 text-[6px] font-bold tracking-wider text-white uppercase">
              {d.jobProfile}
            </span>
            <div className="mt-2 flex flex-col gap-0.5 text-[6.1px] text-slate-700">
              <span
                className={cn(
                  "truncate font-bold",
                  d.hasEmail ? "text-slate-900" : "text-slate-400"
                )}
              >
                {d.email}
              </span>
              <span className="truncate">
                {d.program} · {d.track}
              </span>
            </div>
          </div>
        </DraggableBox>
      </div>

      <div className="relative z-10 flex items-center justify-end gap-2 px-4 pb-1.5 text-[6px] font-bold tracking-wider text-slate-700">
        <span>DIGILIANS • الرواد الرقميون</span>
      </div>
    </div>
  );
}

/* ---------------- UNIFIED BACK RENDERER PER THEME ---------------- */
function CardBack({
  d,
  themeId,
  drag,
}: {
  d: ResolvedCardDisplay;
  themeId: CardThemeId;
  drag: DragProps;
}) {
  return (
    <div
      className="id-card-face relative flex flex-col justify-between overflow-hidden border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 text-slate-900 shadow-md"
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
        <DraggableBox id="back-info" drag={drag} className="min-w-0 flex-1">
          <div className="flex flex-col items-start text-left">
            <span className="max-w-full truncate border border-sky-200/80 bg-sky-50 px-1.5 py-0.5 text-[6.5px] font-bold tracking-wider text-sky-700 uppercase">
              {d.jobProfile}
            </span>
            <h2
              className={cn(
                "mt-1.5 max-w-full truncate font-heading text-[10.5px] font-bold tracking-tight",
                d.hasName ? "text-slate-900" : "text-slate-400"
              )}
            >
              {d.name}
            </h2>
            <p className="mt-0.5 text-[7.2px] font-medium text-slate-600">
              Scan QR for Profile &amp; Contact
            </p>
            <div className="mt-2 flex flex-col gap-0.5 text-[6.8px]">
              <span className={d.hasPhone ? "text-slate-600" : "text-slate-400"}>
                {d.phone}
              </span>
              <span className={d.hasLocation ? "text-slate-600" : "text-slate-400"}>
                {d.location}
              </span>
            </div>
          </div>
        </DraggableBox>

        <DraggableBox id="back-qr" drag={drag}>
          <div className="flex shrink-0 flex-col items-center border border-slate-200/90 bg-white p-2 shadow-sm">
            <QRCodeSVG
              value={d.qrUrl}
              size={82}
              level="M"
              fgColor={d.hasQrUrl ? "#0f172a" : "#94a3b8"}
              bgColor="#ffffff"
            />
            <span className="mt-1 text-[5.8px] font-semibold tracking-widest text-slate-400 uppercase">
              {d.hasQrUrl ? "SCAN ME" : "ADD QR URL"}
            </span>
          </div>
        </DraggableBox>
      </div>

      <div className="relative z-10 flex flex-col">
        <div
          className={cn(
            "pb-1 text-center text-[6.5px] font-medium tracking-wider",
            themeId === "2" ? "text-white/95" : "text-slate-500"
          )}
        >
          {d.accreditationFooter}
        </div>
        <div className="h-1.5 w-full bg-[#172554]" />
      </div>
    </div>
  );
}

function CardFrontByTheme({
  d,
  themeId,
  drag,
}: {
  d: ResolvedCardDisplay;
  themeId: CardThemeId;
  drag: DragProps;
}) {
  switch (themeId) {
    case "1":
      return <ClassicFront d={d} drag={drag} />;
    case "2":
      return <CanvaOrganicWaveFront d={d} drag={drag} />;
    case "3":
      return <CanvaDiagonalRibbonFront d={d} drag={drag} />;
    case "4":
      return <CanvaCurvedHeaderFront d={d} drag={drag} />;
    case "5":
      return <CanvaCornerGeometryFront d={d} drag={drag} />;
  }
}

export function IdCardSheet({
  themeId,
  onSelectTheme,
}: {
  themeId: CardThemeId;
  onSelectTheme: (id: CardThemeId) => void;
}) {
  const [form, setForm] = useState<CardFormData>(() => loadLocalCardData());
  const [isDownloading, setIsDownloading] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(false);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  const activeTheme =
    CARD_THEMES.find((t) => t.id === themeId) ?? CARD_THEMES[0];
  const display = resolveDisplay(form);

  const selectedProgramObj = PROGRAM_OPTIONS.find(
    (p) => p.label.toLowerCase() === form.program.trim().toLowerCase()
  );
  const trackSuggestions =
    selectedProgramObj?.tracks ?? PROGRAM_OPTIONS[0].tracks;

  useEffect(() => {
    document.title = `${activeTheme.name} — Digilians ID Card Builder`;
  }, [activeTheme.name]);

  function updateField<K extends keyof CardFormData>(
    key: K,
    value: CardFormData[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      saveLocalCardData(next);
      return next;
    });
  }

  function handleMove(id: string, offset: ElementOffset) {
    setForm((prev) => {
      const next: CardFormData = {
        ...prev,
        elementOffsets: {
          ...prev.elementOffsets,
          [id]: offset,
        },
      };
      saveLocalCardData(next);
      return next;
    });
  }

  function handleResetPositions() {
    updateField("elementOffsets", {});
  }

  function handleProgramChange(nextProgram: string) {
    const matched = PROGRAM_OPTIONS.find((p) => p.label === nextProgram);
    setForm((prev) => {
      const next: CardFormData = {
        ...prev,
        program: nextProgram,
        track: matched ? matched.tracks[0] : prev.track,
      };
      saveLocalCardData(next);
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
    e.target.value = "";
  }

  function handleLogoUpload(index: 0 | 1 | 2, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const nextLogos: [string, string, string] = [...display.logos] as [
          string,
          string,
          string,
        ];
        nextLogos[index] = reader.result;
        updateField("logos", nextLogos);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleResetLogo(index: 0 | 1 | 2) {
    const nextLogos: [string, string, string] = [...display.logos] as [
      string,
      string,
      string,
    ];
    nextLogos[index] = DEFAULT_LOGOS[index];
    updateField("logos", nextLogos);
  }

  function handleReset() {
    clearLocalCardData();
    setForm(EMPTY_CARD_DATA);
  }

  async function downloadCardPdf() {
    if (!frontRef.current || !backRef.current) return;
    const wasDragOn = dragEnabled;
    setDragEnabled(false);
    setIsDownloading(true);
    try {
      await new Promise((r) => setTimeout(r, 40));
      const [frontImg, backImg] = await Promise.all([
        toPng(frontRef.current, { pixelRatio: 4, cacheBust: true }),
        toPng(backRef.current, { pixelRatio: 4, cacheBust: true }),
      ]);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "cm",
        format: [8.6, 5.4],
      });

      pdf.addImage(frontImg, "PNG", 0, 0, 8.6, 5.4);
      pdf.addPage([8.6, 5.4], "landscape");
      pdf.addImage(backImg, "PNG", 0, 0, 8.6, 5.4);

      const safeName = (form.name.trim() || "digilians-id-card")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      pdf.save(`${safeName}-design-${themeId}.pdf`);
    } finally {
      setIsDownloading(false);
      if (wasDragOn) setDragEnabled(true);
    }
  }

  const dragProps: DragProps = {
    offsets: form.elementOffsets ?? {},
    dragEnabled,
    onMove: handleMove,
  };

  const hasCustomOffsets = Object.values(form.elementOffsets ?? {}).some(
    (o) => o.x !== 0 || o.y !== 0
  );

  return (
    <div className="min-h-dvh bg-slate-100 p-4 print:bg-white print:p-0">
      {/* Top Bar: Design Routes */}
      <div className="mx-auto mb-5 flex max-w-5xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-heading text-base font-bold text-slate-900">
              Digilians ID Card Builder (8.6 cm × 5.4 cm)
            </h1>
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
      </div>

      {/* Main Workspace: Local Form + Live 2-Sided Card Preview */}
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[380px_1fr] print:block">
        {/* Form Panel (Hidden on Print) */}
        <aside className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Your Card Details
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Photo Upload */}
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100">
              <ImagePlus className="h-4 w-4 text-sky-600" />
              <span>{form.photoDataUrl ? "Change Photo" : "Upload Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {form.photoDataUrl && (
              <button
                type="button"
                onClick={() => updateField("photoDataUrl", "")}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Name */}
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-slate-700">Full Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Menna Allah Reda"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-slate-700">Email</span>
            <input
              type="text"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="e.g. name@digilians.gov.eg"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
            />
          </label>

          {/* Program */}
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-slate-700">
              Program <span className="font-normal text-slate-400">(SD = Specialized Diploma)</span>
            </span>
            <select
              value={form.program}
              onChange={(e) => handleProgramChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
            >
              {PROGRAM_OPTIONS.map((p) => (
                <option key={p.id} value={p.label}>
                  {p.label} ({p.shortCode})
                </option>
              ))}
            </select>
          </label>

          {/* Track */}
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-slate-700">Track</span>
            <select
              value={trackSuggestions.includes(form.track) ? form.track : "__custom__"}
              onChange={(e) => {
                if (e.target.value !== "__custom__") {
                  updateField("track", e.target.value);
                }
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
            >
              {trackSuggestions.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
              {!trackSuggestions.includes(form.track) && (
                <option value="__custom__">Custom Track</option>
              )}
            </select>
          </label>

          {/* Job Profile */}
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-slate-700">Job Profile</span>
            <select
              value={
                JOB_PROFILE_GROUPS.some((g) => g.profiles.includes(form.jobProfile))
                  ? form.jobProfile
                  : ""
              }
              onChange={(e) => updateField("jobProfile", e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
            >
              <option value="">Select Job Profile...</option>
              {JOB_PROFILE_GROUPS.map((group) => (
                <optgroup key={group.category} label={group.category}>
                  {group.profiles.map((profile) => (
                    <option key={profile} value={profile}>
                      {profile}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input
              type="text"
              value={form.jobProfile}
              onChange={(e) => updateField("jobProfile", e.target.value)}
              placeholder="Or type custom Job Profile..."
              className="mt-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-sky-500"
            />
          </div>

          {/* Back Side Fields */}
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-left">
              <span className="text-xs font-semibold text-slate-700">Phone (Back)</span>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+20 1XX XXX XXXX"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-left">
              <span className="text-xs font-semibold text-slate-700">Location (Back)</span>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Cairo, Egypt"
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-slate-700">
              QR Code Link (Portfolio / LinkedIn / Bio)
            </span>
            <input
              type="url"
              value={form.qrUrl}
              onChange={(e) => updateField("qrUrl", e.target.value)}
              placeholder="https://linkedin.com/in/your-profile"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold text-slate-700">
              Back Footer Entities
            </span>
            <input
              type="text"
              value={form.accreditationFooter}
              onChange={(e) => updateField("accreditationFooter", e.target.value)}
              placeholder="DiGiLiANS • MCIT • Military Academy • NTI"
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-sky-500"
            />
          </label>

          {/* Optional Custom Logos */}
          <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-2 text-left">
            <span className="text-xs font-semibold text-slate-700">
              Header Logos (Optional)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(["Left", "Center", "Right"] as const).map((slot, idx) => {
                const i = idx as 0 | 1 | 2;
                const isCustom = display.logos[i] !== DEFAULT_LOGOS[i];
                return (
                  <div key={slot} className="flex flex-col gap-1">
                    <label className="flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100">
                      <ImagePlus className="h-3 w-3 text-sky-600" />
                      <span>{slot}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(i, e)}
                        className="hidden"
                      />
                    </label>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleResetLogo(i)}
                        className="cursor-pointer text-[10px] font-medium text-slate-400 hover:text-slate-700"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Live Card Preview & Export */}
        <section className="flex flex-col items-center gap-4 print:block">
          <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm print:hidden">
            <div>
              <h2 className="font-heading text-sm font-bold text-slate-900">
                {activeTheme.name}
              </h2>
              <p className="text-xs text-slate-500">
                {dragEnabled
                  ? "Drag any element on the card to reposition it"
                  : activeTheme.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={dragEnabled ? "default" : "outline"}
                onClick={() => setDragEnabled((prev) => !prev)}
              >
                <Move className="h-3.5 w-3.5" />
                <span>{dragEnabled ? "Drag: ON" : "Drag Layout"}</span>
              </Button>
              {hasCustomOffsets && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleResetPositions}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Pos</span>
                </Button>
              )}
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
                  {isDownloading ? "Generating..." : "Download PDF (2 Pages)"}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 print:block">
            <div className="flex flex-col items-center gap-1.5 print:block">
              <span className="text-xs font-semibold text-slate-500 print:hidden">
                Front Side (Page 1 — 8.6 × 5.4 cm)
              </span>
              <div ref={frontRef}>
                <CardFrontByTheme d={display} themeId={themeId} drag={dragProps} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 print:block">
              <span className="text-xs font-semibold text-slate-500 print:hidden">
                Back Side with QR (Page 2 — 8.6 × 5.4 cm)
              </span>
              <div ref={backRef}>
                <CardBack d={display} themeId={themeId} drag={dragProps} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
