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
  shapeArabicText,
} from "@/lib/pdfUtils";

export interface PdfCardSpec {
  key: string;
  label: string;
  jobProfile: string;
  techStack: [string, string][];
  qrUrl: string;
}

export type PdfThemeId = "1" | "2" | "3" | "4" | "5";

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
  // Crisp vector diagonal lines matching the card background
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

function PdfLogosRow({ compact = false }: { compact?: boolean }) {
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
      <View
        style={{
          flex: 1,
          height: boxH,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/logos/military-academy.png"
          style={{ maxHeight: boxH, maxWidth: 52, objectFit: "contain" }}
        />
      </View>
      <View style={{ width: 0.75, height: sepH, backgroundColor: "#cbd5e1" }} />
      <View
        style={{
          flex: 1,
          height: boxH,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4,
        }}
      >
        <Image
          src="/logos/digilians.png"
          style={{ maxHeight: boxH, maxWidth: 56, objectFit: "contain" }}
        />
      </View>
      <View style={{ width: 0.75, height: sepH, backgroundColor: "#cbd5e1" }} />
      <View
        style={{
          flex: 1,
          height: boxH,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/logos/mcit.png"
          style={{
            maxHeight: compact ? 13 : 17,
            maxWidth: 52,
            objectFit: "contain",
          }}
        />
      </View>
    </View>
  );
}

function PdfQrCode({ value, size = 60 }: { value: string; size?: number }) {
  const { size: modules, path } = buildQrSvgPath(value);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${modules} ${modules}`}>
      <Rect x={0} y={0} width={modules} height={modules} fill="#ffffff" />
      <Path d={path} fill="#0f172a" />
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
          fontFamily: "Cairo",
          fontSize: 5.8,
          fontWeight: 600,
          color,
        }}
      >
        {shapeArabicText("الرواد الرقميون")}
      </Text>
    </View>
  );
}

function ClassicFrontPage({ spec }: { spec: PdfCardSpec }) {
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

        {/* Header Logos + Divider */}
        <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
          <PdfLogosRow />
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

        {/* Portrait + Info + Contact */}
        <View style={{ paddingHorizontal: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {/* Double-layered crisp white border around portrait */}
            <View
              style={{
                width: 46,
                height: 55,
                borderRadius: 5,
                backgroundColor: "#ffffff",
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
                  backgroundColor: "#132444",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/me.png"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: "column" }}>
              <View
                style={{
                  alignSelf: "flex-start",
                  borderRadius: 3,
                  borderWidth: 0.75,
                  borderColor: "#bae6fd",
                  backgroundColor: "#f0f9ff",
                  paddingHorizontal: 5,
                  paddingVertical: 1.8,
                }}
              >
                <Text
                  style={{
                    fontSize: 5.2,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    color: "#075985",
                  }}
                >
                  {spec.jobProfile}
                </Text>
              </View>

              <Text
                style={{
                  marginTop: 3,
                  fontFamily: "SpaceGrotesk",
                  fontSize: 8.2,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                ABDELRAHMAN MAHMOUD
              </Text>

              <View
                style={{
                  marginTop: 3,
                  borderLeftWidth: 1.4,
                  borderLeftColor: "#172554",
                  paddingLeft: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 5.2,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    color: "#1e293b",
                  }}
                >
                  SPECIALIZED DIPLOMA
                </Text>
                <Text
                  style={{
                    marginTop: 0.8,
                    fontSize: 4.8,
                    fontWeight: 600,
                    letterSpacing: 0.25,
                    color: "#475569",
                  }}
                >
                  AI BASED SOFTWARE DEVELOPMENT
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginVertical: 4,
              height: 0.6,
              width: "100%",
              backgroundColor: "#cbd5e1",
            }}
          />

          <View style={{ flexDirection: "column", gap: 2 }}>
            {[
              { label: "PHONE", value: "+20 109 516 0726" },
              {
                label: "EMAIL",
                value: "abdelrahman.mahmoud.elsaeed@gmail.com",
              },
            ].map((row) => (
              <View
                key={row.label}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  style={{
                    width: 26,
                    fontSize: 5.2,
                    fontWeight: 600,
                    color: "#64748b",
                  }}
                >
                  {row.label}
                </Text>
                <Text
                  style={{
                    width: 7,
                    fontSize: 5.2,
                    color: "#38bdf8",
                  }}
                >
                  |
                </Text>
                <Text
                  style={{
                    fontSize: 5.4,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              paddingBottom: 3,
            }}
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
  spec,
  themeId,
}: {
  spec: PdfCardSpec;
  themeId: PdfThemeId;
}) {
  if (themeId === "1") {
    return <ClassicFrontPage spec={spec} />;
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
        <View
          style={{
            backgroundColor: themeId === "4" ? "#ffffff" : "transparent",
            padding: themeId === "4" ? 3 : 0,
            borderRadius: themeId === "4" ? 3 : 0,
          }}
        >
          <PdfLogosRow compact />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 52,
              height: 62,
              borderRadius: 5,
              backgroundColor: "#ffffff",
              padding: 1.5,
              borderWidth: 0.75,
              borderColor: "#cbd5e1",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 4,
                backgroundColor: "#132444",
                overflow: "hidden",
              }}
            >
              <Image
                src="/me.png"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: themeId === "3" ? "#ffffff" : "transparent",
              padding: themeId === "3" ? 6 : 0,
              borderRadius: themeId === "3" ? 3 : 0,
              borderWidth: themeId === "3" ? 0.5 : 0,
              borderColor: "#e2e8f0",
            }}
          >
            <Text
              style={{
                fontSize: 5.2,
                fontWeight: 700,
                letterSpacing: 0.4,
                color: "#0369a1",
              }}
            >
              {spec.jobProfile}
            </Text>
            <Text
              style={{
                marginTop: 2,
                fontFamily: "SpaceGrotesk",
                fontSize: 8.2,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              ABDELRAHMAN MAHMOUD
            </Text>
            <Text
              style={{
                marginTop: 1.5,
                fontSize: 5.2,
                fontWeight: 600,
                color: "#475569",
              }}
            >
              abdelrahman.mahmoud.elsaeed
            </Text>
            <View
              style={{
                marginTop: 4,
                borderLeftWidth: 1.5,
                borderLeftColor: "#0284c7",
                paddingLeft: 5,
              }}
            >
              <Text style={{ fontSize: 5, fontWeight: 700, color: "#1e293b" }}>
                SPECIALIZED DIPLOMA
              </Text>
              <Text style={{ fontSize: 4.8, fontWeight: 500, color: "#475569" }}>
                AI Based Software Development
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 5,
              fontWeight: 600,
              color: themeId === "2" ? "#bae6fd" : "#64748b",
            }}
          >
            CAIRO, EGYPT
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
  spec,
  themeId,
}: {
  spec: PdfCardSpec;
  themeId: PdfThemeId;
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
            style={{
              flex: 1,
              borderLeftWidth: 1.6,
              borderLeftColor: "#172554",
              paddingLeft: 9,
              flexDirection: "column",
              gap: 6,
            }}
          >
            {spec.techStack.map(([left, right]) => (
              <View
                key={left}
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Text
                  style={{ fontSize: 6.8, fontWeight: 600, color: "#1e293b" }}
                >
                  {left}
                </Text>
                <View
                  style={{
                    width: 2.5,
                    height: 2.5,
                    borderRadius: 1.25,
                    backgroundColor: "#cbd5e1",
                  }}
                />
                <Text
                  style={{ fontSize: 6.8, fontWeight: 600, color: "#1e293b" }}
                >
                  {right}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 6,
              borderWidth: 0.75,
              borderColor: "#e2e8f0",
              backgroundColor: "#ffffff",
              padding: 6,
            }}
          >
            <PdfQrCode value={spec.qrUrl} size={62} />
            <Text
              style={{
                marginTop: 4,
                fontSize: 5.2,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#1e293b",
              }}
            >
              SCAN ME
            </Text>
            <Text
              style={{
                marginTop: 1,
                fontSize: 4.8,
                fontWeight: 600,
                color: "#94a3b8",
              }}
            >
              CV & Projects
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "column" }}>
          <Text
            style={{
              paddingBottom: 3,
              textAlign: "center",
              fontSize: 5,
              fontWeight: 500,
              letterSpacing: 0.4,
              color: themeId === "2" ? "#f8fafc" : "#64748b",
            }}
          >
            DiGiLiANS • MCIT • Military Academy • NTI
          </Text>
          <View style={styles.navyBar} />
        </View>
      </View>
    </Page>
  );
}

export function IdCardPdfDocument({
  spec,
  themeId,
}: {
  spec: PdfCardSpec;
  themeId: PdfThemeId;
}) {
  ensurePdfFontsRegistered();
  return (
    <Document title={`ID Card — ${spec.label}`}>
      <ThemedFrontPage spec={spec} themeId={themeId} />
      <CardBackPage spec={spec} themeId={themeId} />
    </Document>
  );
}
