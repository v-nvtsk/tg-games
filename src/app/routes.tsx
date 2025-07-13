import { Route, Routes, useNavigate } from "react-router-dom";
import { MainMenu } from "./components/main-menu";
import { Layout } from "./layout";
import { Game2048 } from "../games/2048/main";
import { FoodGame } from "../games/food";
import { ROUTES } from "../constants/routes";
import PhaserApp from "../games/phaser/phaser-app";

export const AppRouter = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<MainMenu onStartGame={(value) => void navigate(`${ROUTES.GAMES}/${value}`)} />} />
      <Route
        path={ROUTES.GAME_2048}
        element={
          <Layout gameName="2048">
            <Game2048 />
          </Layout>
        }
      />
      <Route
        path={ROUTES.GAME_FOOD}
        element={
          <Layout gameName="Кулинарный квест">
            <FoodGame />
          </Layout>
        }
      />
      <Route
        path={ROUTES.PHASER_TEMP}
        element={
          <Layout gameName="Кулинарный квест">
            <PhaserApp />
          </Layout>
        }
      />
    </Routes>
  );
};
