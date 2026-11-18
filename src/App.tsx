import { useEffect, useState } from "react";
import { BadgeCheck, CreditCard, IdCard } from "lucide-react";

import { IdCardSheet, type CardThemeId } from "@/components/IdCardSheet";
import {
  LanyardBadgeSheet,
  type BadgeThemeId,
} from "@/components/LanyardBadgeSheet";
import {
  PersonalCardSheet,
  type PersonalCardThemeId,
} from "@/components/PersonalCardSheet";
import { cn } from "@/lib/utils";

type BuilderMode = "id" | "personal" | "badge";

interface RouteState {
  mode: BuilderMode;
  themeId: string;
}

function isCardTheme(v: string | undefined): v is CardThemeId {
  return v === "1" || v === "2" || v === "3" || v === "4" || v === "5";
}

function isBadgeTheme(v: string | undefined): v is BadgeThemeId {
  return (
    v === "1" || v === "2" || v === "3" || v === "4" || v === "5" || v === "6"
  );
}

function resolveRouteFromPath(): RouteState {
  const parts = window.location.pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  if (parts[0] === "personal") {
    return {
      mode: "personal",
      themeId: isCardTheme(parts[1]) ? parts[1] : "1",
    };
  }
  if (parts[0] === "badge") {
    return {
      mode: "badge",
      themeId: isBadgeTheme(parts[1]) ? parts[1] : "1",
    };
  }
  if (parts[0] === "id") {
    return {
      mode: "id",
      themeId: isCardTheme(parts[1]) ? parts[1] : "1",
    };
  }

  return {
    mode: "id",
    themeId: isCardTheme(parts[0]) ? parts[0] : "1",
  };
}

export function App() {
  const [route, setRoute] = useState<RouteState>(() => resolveRouteFromPath());

  useEffect(() => {
    const onPopState = () => setRoute(resolveRouteFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(mode: BuilderMode, themeId: string) {
    const nextPath = mode === "id" ? `/${themeId}` : `/${mode}/${themeId}`;
    window.history.pushState(null, "", nextPath);
    setRoute({ mode, themeId });
  }

  const tabs: { id: BuilderMode; label: string; icon: typeof IdCard }[] = [
    { id: "id", label: "ID Card Builder", icon: IdCard },
    { id: "personal", label: "Personal Card Builder", icon: CreditCard },
    { id: "badge", label: "Badge Builder", icon: BadgeCheck },
  ];

  return (
    <div className="min-h-dvh bg-slate-100 print:bg-white">
      {/* Unified Collection Mode Switcher */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm print:hidden">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <span className="font-heading text-sm font-bold tracking-tight text-slate-900">
            DiGiLiANS Card &amp; Badge Studio
          </span>

          <nav
            aria-label="Builder mode"
            className="flex flex-wrap items-center gap-1.5"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = route.mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(tab.id, "1")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                    active
                      ? "border-[#172554] bg-[#172554] text-white shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {route.mode === "id" && (
        <IdCardSheet
          themeId={
            isCardTheme(route.themeId) ? route.themeId : ("1" as CardThemeId)
          }
          onSelectTheme={(id) => navigate("id", id)}
        />
      )}

      {route.mode === "personal" && (
        <PersonalCardSheet
          themeId={
            isCardTheme(route.themeId)
              ? (route.themeId as PersonalCardThemeId)
              : "1"
          }
          onSelectTheme={(id) => navigate("personal", id)}
        />
      )}

      {route.mode === "badge" && (
        <LanyardBadgeSheet
          themeId={
            isBadgeTheme(route.themeId)
              ? (route.themeId as BadgeThemeId)
              : "1"
          }
          onSelectTheme={(id) => navigate("badge", id)}
        />
      )}
    </div>
  );
}

export default App;
