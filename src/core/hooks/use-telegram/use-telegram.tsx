import { useLayoutEffect } from "react";
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
  useLayoutEffect(() => {
    if (WebApp.initData) {
      WebApp.ready();
      WebApp.expand();
      WebApp.disableVerticalSwipes();
      WebApp.lockOrientation();
      WebApp.setHeaderColor("bg_color");
      WebApp.requestFullscreen();
      WebApp.SettingsButton.hide();
      WebApp.enableClosingConfirmation();
    }

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
