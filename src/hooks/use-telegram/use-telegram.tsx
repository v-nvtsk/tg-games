import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export const useTelegram = () => {
  // Метод showConfirm с поддержкой Promise
  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      WebApp.showConfirm(message, (confirmed) => {
        resolve(confirmed);
      });
    });
  };

  // Показ алерта
  const showAlert = (message: string) => {
    WebApp.showAlert(message);
  };

  // Открытие ссылки
  const openLink = (url: string) => {
    WebApp.openLink(url);
  };

  // Получение данных пользователя
  const user = WebApp.initDataUnsafe.user || null;

  // Подписка на изменение темы
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.disableVerticalSwipes();

    WebApp.setHeaderColor("bg_color");

    const handleThemeChange = () => {
      document.body.classList.toggle("dark", WebApp.colorScheme === "dark");
    };

    WebApp.onEvent("themeChanged", handleThemeChange);

    return () => {
      WebApp.offEvent("themeChanged", handleThemeChange);
    };
  }, []);

  return {
    webApp: WebApp,
    theme: WebApp.colorScheme,
    isDarkMode: WebApp.colorScheme === "dark",
    user,
    showConfirm,
    showAlert,
    openLink,
  };
};
