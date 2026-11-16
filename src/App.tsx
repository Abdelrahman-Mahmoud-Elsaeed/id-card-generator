import { useEffect, useState } from "react";

import { IdCardSheet, type CardThemeId } from "@/components/IdCardSheet";
import { LanyardBadgeSheet } from "@/components/LanyardBadgeSheet";

type ActiveRoute = CardThemeId | "badge";

function resolveRouteFromPath(): ActiveRoute {
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (seg === "badge") return "badge";
  if (seg === "1" || seg === "2" || seg === "3" || seg === "4" || seg === "5") {
    return seg;
  }
  return "1";
}

export function App() {
  const [route, setRoute] = useState<ActiveRoute>(() => resolveRouteFromPath());

  useEffect(() => {
    const onPopState = () => setRoute(resolveRouteFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function handleSelectTheme(id: CardThemeId) {
    window.history.pushState(null, "", `/${id}`);
    setRoute(id);
  }

  function handleSelectBadge() {
    window.history.pushState(null, "", "/badge");
    setRoute("badge");
  }

  if (route === "badge") {
    return (
      <LanyardBadgeSheet
        onSelectTheme={handleSelectTheme}
        onSelectBadge={handleSelectBadge}
      />
    );
  }

  return (
    <IdCardSheet
      themeId={route}
      onSelectTheme={handleSelectTheme}
      onSelectBadge={handleSelectBadge}
    />
  );
}

export default App;
