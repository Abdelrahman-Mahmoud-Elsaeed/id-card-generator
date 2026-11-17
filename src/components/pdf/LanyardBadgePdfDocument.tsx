import {
  Document,
  Image,
  Page,
  Path,
  Rect,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  BADGE_PAGE_SIZE,
  buildQrSvgPath,
  ensurePdfFontsRegistered,
  shapeArabicText,
} from "@/lib/pdfUtils";

export interface BadgePdfInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  program: string;
  track: string;
  qrUrl: string;
}

const styles = StyleSheet.create({
  page: {
    width: BADGE_PAGE_SIZE[0],
    height: BADGE_PAGE_SIZE[1],
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    position: "relative",
    overflow: "hidden",
  },
  navyBar: {
    height: 6,
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
  for (let x = -220; x < 360; x += 10) {
    lines.push(`M${x},360 L${x + 280},0`);
  }
  return (
    <Svg
      width={BADGE_PAGE_SIZE[0]}
      height={BADGE_PAGE_SIZE[1]}
      viewBox={`0 0 ${BADGE_PAGE_SIZE[0]} ${BADGE_PAGE_SIZE[1]}`}
      style={styles.fillAbsolute}
    >
      <Rect
        x={0}
        y={0}
        width={BADGE_PAGE_SIZE[0]}
        height={BADGE_PAGE_SIZE[1]}
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

function BadgeLogosRow() {
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
          height: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/logos/military-academy.png"
          style={{ maxHeight: 20, maxWidth: 52, objectFit: "contain" }}
        />
      </View>
      <View style={{ width: 0.75, height: 15, backgroundColor: "#cbd5e1" }} />
      <View
        style={{
          flex: 1,
          height: 20,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4,
        }}
      >
        <Image
          src="/logos/digilians.png"
          style={{ maxHeight: 20, maxWidth: 56, objectFit: "contain" }}
        />
      </View>
      <View style={{ width: 0.75, height: 15, backgroundColor: "#cbd5e1" }} />
      <View
        style={{
          flex: 1,
          height: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/logos/mcit.png"
          style={{ maxHeight: 17, maxWidth: 52, objectFit: "contain" }}
        />
      </View>
    </View>
  );
}

function PdfQrCode({ value, size }: { value: string; size: number }) {
  const { size: modules, path } = buildQrSvgPath(value);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${modules} ${modules}`}>
      <Rect x={0} y={0} width={modules} height={modules} fill="#ffffff" />
      <Path d={path} fill="#0f172a" />
    </Svg>
  );
}

function LanyardSlot() {
  return (
    <View style={{ alignItems: "center", paddingTop: 6, paddingBottom: 3 }}>
      <View
        style={{
          width: 28,
          height: 4.5,
          borderRadius: 2.25,
          borderWidth: 0.75,
          borderColor: "#cbd5e1",
          backgroundColor: "#f1f5f9",
        }}
      />
    </View>
  );
}

export function LanyardBadgePdfDocument({
  info,
  platformCode,
  platformIdText,
}: {
  info: BadgePdfInfo;
  platformCode: string;
  platformIdText: string;
}) {
  ensurePdfFontsRegistered();
  const displayId = platformIdText.trim() || "#______";

  return (
    <Document title="Lanyard Badge (9 × 12 cm)">
      {/* Page 1: Front */}
      <Page size={BADGE_PAGE_SIZE} style={styles.page}>
        <PdfDiagonalBackground />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={styles.navyBar} />
            <LanyardSlot />
            <View style={{ paddingHorizontal: 14, paddingTop: 4 }}>
              <BadgeLogosRow />
              <View
                style={{
                  marginTop: 6,
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
                    width: 4.5,
                    height: 4.5,
                    borderRadius: 2.25,
                    backgroundColor: "#818cf8",
                  }}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 14,
              paddingVertical: 6,
            }}
          >
            {/* Double-layered crisp white border around portrait */}
            <View
              style={{
                width: 70,
                height: 85,
                borderRadius: 8,
                backgroundColor: "#ffffff",
                padding: 2,
                borderWidth: 0.75,
                borderColor: "#cbd5e1",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 6,
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

            <Text
              style={{
                marginTop: 9,
                fontFamily: "SpaceGrotesk",
                fontSize: 13.5,
                fontWeight: 700,
                color: "#0f172a",
                textAlign: "center",
              }}
            >
              {info.name}
            </Text>

            <View
              style={{
                marginTop: 5,
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  color: "#1e293b",
                  textAlign: "center",
                }}
              >
                {info.program}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 600,
                  color: "#075985",
                  textAlign: "center",
                }}
              >
                {info.track}
              </Text>
            </View>

            <View
              style={{
                marginTop: 9,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderRadius: 6,
                borderWidth: 0.75,
                borderColor: "#cbd5e1",
                backgroundColor: "#ffffff",
                paddingHorizontal: 9,
                paddingVertical: 5,
              }}
            >
              {platformCode.trim() ? (
                <PdfQrCode value={platformCode.trim()} size={40} />
              ) : (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 3,
                    borderWidth: 0.75,
                    borderColor: "#cbd5e1",
                    borderStyle: "dashed",
                    backgroundColor: "#f8fafc",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 6.5,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textAlign: "center",
                    }}
                  >
                    EVENT
                  </Text>
                  <Text
                    style={{
                      fontSize: 6.5,
                      fontWeight: 600,
                      color: "#94a3b8",
                      textAlign: "center",
                    }}
                  >
                    QR
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    fontSize: 7.5,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    color: "#1e293b",
                  }}
                >
                  FORUM ID
                </Text>
                <Text
                  style={{
                    marginTop: 1.5,
                    fontSize: 7.5,
                    fontWeight: 600,
                    color: "#475569",
                  }}
                >
                  {displayId}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#172554",
              paddingVertical: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 7,
                fontWeight: 600,
                letterSpacing: 0.6,
                color: "#ffffff",
              }}
            >
              DIGILIANS •
            </Text>
            <Text
              style={{
                fontFamily: "Amiri",
                fontSize: 7.5,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              {shapeArabicText("الرواد الرقميون")}
            </Text>
          </View>
        </View>
      </Page>

      {/* Page 2: Back */}
      <Page size={BADGE_PAGE_SIZE} style={styles.page}>
        <PdfDiagonalBackground />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={styles.navyBar} />
            <LanyardSlot />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 14,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 8,
                borderWidth: 0.75,
                borderColor: "#cbd5e1",
                backgroundColor: "#ffffff",
                padding: 10,
              }}
            >
              <PdfQrCode value={info.qrUrl} size={105} />
              <Text
                style={{
                  marginTop: 7,
                  fontSize: 7.5,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  color: "#334155",
                }}
              >
                SCAN ME
              </Text>
              <Text
                style={{
                  marginTop: 1.5,
                  fontSize: 7,
                  fontWeight: 500,
                  color: "#64748b",
                }}
              >
                CV, Projects & vCard
              </Text>
            </View>

            <View
              style={{
                marginTop: 14,
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Text style={{ fontSize: 7.5, fontWeight: 600, color: "#1e293b" }}>
                {info.phone}
              </Text>
              <Text style={{ fontSize: 7.5, fontWeight: 500, color: "#475569" }}>
                {info.email}
              </Text>
              <Text style={{ fontSize: 7.5, fontWeight: 500, color: "#475569" }}>
                {info.location}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                paddingBottom: 4.5,
                textAlign: "center",
                fontSize: 7,
                fontWeight: 600,
                letterSpacing: 0.5,
                color: "#475569",
              }}
            >
              DIGILIANS • MCIT • Military Academy • NTI
            </Text>
            <View style={styles.navyBar} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
