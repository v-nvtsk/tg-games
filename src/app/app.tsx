import { useLayoutEffect, useRef } from "react";
import { type IRefPhaserGame, PhaserGame } from "../games/PhaserGame";
import { useTelegram } from "../hooks/use-telegram";
import { authenticate } from "../api";

export function App() {
  const { webApp } = useTelegram();
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  useLayoutEffect(() => {
    const initAuth = async () => {
      try {
        const token = await authenticate();
        console.log("Authentication successful, token:", token);
      } catch (error) {
        console.error("Authentication failed:", error);
        if (error instanceof Error) {
          webApp.showAlert("Ошибка авторизации. Пожалуйста, попробуйте снова." + error.message);
        }
        else {
          webApp.showAlert("Ошибка авторизации. Пожалуйста, попробуйте снова.");
        }
      }
    };

    if (webApp.initData) {
      void initAuth();
      if (phaserRef.current?.game) {
        phaserRef.current.telegramWebApp = webApp;
      }
    } else {
      console.warn("Telegram initData not available");
    }
  }, [webApp]);

  return <PhaserGame ref={phaserRef}/>;

}

