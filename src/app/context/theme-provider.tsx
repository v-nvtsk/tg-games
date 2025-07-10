import { useMemo, useState, type ReactNode } from "react";
import { useTelegram } from "../hooks/use-telegram/use-telegram";
import { ThemeContext } from "./theme-context";

type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { webApp } = useTelegram();
  const [theme] = useState<Theme>(
    webApp?.colorScheme === "dark" ? "dark" : "light",
  );

  const contextValue = useMemo(() => ({ theme }), [theme]);

  return (
    <ThemeContext value={contextValue}>
      <div className={theme}>{children}</div>
    </ThemeContext>
  );
};
