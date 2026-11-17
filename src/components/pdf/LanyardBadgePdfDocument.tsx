import {
  Circle,
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
  BADGE_PAGE_SIZE,
  buildQrSvgPath,
  ensurePdfFontsRegistered,
  shapeArabicText,
} from "@/lib/pdfUtils";

export type BadgePdfThemeId = "1" | "2" | "3" | "4" | "5";

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

function BadgeLogosRow({ compact = false }: { compact?: boolean }) {
  const h = compact ? 16 : 20;
  const sep = compact ? 12 : 15;
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
          height: h,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/logos/military-academy.png"
          style={{ maxHeight: h, maxWidth: 48, objectFit: "contain" }}
        />
      </View>
      <View style={{ width: 0.75, height: sep, backgroundColor: "#cbd5e1" }} />
      <View
        style={{
          flex: 1,
          height: h,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4,
        }}
      >
        <Image
          src="/logos/digilians.png"
          style={{ maxHeight: h, maxWidth: 52, objectFit: "contain" }}
        />
      </View>
      <View style={{ width: 0.75, height: sep, backgroundColor: "#cbd5e1" }} />
      <View
        style={{
          flex: 1,
          height: h,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/logos/mcit.png"
          style={{
            maxHeight: compact ? 13 : 17,
            maxWidth: 48,
            objectFit: "contain",
          }}
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

function LanyardPunchHole({ light = false }: { light?: boolean }) {
  return (
    <View style={{ alignItems: "center", paddingTop: 6, paddingBottom: 3 }}>
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 3.5,
          borderWidth: 0.75,
          borderColor: light ? "#bae6fd" : "#cbd5e1",
          backgroundColor: light ? "#ffffff" : "#f1f5f9",
        }}
      />
    </View>
  );
}

function PortraitFrame({
  circular = false,
  size = 70,
  height = 85,
}: {
  circular?: boolean;
  size?: number;
  height?: number;
}) {
  const w = size;
  const h = circular ? size : height;
  const r = circular ? size / 2 : 8;
  return (
    <View
      style={{
        width: w,
        height: h,
        borderRadius: r,
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
          borderRadius: circular ? r : 6,
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
  );
}

function ForumQrBox({
  platformCode,
  displayId,
  compact = false,
}: {
  platformCode: string;
  displayId: string;
  compact?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderRadius: 6,
        borderWidth: 0.75,
        borderColor: "#cbd5e1",
        backgroundColor: "#ffffff",
        paddingHorizontal: compact ? 7 : 9,
        paddingVertical: compact ? 4 : 5,
      }}
    >
      {platformCode.trim() ? (
        <PdfQrCode value={platformCode.trim()} size={compact ? 34 : 40} />
      ) : (
        <View
          style={{
            width: compact ? 34 : 40,
            height: compact ? 34 : 40,
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
              fontSize: 6,
              fontWeight: 600,
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            EVENT
          </Text>
          <Text
            style={{
              fontSize: 6,
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
            fontSize: 7,
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
            fontSize: 7,
            fontWeight: 600,
            color: "#475569",
          }}
        >
          {displayId}
        </Text>
      </View>
    </View>
  );
}

function FrontFooterBar() {
  return (
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
  );
}

function BadgeThemeBackground({
  themeId,
  isBack = false,
}: {
  themeId: BadgePdfThemeId;
  isBack?: boolean;
}) {
  if (themeId === "1") {
    return <PdfDiagonalBackground />;
  }

  if (themeId === "2") {
    return (
      <Svg
        width={BADGE_PAGE_SIZE[0]}
        height={BADGE_PAGE_SIZE[1]}
        viewBox="0 0 255 340"
        style={styles.fillAbsolute}
      >
        <Path
          d="M0,0 L255,0 L255,66 C185,90 85,48 0,76 Z"
          fill="#eff6ff"
        />
        <Path
          d="M0,0 L255,0 L255,44 C170,66 75,32 0,54 Z"
          fill="#e0f2fe"
        />
        <Path
          d="M0,285 C75,264 165,305 255,278 L255,340 L0,340 Z"
          fill="#bae6fd"
        />
        <Path
          d="M0,302 C85,284 175,318 255,296 L255,340 L0,340 Z"
          fill="#172554"
        />
      </Svg>
    );
  }

  if (themeId === "3") {
    return (
      <Svg
        width={BADGE_PAGE_SIZE[0]}
        height={BADGE_PAGE_SIZE[1]}
        viewBox="0 0 255 340"
        style={styles.fillAbsolute}
      >
        <Polygon points="0,0 24,0 14,340 0,340" fill="#172554" />
        <Polygon points="24,0 30,0 20,340 14,340" fill="#0ea5e9" />
        {!isBack && (
          <Polygon points="195,0 255,0 255,58" fill="#e0f2fe" />
        )}
      </Svg>
    );
  }

  if (themeId === "5") {
    if (isBack) {
      return (
        <Svg
          width={BADGE_PAGE_SIZE[0]}
          height={BADGE_PAGE_SIZE[1]}
          viewBox="0 0 255 340"
          style={styles.fillAbsolute}
        >
          <Rect x={0} y={0} width={255} height={340} fill="#0b1120" />
          {/* Top-left and top-right white curved corner wings */}
          <Path d="M0,0 L76,0 C54,18 42,58 0,68 Z" fill="#ffffff" />
          <Path d="M255,0 L179,0 C201,18 213,58 255,68 Z" fill="#ffffff" />
          {/* Subtle cyan & navy glow accents */}
          <Circle cx={228} cy={260} r={48} fill="#1e3a8a" fillOpacity={0.28} />
          <Circle cx={28} cy={220} r={36} fill="#0284c7" fillOpacity={0.14} />
        </Svg>
      );
    }
    return (
      <Svg
        width={BADGE_PAGE_SIZE[0]}
        height={BADGE_PAGE_SIZE[1]}
        viewBox="0 0 255 340"
        style={styles.fillAbsolute}
      >
        <Rect x={0} y={0} width={255} height={340} fill="#ffffff" />
        {/* Top diagonal dark split */}
        <Path d="M0,0 L255,0 L255,152 C185,112 72,174 0,104 Z" fill="#0b1120" />
        {/* Thin white diagonal highlight line */}
        <Path
          d="M150,0 L255,96"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeOpacity={0.9}
        />
        {/* Bottom-left dark curve */}
        <Path d="M0,225 C42,248 56,296 76,340 L0,340 Z" fill="#0b1120" />
        {/* Right-edge cobalt/navy orb accent */}
        <Circle cx={245} cy={258} r={38} fill="#172554" />
        <Circle cx={245} cy={258} r={24} fill="#1d4ed8" fillOpacity={0.45} />
      </Svg>
    );
  }

  // Theme 4: Curved Dark Event Pass Header
  return (
    <Svg
      width={BADGE_PAGE_SIZE[0]}
      height={BADGE_PAGE_SIZE[1]}
      viewBox="0 0 255 340"
      style={styles.fillAbsolute}
    >
      <Path
        d="M0,0 L255,0 L255,104 Q127.5,134 0,104 Z"
        fill="#172554"
      />
      <Path
        d="M0,98 Q127.5,128 255,98 L255,106 Q127.5,136 0,106 Z"
        fill="#0ea5e9"
      />
      <Polygon points="205,340 255,340 255,294" fill="#e0f2fe" />
    </Svg>
  );
}

function FrontPage({
  themeId,
  info,
  platformCode,
  displayId,
}: {
  themeId: BadgePdfThemeId;
  info: BadgePdfInfo;
  platformCode: string;
  displayId: string;
}) {
  if (themeId === "3") {
    return (
      <Page size={BADGE_PAGE_SIZE} style={styles.page}>
        <BadgeThemeBackground themeId="3" />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View>
            <LanyardPunchHole />
            <View style={{ paddingLeft: 32, paddingRight: 14, paddingTop: 4 }}>
              <View
                style={{
                  borderRadius: 5,
                  borderWidth: 0.75,
                  borderColor: "#e2e8f0",
                  backgroundColor: "#ffffff",
                  padding: 5,
                }}
              >
                <BadgeLogosRow compact />
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: 32,
              paddingRight: 14,
              gap: 8,
            }}
          >
            <PortraitFrame size={68} height={82} />

            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontFamily: "SpaceGrotesk",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {info.name}
              </Text>
              <View
                style={{
                  marginTop: 4,
                  borderLeftWidth: 1.8,
                  borderLeftColor: "#0284c7",
                  paddingLeft: 6,
                }}
              >
                <Text
                  style={{ fontSize: 7.5, fontWeight: 700, color: "#1e293b" }}
                >
                  {info.program}
                </Text>
                <Text
                  style={{
                    marginTop: 1,
                    fontSize: 7.5,
                    fontWeight: 600,
                    color: "#0369a1",
                  }}
                >
                  {info.track}
                </Text>
              </View>
            </View>

            <ForumQrBox
              platformCode={platformCode}
              displayId={displayId}
              compact
            />
          </View>

          <FrontFooterBar />
        </View>
      </Page>
    );
  }

  if (themeId === "4") {
    return (
      <Page size={BADGE_PAGE_SIZE} style={styles.page}>
        <BadgeThemeBackground themeId="4" />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View>
            <LanyardPunchHole light />
            <View style={{ paddingHorizontal: 14, paddingTop: 4 }}>
              <View
                style={{
                  borderRadius: 6,
                  backgroundColor: "#ffffff",
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                }}
              >
                <BadgeLogosRow compact />
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
            }}
          >
            <PortraitFrame circular size={76} />

            <Text
              style={{
                marginTop: 10,
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
                borderRadius: 99,
                borderWidth: 0.75,
                borderColor: "#bae6fd",
                backgroundColor: "#f0f9ff",
                paddingHorizontal: 9,
                paddingVertical: 2.5,
              }}
            >
              <Text
                style={{
                  fontSize: 7.2,
                  fontWeight: 700,
                  color: "#075985",
                  textAlign: "center",
                }}
              >
                {info.program}
              </Text>
            </View>

            <Text
              style={{
                marginTop: 4,
                fontSize: 7.8,
                fontWeight: 600,
                color: "#0369a1",
                textAlign: "center",
              }}
            >
              {info.track}
            </Text>

            <View style={{ marginTop: 9 }}>
              <ForumQrBox
                platformCode={platformCode}
                displayId={displayId}
                compact
              />
            </View>
          </View>

          <FrontFooterBar />
        </View>
      </Page>
    );
  }

  if (themeId === "5") {
    return (
      <Page size={BADGE_PAGE_SIZE} style={styles.page}>
        <BadgeThemeBackground themeId="5" />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={{ position: "relative" }}>
            <LanyardPunchHole light />
            <View
              style={{
                position: "absolute",
                top: 10,
                left: 12,
                borderRadius: 4,
                backgroundColor: "#ffffff",
                paddingHorizontal: 5,
                paddingVertical: 2.5,
              }}
            >
              <Image
                src="/logos/digilians.png"
                style={{ maxHeight: 15, maxWidth: 46, objectFit: "contain" }}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 14,
              paddingTop: 6,
            }}
          >
            {/* Dark thick outer ring + white inner portrait circle */}
            <View
              style={{
                width: 82,
                height: 82,
                borderRadius: 41,
                backgroundColor: "#0b1120",
                padding: 4,
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 37,
                  backgroundColor: "#ffffff",
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
                marginTop: 10,
                fontFamily: "SpaceGrotesk",
                fontSize: 13,
                fontWeight: 700,
                color: "#0f172a",
                textAlign: "center",
              }}
            >
              {info.name}
            </Text>

            <Text
              style={{
                marginTop: 3,
                fontSize: 7.8,
                fontWeight: 700,
                letterSpacing: 0.4,
                color: "#1e293b",
                textAlign: "center",
              }}
            >
              {info.track}
            </Text>

            <Text
              style={{
                marginTop: 2,
                fontSize: 7.2,
                fontWeight: 600,
                color: "#0369a1",
                textAlign: "center",
              }}
            >
              {info.program}
            </Text>

            <View style={{ marginTop: 9 }}>
              <ForumQrBox
                platformCode={platformCode}
                displayId={displayId}
                compact
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              paddingBottom: 10,
            }}
          >
            <Image
              src="/logos/military-academy.png"
              style={{ maxHeight: 20, maxWidth: 40, objectFit: "contain" }}
            />
            <Image
              src="/logos/mcit.png"
              style={{ maxHeight: 16, maxWidth: 54, objectFit: "contain" }}
            />
          </View>
        </View>
      </Page>
    );
  }

  // Theme 1 (Classic) & Theme 2 (Organic Wave)
  return (
    <Page size={BADGE_PAGE_SIZE} style={styles.page}>
      <BadgeThemeBackground themeId={themeId} />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View>
          {themeId === "1" && <View style={styles.navyBar} />}
          <LanyardPunchHole />
          <View style={{ paddingHorizontal: 14, paddingTop: 4 }}>
            <BadgeLogosRow />
            {themeId === "1" && (
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
            )}
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
          <PortraitFrame circular={themeId === "2"} size={70} height={85} />

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

          <View style={{ marginTop: 5, alignItems: "center", gap: 2 }}>
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

          <View style={{ marginTop: 9 }}>
            <ForumQrBox platformCode={platformCode} displayId={displayId} />
          </View>
        </View>

        {themeId === "2" ? (
          <View
            style={{
              paddingBottom: 6,
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
        ) : (
          <FrontFooterBar />
        )}
      </View>
    </Page>
  );
}

function BackPage({
  themeId,
  info,
}: {
  themeId: BadgePdfThemeId;
  info: BadgePdfInfo;
}) {
  if (themeId === "5") {
    return (
      <Page size={BADGE_PAGE_SIZE} style={styles.page}>
        <BadgeThemeBackground themeId="5" isBack />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View>
            <LanyardPunchHole light />
            <View
              style={{
                marginTop: 4,
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {/* Geometric DiGiLiANS Hexagon Mark */}
              <Svg width={44} height={44} viewBox="0 0 100 100">
                <Path
                  d="M50 8 L88 30 L88 70 L50 92 L12 70 L12 30 Z"
                  stroke="#38bdf8"
                  strokeWidth={7}
                  fill="none"
                />
                <Path
                  d="M50 26 L72 39 L72 61 L50 74 L28 61 L28 39 Z"
                  stroke="#0ea5e9"
                  strokeWidth={6}
                  fill="none"
                />
                <Circle cx={50} cy={46} r={5} fill="#38bdf8" />
                <Path d="M50 51 L50 66" stroke="#38bdf8" strokeWidth={4.5} />
              </Svg>
              <Text
                style={{
                  marginTop: 4,
                  fontFamily: "Amiri",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {shapeArabicText("الرواد الرقميون")}
              </Text>
              <Text
                style={{
                  fontFamily: "SpaceGrotesk",
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  color: "#38bdf8",
                }}
              >
                DiGiLiANS
              </Text>
            </View>
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
                backgroundColor: "#ffffff",
                padding: 9,
              }}
            >
              <PdfQrCode value={info.qrUrl} size={90} />
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 7,
                  fontWeight: 700,
                  letterSpacing: 1.1,
                  color: "#0f172a",
                }}
              >
                SCAN ME
              </Text>
              <Text
                style={{
                  marginTop: 1,
                  fontSize: 6.5,
                  fontWeight: 500,
                  color: "#64748b",
                }}
              >
                CV, Projects & vCard
              </Text>
            </View>

            <View
              style={{
                marginTop: 10,
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 7, fontWeight: 600, color: "#e2e8f0" }}>
                {info.phone} • {info.location}
              </Text>
              <Text style={{ fontSize: 7, fontWeight: 500, color: "#94a3b8" }}>
                {info.email}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 9,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderRadius: 5,
                backgroundColor: "#ffffff",
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Image
                src="/logos/military-academy.png"
                style={{ maxHeight: 16, maxWidth: 34, objectFit: "contain" }}
              />
              <Image
                src="/logos/mcit.png"
                style={{ maxHeight: 14, maxWidth: 48, objectFit: "contain" }}
              />
            </View>
          </View>
        </View>
      </Page>
    );
  }

  return (
    <Page size={BADGE_PAGE_SIZE} style={styles.page}>
      <BadgeThemeBackground themeId={themeId} isBack />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View>
          {themeId === "1" && <View style={styles.navyBar} />}
          <LanyardPunchHole light={themeId === "4"} />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: themeId === "3" ? 28 : 14,
            paddingRight: 14,
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

        <View
          style={{
            backgroundColor: themeId === "2" ? "transparent" : "#172554",
            paddingVertical: themeId === "2" ? 6 : 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 7,
              fontWeight: 600,
              letterSpacing: 0.5,
              color: "#ffffff",
            }}
          >
            DiGiLiANS • MCIT • Military Academy • NTI
          </Text>
        </View>
      </View>
    </Page>
  );
}

export function LanyardBadgePdfDocument({
  themeId,
  info,
  platformCode,
  platformIdText,
}: {
  themeId: BadgePdfThemeId;
  info: BadgePdfInfo;
  platformCode: string;
  platformIdText: string;
}) {
  ensurePdfFontsRegistered();
  const displayId =
    platformIdText.trim() ||
    (platformCode.trim() && !platformCode.trim().startsWith("http")
      ? platformCode.trim()
      : "#______");

  return (
    <Document title={`Lanyard Badge — Design ${themeId}`}>
      <FrontPage
        themeId={themeId}
        info={info}
        platformCode={platformCode}
        displayId={displayId}
      />
      <BackPage themeId={themeId} info={info} />
    </Document>
  );
}
