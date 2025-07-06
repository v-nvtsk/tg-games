import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { Game2048 } from "./2048/main";

export const App = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.disableVerticalSwipes();
  }, []);

  return <Game2048 />;
};
