import {
  Document,
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
} from "@/lib/pdfUtils";

export interface PersonalCardPdfDisplay {
  name: string;
  hasName: boolean;
  jobProfile: string;
  hasJobProfile: boolean;
  email: string;
  hasEmail: boolean;
  phone: string;
  hasPhone: boolean;
  location: string;
  hasLocation: boolean;
  initiative: string;
  techStack: string[];
  qrUrl: string;
  hasQrUrl: boolean;
}

export type PersonalCardThemeId = "1" | "2" | "3" | "4" | "5";

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

function PdfQrCode({
  value,
  size = 56,
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

function FrontPage({
  d,
  themeId,
}: {
  d: PersonalCardPdfDisplay;
  themeId: PersonalCardThemeId;
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
        }}
      >
        {themeId === "1" ? (
          <View style={styles.navyBar} />
        ) : themeId === "4" ? (
          <View style={{ paddingHorizontal: 14, paddingTop: 7 }}>
            <Text
              style={{
                fontFamily: hasArabicText(d.initiative) ? "Amiri" : "Inter",
                fontSize: 6.5,
                fontWeight: 700,
                letterSpacing: 1.1,
                color: "#bae6fd",
              }}
            >
              {formatPdfText(d.initiative)}
            </Text>
          </View>
        ) : (
          <View style={{ height: 8 }} />
        )}

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 18,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: themeId === "3" ? "#ffffff" : "transparent",
              padding: themeId === "3" ? 7 : 0,
              borderRadius: themeId === "3" ? 4 : 0,
              borderWidth: themeId === "3" ? 0.5 : 0,
              borderColor: "#e2e8f0",
            }}
          >
            <Text
              style={{
                fontFamily: hasArabicText(d.name) ? "Amiri" : "SpaceGrotesk",
                fontSize: 11.5,
                fontWeight: 700,
                color: d.hasName ? "#0f172a" : "#94a3b8",
              }}
            >
              {formatPdfText(d.name)}
            </Text>

            <View
              style={{
                marginTop: 3,
                alignSelf: "flex-start",
                borderRadius: 2,
                borderWidth: 0.6,
                borderColor: "#bae6fd",
                backgroundColor: "#f0f9ff",
                paddingHorizontal: 5,
                paddingVertical: 1.8,
              }}
            >
              <Text
                style={{
                  fontFamily: hasArabicText(d.jobProfile) ? "Amiri" : "Inter",
                  fontSize: 6.2,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: d.hasJobProfile ? "#075985" : "#94a3b8",
                }}
              >
                {formatPdfText(d.jobProfile)}
              </Text>
            </View>

            <View
              style={{
                marginTop: 7,
                paddingTop: 5,
                borderTopWidth: 0.6,
                borderTopColor: "#cbd5e1",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: hasArabicText(d.phone) ? "Amiri" : "Inter",
                  fontSize: 6.5,
                  fontWeight: 600,
                  color: d.hasPhone ? "#1e293b" : "#94a3b8",
                }}
              >
                {formatPdfText(d.phone)}
              </Text>
              <Text
                style={{
                  fontFamily: hasArabicText(d.email) ? "Amiri" : "Inter",
                  fontSize: 6.5,
                  fontWeight: 500,
                  color: d.hasEmail ? "#475569" : "#94a3b8",
                }}
              >
                {formatPdfText(d.email)}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent:
              themeId === "2" || themeId === "3" ? "space-between" : "flex-end",
            alignItems: "center",
            paddingHorizontal: 18,
            paddingBottom: themeId === "1" ? 4 : 6,
          }}
        >
          {(themeId === "2" || themeId === "3") && (
            <Text
              style={{
                fontFamily: hasArabicText(d.location) ? "Amiri" : "Inter",
                fontSize: 6.2,
                fontWeight: 600,
                color: themeId === "2" ? "#bae6fd" : "#64748b",
              }}
            >
              {formatPdfText(d.location)}
            </Text>
          )}
          <Text
            style={{
              fontFamily: hasArabicText(d.initiative) ? "Amiri" : "Inter",
              fontSize: 6.2,
              fontWeight: 600,
              letterSpacing: 0.9,
              color: themeId === "2" ? "#ffffff" : "#64748b",
            }}
          >
            {formatPdfText(d.initiative)}
          </Text>
        </View>

        {themeId === "1" && <View style={styles.navyBar} />}
      </View>
    </Page>
  );
}

function BackPage({
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
            style={{
              flex: 1,
              borderLeftWidth: 1.6,
              borderLeftColor: "#172554",
              paddingLeft: 9,
              flexDirection: "column",
              gap: 5,
            }}
          >
            {rows.map(([left, right]) => (
              <View
                key={left}
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Text
                  style={{
                    fontFamily: hasArabicText(left) ? "Amiri" : "Inter",
                    fontSize: 7.2,
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  {formatPdfText(left)}
                </Text>
                {right && (
                  <>
                    <Text style={{ fontSize: 7, color: "#94a3b8" }}>•</Text>
                    <Text
                      style={{
                        fontFamily: hasArabicText(right) ? "Amiri" : "Inter",
                        fontSize: 7.2,
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    >
                      {formatPdfText(right)}
                    </Text>
                  </>
                )}
              </View>
            ))}
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 4,
              borderWidth: 0.75,
              borderColor: "#cbd5e1",
              backgroundColor: "#ffffff",
              padding: 5,
            }}
          >
            <PdfQrCode
              value={d.qrUrl}
              size={56}
              color={d.hasQrUrl ? "#0f172a" : "#94a3b8"}
            />
            <Text
              style={{
                marginTop: 3,
                fontSize: 6.2,
                fontWeight: 700,
                letterSpacing: 0.8,
                color: "#334155",
              }}
            >
              {d.hasQrUrl ? "SCAN ME" : "ADD QR URL"}
            </Text>
            <Text
              style={{
                marginTop: 1,
                fontSize: 5.8,
                fontWeight: 500,
                color: "#64748b",
              }}
            >
              CV & Projects
            </Text>
          </View>
        </View>

        {themeId !== "2" && <View style={styles.navyBar} />}
      </View>
    </Page>
  );
}

export function PersonalCardPdfDocument({
  d,
  themeId,
}: {
  d: PersonalCardPdfDisplay;
  themeId: PersonalCardThemeId;
}) {
  ensurePdfFontsRegistered();
  return (
    <Document title={`Personal Card — ${d.name}`}>
      <FrontPage d={d} themeId={themeId} />
      <BackPage d={d} themeId={themeId} />
    </Document>
  );
}
