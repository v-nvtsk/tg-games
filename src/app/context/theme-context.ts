import { createContext } from "react";
import type { ThemeContextType } from "./theme-provider";
const defaultContext: ThemeContextType = {
  theme: "light",
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);
