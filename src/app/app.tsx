import { useEffect } from "react";
import { authenticate } from "../api";
import { useTelegram } from "./hooks/use-telegram/use-telegram";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Game2048 } from "../games/2048/main";
import { FoodGame } from "../games/food";
import { MainMenu } from "./components/main-menu";
import { Layout } from "./layout";

export const App = () => {
  const navigate = useNavigate();
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
  return (
    <Routes>
      <Route path="/" element={<MainMenu onStartGame={(value) => void navigate(`game/${value}`)} />} />
      <Route
        path="/game/2048"
        element={
          <Layout gameName="2048">
            <Game2048 />
          </Layout>
        }
      />
      <Route
        path="/game/food"
        element={
          <Layout gameName="Кулинарный квест">
            <FoodGame />
          </Layout>
        }
      />
    </Routes>
  );
};
