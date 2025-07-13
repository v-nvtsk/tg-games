import { useEffect } from "react";
import { authenticate } from "../api";
import { useTelegram } from "./hooks/use-telegram/use-telegram";
import { AppRouter } from "./routes";

export const App = () => {
  const { webApp } = useTelegram();

  // Выполняем аутентификацию при загрузке приложения
  useEffect(() => {
    const initAuth = async () => {
      try {

        const token = await authenticate();
        console.log("Authentication successful, token:", token);
        // Здесь можно сохранить токен в контекст или хранилище
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
    } else {
      console.warn("Telegram initData not available");
    }
  }, [webApp]);
  return (<AppRouter/>
  );
};
