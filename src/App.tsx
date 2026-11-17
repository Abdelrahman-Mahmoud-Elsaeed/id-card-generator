import { useEffect, useState } from "react";

import {
  LanyardBadgeSheet,
  type BadgeThemeId,
} from "@/components/LanyardBadgeSheet";

function resolveBadgeThemeFromPath(): BadgeThemeId {
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (
    seg === "1" ||
    seg === "2" ||
    seg === "3" ||
    seg === "4" ||
    seg === "5" ||
    seg === "6"
  ) {
    return seg;
  }
  return "1";
}

export function App() {
  const [themeId, setThemeId] = useState<BadgeThemeId>(() =>
    resolveBadgeThemeFromPath()
  );

  useEffect(() => {
    const onPopState = () => setThemeId(resolveBadgeThemeFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function handleSelectTheme(id: BadgeThemeId) {
    window.history.pushState(null, "", `/${id}`);
    setThemeId(id);
  }

  return (
    <LanyardBadgeSheet themeId={themeId} onSelectTheme={handleSelectTheme} />
  );
}

export default App;
