import { Fragment } from "react";
import {
  Document,
  Image,
  Page,
  Path,
  Polygon,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  buildQrSvgPath,
  CARD_PAGE_SIZE,
  ensurePdfFontsRegistered,
  formatPdfText,
  hasArabicText,
  shapeArabicText,
} from "@/lib/pdfUtils";

export interface LocalCardPdfDisplay {
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
  logos: string[];
}

export type LocalCardThemeId = "1" | "2" | "3" | "4" | "5";

export interface PdfElementOffset {
  x: number;
  y: number;
}

const styles = StyleSheet.create({
  page: {
    width: CARD_PAGE_SIZE[0],
    height: CARD_PAGE_SIZE[1],
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    position: "relative",
    overflow: "hidden",
  },
  navyBar: {
    height: 4.5,
    width: "100%",
    backgroundColor: "#172554",
  },
  fillAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

function offsetStyle(offsets: Record<string, PdfElementOffset>, id: string) {
  const off = offsets[id];
  if (!off || (off.x === 0 && off.y === 0)) return undefined;
  return {
    transform: `translate(${off.x * 0.75}pt, ${off.y * 0.75}pt)`,
  };
}

function PdfDiagonalBackground() {
  const lines: string[] = [];
  for (let x = -180; x < 340; x += 10) {
    lines.push(`M${x},160 L${x + 220},0`);
  }
  return (
    <Svg
      width={CARD_PAGE_SIZE[0]}
      height={CARD_PAGE_SIZE[1]}
      viewBox={`0 0 ${CARD_PAGE_SIZE[0]} ${CARD_PAGE_SIZE[1]}`}
      style={styles.fillAbsolute}
    >
      <Rect
        x={0}
        y={0}
        width={CARD_PAGE_SIZE[0]}
        height={CARD_PAGE_SIZE[1]}
        fill="#f8fafc"
      />
      <Path
        d={lines.join(" ")}
        stroke="#94a3b8"
        strokeOpacity={0.14}
        strokeWidth={0.6}
      />
    </Svg>
  );
}

function PdfLogosRow({
  logos,
  compact = false,
}: {
  logos: string[];
  compact?: boolean;
}) {
  if (logos.length === 0) return null;
  const boxH = compact ? 15 : 20;
  const sepH = compact ? 11 : 16;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {logos.map((src, index) => (
        <Fragment key={`${src.slice(0, 32)}-${index}`}>
          {index > 0 && (
            <View
              style={{ width: 0.75, height: sepH, backgroundColor: "#cbd5e1" }}
            />
          )}
          <View
            style={{
              flex: 1,
              height: boxH,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 3,
            }}
          >
            <Image
              src={src}
              style={{ maxHeight: boxH, maxWidth: 54, objectFit: "contain" }}
            />
          </View>
        </Fragment>
      ))}
    </View>
  );
}

function PdfPortrait({
  photoDataUrl,
  width,
  height,
  borderColor = "#ffffff",
}: {
  photoDataUrl: string;
  width: number;
  height: number;
  borderColor?: string;
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 5,
        backgroundColor: borderColor,
        padding: 1.5,
        borderWidth: 0.5,
        borderColor: "#cbd5e1",
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 4,
          backgroundColor: photoDataUrl ? "#132444" : "#f1f5f9",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {photoDataUrl ? (
          <Image
            src={photoDataUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Text style={{ fontSize: 5.5, fontWeight: 600, color: "#94a3b8" }}>
            PHOTO
          </Text>
        )}
      </View>
    </View>
  );
}

function PdfQrCode({
  value,
  size = 60,
  color = "#0f172a",
}: {
  value: string;
  size?: number;
  color?: string;
}) {
  const { size: modules, path } = buildQrSvgPath(value);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${modules} ${modules}`}>
      <Rect x={0} y={0} width={modules} height={modules} fill="#ffffff" />
      <Path d={path} fill={color} />
    </Svg>
  );
}

function ArabicDigiliansFooter({ color = "#475569" }: { color?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
      <Text
        style={{
          fontSize: 5.5,
          fontWeight: 600,
          letterSpacing: 0.4,
          color,
        }}
      >
        DIGILIANS •
      </Text>
      <Text
        style={{
          fontFamily: "Amiri",
          fontSize: 6.2,
          fontWeight: 700,
          color,
        }}
      >
        {shapeArabicText("الرواد الرقميون")}
      </Text>
    </View>
  );
}

function ClassicFrontPage({
  d,
  offsets,
}: {
  d: LocalCardPdfDisplay;
  offsets: Record<string, PdfElementOffset>;
}) {
  const rows = [
    { label: "NAME", value: d.name, active: d.hasName },
    { label: "EMAIL", value: d.email, active: d.hasEmail },
    { label: "PROGRAM", value: d.program, active: d.hasProgram },
    { label: "TRACK", value: d.track, active: d.hasTrack },
    { label: "JOB PROFILE", value: d.jobProfile, active: d.hasJobProfile },
  ];

  return (
    <Page size={CARD_PAGE_SIZE} style={styles.page}>
      <PdfDiagonalBackground />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.navyBar} />

        {d.logos.length > 0 && (
          <View
            style={[
              { paddingHorizontal: 12, paddingTop: 4 },
              offsetStyle(offsets, "front-logos") ?? {},
            ]}
          >
            <PdfLogosRow logos={d.logos} />
            <View
              style={{
                marginTop: 4,
                height: 4,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: 0.75,
                  backgroundColor: "#a5b4fc",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#818cf8",
                }}
              />
            </View>
          </View>
        )}

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 9,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <View style={offsetStyle(offsets, "front-photo")}>
            <PdfPortrait photoDataUrl={d.photoDataUrl} width={54} height={66} />
          </View>

          <View
            style={[
              { flex: 1, flexDirection: "column", gap: 4 },
              offsetStyle(offsets, "front-info") ?? {},
            ]}
          >
            {rows.map((row) => (
              <View
                key={row.label}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  style={{
                    width: 42,
                    fontSize: 5.5,
                    fontWeight: 500,
                    color: "#64748b",
                  }}
                >
                  {row.label}
                </Text>
                <Text style={{ width: 6, fontSize: 5.5, color: "#38bdf8" }}>
                  |
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: hasArabicText(row.value) ? "Amiri" : "Inter",
                    fontSize: 5.7,
                    fontWeight: 700,
                    color: row.active ? "#0f172a" : "#94a3b8",
                  }}
                >
                  {formatPdfText(row.value)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "column" }}>
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                paddingBottom: 3,
              },
              offsetStyle(offsets, "front-footer") ?? {},
            ]}
          >
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: "#172554",
              }}
            />
            <ArabicDigiliansFooter />
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: "#172554",
              }}
            />
          </View>
          <View style={styles.navyBar} />
        </View>
      </View>
    </Page>
  );
}

function ThemedFrontPage({
  d,
  themeId,
  offsets,
}: {
  d: LocalCardPdfDisplay;
  themeId: LocalCardThemeId;
  offsets: Record<string, PdfElementOffset>;
}) {
  if (themeId === "1") {
    return <ClassicFrontPage d={d} offsets={offsets} />;
  }

  return (
    <Page size={CARD_PAGE_SIZE} style={styles.page}>
      {themeId === "2" && (
        <Svg
          width={CARD_PAGE_SIZE[0]}
          height={CARD_PAGE_SIZE[1]}
          viewBox="0 0 320 200"
          style={styles.fillAbsolute}
        >
          <Path
            d="M0,144 C75,172 155,108 320,138 L320,200 L0,200 Z"
            fill="#e0f2fe"
          />
          <Path
            d="M0,164 C95,180 185,126 320,156 L320,200 L0,200 Z"
            fill="#172554"
          />
          <Path d="M0,0 L115,0 C82,34 38,38 0,68 Z" fill="#eff6ff" />
        </Svg>
      )}
      {themeId === "3" && (
        <Svg
          width={CARD_PAGE_SIZE[0]}
          height={CARD_PAGE_SIZE[1]}
          viewBox="0 0 320 200"
          style={styles.fillAbsolute}
        >
          <Polygon points="225,0 320,0 320,200 175,200" fill="#172554" />
          <Polygon points="205,0 228,0 178,200 155,200" fill="#0ea5e9" />
          <Polygon points="193,0 205,0 155,200 143,200" fill="#bae6fd" />
        </Svg>
      )}
      {themeId === "4" && (
        <Svg
          width={CARD_PAGE_SIZE[0]}
          height={CARD_PAGE_SIZE[1]}
          viewBox="0 0 320 200"
          style={styles.fillAbsolute}
        >
          <Path d="M0,0 L320,0 L320,44 Q160,64 0,44 Z" fill="#172554" />
          <Rect x={0} y={194} width={320} height={6} fill="#172554" />
        </Svg>
      )}
      {themeId === "5" && (
        <Svg
          width={CARD_PAGE_SIZE[0]}
          height={CARD_PAGE_SIZE[1]}
          viewBox="0 0 320 200"
          style={styles.fillAbsolute}
        >
          <Polygon points="0,0 92,0 0,66" fill="#172554" />
          <Polygon points="92,0 112,0 0,80 0,66" fill="#0ea5e9" />
          <Polygon points="230,200 320,200 320,138" fill="#172554" />
          <Polygon points="210,200 230,200 320,138 320,124" fill="#38bdf8" />
        </Svg>
      )}

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        {d.logos.length > 0 ? (
          <View
            style={[
              {
                backgroundColor: themeId === "4" ? "#ffffff" : "transparent",
                padding: themeId === "4" ? 3 : 0,
                borderRadius: themeId === "4" ? 3 : 0,
              },
              offsetStyle(offsets, "front-logos") ?? {},
            ]}
          >
            <PdfLogosRow logos={d.logos} compact />
          </View>
        ) : (
          <View style={{ height: 4 }} />
        )}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={offsetStyle(offsets, "front-photo")}>
            <PdfPortrait photoDataUrl={d.photoDataUrl} width={52} height={62} />
          </View>

          <View
            style={[
              {
                flex: 1,
                backgroundColor: themeId === "3" ? "#ffffff" : "transparent",
                padding: themeId === "3" ? 6 : 0,
                borderRadius: themeId === "3" ? 3 : 0,
                borderWidth: themeId === "3" ? 0.5 : 0,
                borderColor: "#e2e8f0",
              },
              offsetStyle(offsets, "front-info") ?? {},
            ]}
          >
            <Text
              style={{
                fontFamily: hasArabicText(d.jobProfile) ? "Amiri" : "Inter",
                fontSize: 5.2,
                fontWeight: 700,
                letterSpacing: 0.4,
                color: d.hasJobProfile ? "#0369a1" : "#94a3b8",
              }}
            >
              {formatPdfText(d.jobProfile)}
            </Text>
            <Text
              style={{
                marginTop: 2,
                fontFamily: hasArabicText(d.name) ? "Amiri" : "SpaceGrotesk",
                fontSize: 8.2,
                fontWeight: 700,
                color: d.hasName ? "#0f172a" : "#94a3b8",
              }}
            >
              {formatPdfText(d.name)}
            </Text>
            <Text
              style={{
                marginTop: 1.5,
                fontFamily: hasArabicText(d.email) ? "Amiri" : "Inter",
                fontSize: 5.2,
                fontWeight: 600,
                color: d.hasEmail ? "#475569" : "#94a3b8",
              }}
            >
              {formatPdfText(d.email)}
            </Text>
            <View
              style={{
                marginTop: 4,
                borderLeftWidth: 1.5,
                borderLeftColor: "#0284c7",
                paddingLeft: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: hasArabicText(d.program) ? "Amiri" : "Inter",
                  fontSize: 5,
                  fontWeight: 700,
                  color: d.hasProgram ? "#1e293b" : "#94a3b8",
                }}
              >
                {formatPdfText(d.program)}
              </Text>
              <Text
                style={{
                  fontFamily: hasArabicText(d.track) ? "Amiri" : "Inter",
                  fontSize: 4.8,
                  fontWeight: 500,
                  color: d.hasTrack ? "#475569" : "#94a3b8",
                }}
              >
                {formatPdfText(d.track)}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
            offsetStyle(offsets, "front-footer") ?? {},
          ]}
        >
          <Text
            style={{
              fontFamily: hasArabicText(d.location) ? "Amiri" : "Inter",
              fontSize: 5,
              fontWeight: 600,
              color: themeId === "2" ? "#bae6fd" : "#64748b",
            }}
          >
            {formatPdfText(d.location.toUpperCase())}
          </Text>
          <ArabicDigiliansFooter
            color={themeId === "2" ? "#ffffff" : "#475569"}
          />
        </View>
      </View>
    </Page>
  );
}

function CardBackPage({
  d,
  themeId,
  offsets,
}: {
  d: LocalCardPdfDisplay;
  themeId: LocalCardThemeId;
  offsets: Record<string, PdfElementOffset>;
}) {
  return (
    <Page size={CARD_PAGE_SIZE} style={styles.page}>
      {themeId === "1" && <PdfDiagonalBackground />}
      {themeId === "2" && (
        <Svg
          width={CARD_PAGE_SIZE[0]}
          height={CARD_PAGE_SIZE[1]}
          viewBox="0 0 320 200"
          style={styles.fillAbsolute}
        >
          <Path
            d="M0,162 C90,180 180,136 320,160 L320,200 L0,200 Z"
            fill="#172554"
          />
        </Svg>
      )}
      {themeId === "3" && (
        <Svg
          width={CARD_PAGE_SIZE[0]}
          height={CARD_PAGE_SIZE[1]}
          viewBox="0 0 320 200"
          style={styles.fillAbsolute}
        >
          <Polygon points="0,0 24,0 10,200 0,200" fill="#172554" />
          <Polygon points="24,0 30,0 16,200 10,200" fill="#0ea5e9" />
        </Svg>
      )}

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.navyBar} />

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: themeId === "3" ? 26 : 18,
            paddingRight: 16,
            gap: 10,
          }}
        >
          <View
            style={[
              { flex: 1, flexDirection: "column" },
              offsetStyle(offsets, "back-info") ?? {},
            ]}
          >
            <View
              style={{
                alignSelf: "flex-start",
                borderWidth: 0.6,
                borderColor: "#bae6fd",
                backgroundColor: "#f0f9ff",
                paddingHorizontal: 4,
                paddingVertical: 1.5,
              }}
            >
              <Text
                style={{
                  fontFamily: hasArabicText(d.jobProfile) ? "Amiri" : "Inter",
                  fontSize: 5.2,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  color: d.hasJobProfile ? "#0369a1" : "#94a3b8",
                }}
              >
                {formatPdfText(d.jobProfile)}
              </Text>
            </View>

            <Text
              style={{
                marginTop: 4,
                fontFamily: hasArabicText(d.name) ? "Amiri" : "SpaceGrotesk",
                fontSize: 8.2,
                fontWeight: 700,
                color: d.hasName ? "#0f172a" : "#94a3b8",
              }}
            >
              {formatPdfText(d.name)}
            </Text>

            <Text
              style={{
                marginTop: 1.5,
                fontSize: 5.5,
                fontWeight: 500,
                color: "#475569",
              }}
            >
              Scan QR for CV, Projects & vCard
            </Text>

            <View style={{ marginTop: 6, flexDirection: "column", gap: 1.5 }}>
              <Text
                style={{
                  fontFamily: hasArabicText(d.phone) ? "Amiri" : "Inter",
                  fontSize: 5.2,
                  color: d.hasPhone ? "#475569" : "#94a3b8",
                }}
              >
                {formatPdfText(d.phone)}
              </Text>
              <Text
                style={{
                  fontFamily: hasArabicText(d.location) ? "Amiri" : "Inter",
                  fontSize: 5.2,
                  color: d.hasLocation ? "#475569" : "#94a3b8",
                }}
              >
                {formatPdfText(d.location)}
              </Text>
            </View>
          </View>

          <View
            style={[
              {
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 4,
                borderWidth: 0.75,
                borderColor: "#cbd5e1",
                backgroundColor: "#ffffff",
                padding: 5,
              },
              offsetStyle(offsets, "back-qr") ?? {},
            ]}
          >
            <PdfQrCode
              value={d.qrUrl}
              size={60}
              color={d.hasQrUrl ? "#0f172a" : "#94a3b8"}
            />
            <Text
              style={{
                marginTop: 3,
                fontSize: 4.8,
                fontWeight: 600,
                letterSpacing: 0.8,
                color: "#64748b",
              }}
            >
              {d.hasQrUrl ? "SCAN ME" : "ADD QR URL"}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "column" }}>
          <Text
            style={[
              {
                paddingBottom: 3,
                textAlign: "center",
                fontFamily: hasArabicText(d.accreditationFooter) ? "Amiri" : "Inter",
                fontSize: 5,
                fontWeight: 500,
                letterSpacing: 0.4,
                color: themeId === "2" ? "#f8fafc" : "#64748b",
              },
              offsetStyle(offsets, "back-footer") ?? {},
            ]}
          >
            {formatPdfText(d.accreditationFooter)}
          </Text>
          <View style={styles.navyBar} />
        </View>
      </View>
    </Page>
  );
}

export function LocalCardPdfDocument({
  d,
  themeId,
  offsets,
}: {
  d: LocalCardPdfDisplay;
  themeId: LocalCardThemeId;
  offsets: Record<string, PdfElementOffset>;
}) {
  ensurePdfFontsRegistered();
  return (
    <Document title={`ID Card — ${d.name}`}>
      <ThemedFrontPage d={d} themeId={themeId} offsets={offsets} />
      <CardBackPage d={d} themeId={themeId} offsets={offsets} />
    </Document>
  );
}
