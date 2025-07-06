import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { Game2048 } from "./2048/main";
import styles from "./app.module.css";

export const App = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.disableVerticalSwipes();

    WebApp.setHeaderColor("bg_color");

    if (WebApp.colorScheme === "dark") {
      document.body.classList.add(styles.darkTheme);
    } else {
      document.body.classList.remove(styles.darkTheme);
    }

    const handleThemeChanged = () => {
      if (WebApp.colorScheme === "dark") {
        document.body.classList.add(styles.darkTheme);
      } else {
        document.body.classList.remove(styles.darkTheme);
      }
    };

    WebApp.onEvent("themeChanged", handleThemeChanged);

    return () => {
      document.body.classList.remove(styles.darkTheme);
      WebApp.offEvent("themeChanged", handleThemeChanged);
    };
  }, []);
  return <Game2048 />;
};
