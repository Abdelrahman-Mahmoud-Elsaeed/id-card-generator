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

export type BadgePdfThemeId = "1" | "2" | "3" | "4" | "5" | "6";

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
        {/* Exact circle centered at (127.5, 88) with r=54 + straight tangent band (slope dx/dy=0.86) */}
        <Polygon
          points="0,0 123,0 168.4,52.8 86.6,123.2 0,22.5"
          fill="#0b1120"
        />
        <Circle cx={127.5} cy={88} r={54} fill="#0b1120" />
        {/* Top-right triangle with parallel edge (dx/dy≈0.86) & rounded inner corners */}
        <Path
          d="M163,0 L255,0 L255,107 Q255,114 249,107 L159,4 Q156,0 163,0 Z"
          fill="#0b1120"
        />
        {/* Bottom-left accent with parallel edge (dx/dy=0.86) */}
        <Path
          d="M0,38.5 L42,87.3 Q48,94 43,104 C32,132 18,160 0,185 Z"
          fill="#0b1120"
        />
        {/* Bottom-left lower dark wave */}
        <Path d="M0,248 C34,268 48,304 62,340 L0,340 Z" fill="#0b1120" />
        {/* Right-edge cobalt/navy orb accent */}
        <Circle cx={244} cy={256} r={38} fill="#172554" />
        <Circle cx={244} cy={256} r={24} fill="#1d4ed8" fillOpacity={0.45} />
      </Svg>
    );
  }

  if (themeId === "6") {
    return (
      <Svg
        width={BADGE_PAGE_SIZE[0]}
        height={BADGE_PAGE_SIZE[1]}
        viewBox="0 0 255 340"
        style={styles.fillAbsolute}
      >
        <Rect x={0} y={0} width={255} height={340} fill="#ffffff" />
        {/* Top-right sweeping navy + cobalt ribbon */}
        <Path
          d="M148,0 L255,0 L255,112 C226,80 194,26 148,0 Z"
          fill="#0b152c"
        />
        <Path
          d="M170,0 C206,24 232,66 255,92 L255,70 C235,48 214,18 192,0 Z"
          fill="#1e40af"
        />
        <Path
          d="M148,0 C194,26 226,80 255,112"
          stroke="#c8a45d"
          strokeWidth={1.4}
          fill="none"
        />

        {/* Left-side curved dark navy ribbon with inner gold contour */}
        <Path
          d="M0,40 C26,66 44,96 38,128 C34,148 16,170 0,192 Z"
          fill="#0b152c"
        />
        <Path
          d="M0,54 C18,74 30,98 25,124 C21,140 10,156 0,170"
          stroke="#c8a45d"
          strokeWidth={1.1}
          fill="none"
        />
        <Path
          d="M0,40 C26,66 44,96 38,128 C34,148 16,170 0,192"
          stroke="#c8a45d"
          strokeWidth={1.2}
          fill="none"
        />

        {/* Main sweeping S-wave ribbon across middle */}
        {!isBack && (
          <>
            <Path
              d="M0,168 C48,124 102,168 158,148 C202,132 234,98 255,58 L255,134 C214,184 162,196 108,180 C64,168 28,190 0,234 Z"
              fill="#0b152c"
            />
            <Path
              d="M0,186 C48,148 100,172 158,154 C202,140 232,114 255,78 L255,100 C228,136 192,160 148,164 C96,168 48,156 0,198 Z"
              fill="#1e40af"
              fillOpacity={0.85}
            />
            <Path
              d="M0,168 C48,124 102,168 158,148 C202,132 234,98 255,58"
              stroke="#c8a45d"
              strokeWidth={1.4}
              fill="none"
            />
            <Path
              d="M0,234 C28,190 64,168 108,180 C162,196 214,184 255,134"
              stroke="#c8a45d"
              strokeWidth={1.5}
              fill="none"
            />
            {/* Right-edge double-ring cobalt/navy orb */}
            <Circle cx={240} cy={246} r={34} fill="#0f1e42" />
            <Circle cx={240} cy={246} r={21} fill="#1e3a8a" />
          </>
        )}

        {/* Bottom-left navy & gold wave */}
        <Path
          d="M0,264 C28,278 52,306 72,340 L0,340 Z"
          fill="#0b152c"
        />
        <Path
          d="M0,276 C22,290 40,314 54,340 L34,340 C22,318 10,302 0,292 Z"
          fill="#1d4ed8"
          fillOpacity={0.75}
        />
        <Path
          d="M0,264 C28,278 52,306 72,340"
          stroke="#c8a45d"
          strokeWidth={1.3}
          fill="none"
        />
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
            <Image
              src="/logos/digilians-white.png"
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                maxHeight: 24,
                maxWidth: 40,
                objectFit: "contain",
              }}
            />
          </View>

          {/* Portrait locked to exact circle center (127.5, 88) with diameter 92 */}
          <View
            style={{
              position: "absolute",
              top: 42,
              left: 81.5,
              width: 92,
              height: 92,
              borderRadius: 46,
              backgroundColor: "#ffffff",
              overflow: "hidden",
            }}
          >
            <Image
              src="/me.png"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingHorizontal: 14,
              paddingBottom: 6,
            }}
          >

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

  if (themeId === "6") {
    return (
      <Page size={BADGE_PAGE_SIZE} style={styles.page}>
        <BadgeThemeBackground themeId="6" />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top-left DiGiLiANS + Arabic + Gold-rimmed punch hole */}
          <View style={{ position: "relative" }}>
            <View
              style={{
                alignItems: "center",
                paddingTop: 6,
                paddingBottom: 3,
              }}
            >
              <View
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 4.5,
                  borderWidth: 1.4,
                  borderColor: "#c8a45d",
                  backgroundColor: "#f8fafc",
                }}
              />
            </View>
            <View
              style={{
                position: "absolute",
                top: 7,
                left: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Image
                src="/logos/digilians.png"
                style={{ maxHeight: 20, maxWidth: 42, objectFit: "contain" }}
              />
              <Text
                style={{
                  fontFamily: "Amiri",
                  fontSize: 7.5,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {shapeArabicText("الرواد الرقميون")}
              </Text>
            </View>
          </View>

          {/* Luxury Navy + Concentric Double Gold Rings around Portrait */}
          <View
            style={{
              position: "absolute",
              top: 42.5,
              left: 77.75,
              width: 99.5,
              height: 99.5,
              borderRadius: 49.75,
              backgroundColor: "#0b152c",
              padding: 5,
              borderWidth: 1.4,
              borderColor: "#c8a45d",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 44.75,
                borderWidth: 1.4,
                borderColor: "#c8a45d",
                padding: 5,
                backgroundColor: "#0b152c",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: "#d4af37",
                  overflow: "hidden",
                  backgroundColor: "#132444",
                }}
              >
                <Image
                  src="/me.png"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingHorizontal: 14,
              paddingBottom: 6,
            }}
          >
            <Text
              style={{
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
                fontSize: 7.6,
                fontWeight: 700,
                letterSpacing: 0.4,
                color: "#0b152c",
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
                color: "#b08a42",
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
              gap: 10,
              paddingBottom: 10,
            }}
          >
            <Image
              src="/logos/military-academy.png"
              style={{ maxHeight: 19, maxWidth: 38, objectFit: "contain" }}
            />
            <View
              style={{ width: 0.75, height: 14, backgroundColor: "#cbd5e1" }}
            />
            <Image
              src="/logos/mcit.png"
              style={{ maxHeight: 15, maxWidth: 52, objectFit: "contain" }}
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
  if (themeId === "6") {
    return (
      <Page size={BADGE_PAGE_SIZE} style={styles.page}>
        <BadgeThemeBackground themeId="6" isBack />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 6 }}>
            <View
              style={{
                width: 9,
                height: 9,
                borderRadius: 4.5,
                borderWidth: 1.4,
                borderColor: "#c8a45d",
                backgroundColor: "#f8fafc",
              }}
            />
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
                borderWidth: 1.1,
                borderColor: "#c8a45d",
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
                  color: "#0b152c",
                }}
              >
                SCAN ME
              </Text>
              <Text
                style={{
                  marginTop: 1.5,
                  fontSize: 7,
                  fontWeight: 600,
                  color: "#b08a42",
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
              <Text style={{ fontSize: 7.5, fontWeight: 600, color: "#0f172a" }}>
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
              backgroundColor: "#0b152c",
              borderTopWidth: 1.2,
              borderTopColor: "#c8a45d",
              paddingVertical: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 7,
                fontWeight: 600,
                letterSpacing: 0.5,
                color: "#f8fafc",
              }}
            >
              DiGiLiANS • MCIT • Military Academy • NTI
            </Text>
          </View>
        </View>
      </Page>
    );
  }

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
          <View style={{ alignItems: "center" }}>
            <LanyardPunchHole light />
            <Image
              src="/logos/digilians-white.png"
              style={{
                marginTop: 4,
                maxHeight: 50,
                maxWidth: 88,
                objectFit: "contain",
              }}
            />
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
