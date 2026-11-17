import { useEffect, useState } from "react";

import { IdCardSheet, type CardThemeId } from "@/components/IdCardSheet";

function resolveThemeFromPath(): CardThemeId {
  const seg = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (seg === "1" || seg === "2" || seg === "3" || seg === "4" || seg === "5") {
    return seg;
  }
  return "1";
}

export function App() {
  const [themeId, setThemeId] = useState<CardThemeId>(() => resolveThemeFromPath());

  useEffect(() => {
    const onPopState = () => setThemeId(resolveThemeFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function handleSelectTheme(id: CardThemeId) {
    window.history.pushState(null, "", `/${id}`);
    setThemeId(id);
  }

  return <IdCardSheet themeId={themeId} onSelectTheme={handleSelectTheme} />;
}

export default App;
