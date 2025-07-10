import WebApp from "@twa-dev/sdk";
import { use, useEffect } from "react";
import styles from "./theme.module.css";
import { ThemeContext } from "../../context/theme-context";

export function useTheme() {
  const { theme } = use(ThemeContext);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.disableVerticalSwipes();
    WebApp.setHeaderColor("bg_color");

    if (theme === "dark") {
      document.body.classList.add(styles.darkTheme);
    } else {
      document.body.classList.remove(styles.darkTheme);
    }

    const handleThemeChanged = () => {
      const newTheme = WebApp.colorScheme === "dark" ? "dark" : "light";
      if (newTheme !== theme) {
        document.body.classList.toggle(styles.darkTheme, newTheme === "dark");
      }
    };

    WebApp.onEvent("themeChanged", handleThemeChanged);

    return () => {
      document.body.classList.remove(styles.darkTheme);
      WebApp.offEvent("themeChanged", handleThemeChanged);
    };
  }, [theme]);
}
