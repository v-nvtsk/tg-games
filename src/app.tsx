import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { Game2048 } from "./2048/main";

export const App = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.disableVerticalSwipes();

    document.body.style.backgroundColor = WebApp.themeParams.bg_color || "#ffffff";
    WebApp.setHeaderColor("bg_color");

    if (WebApp.colorScheme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    const handleThemeChanged = () => {
      document.body.style.backgroundColor = WebApp.themeParams.bg_color || "#ffffff";
      if (WebApp.colorScheme === "dark") {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    };

    WebApp.onEvent("themeChanged", handleThemeChanged);

    return () => {
      document.body.classList.remove("dark-theme");
      WebApp.offEvent("themeChanged", handleThemeChanged);
    };
  }, []);

  return <Game2048 />;
};
