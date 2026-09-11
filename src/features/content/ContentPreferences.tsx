import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
const preferenceKey = "spawnbrief-show-explicit-sexual-content";
type ContentPreferences = { showExplicit: boolean; setShowExplicit: (show: boolean) => void };
const Context = createContext<ContentPreferences | null>(null);
export function ContentPreferencesProvider({ children }: { children: ReactNode }) {
  const [showExplicit, setShowExplicit] = useState(() => {
    try {
      return localStorage.getItem(preferenceKey) === "true";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(preferenceKey, String(showExplicit));
    } catch {
      /* Session preference still works. */
    }
  }, [showExplicit]);
  const value = useMemo(() => ({ showExplicit, setShowExplicit }), [showExplicit]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useContentPreferences() {
  const value = useContext(Context);
  if (!value) throw new Error("ContentPreferencesProvider is required");
  return value;
}
