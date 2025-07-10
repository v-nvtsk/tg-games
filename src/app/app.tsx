import { Routes, Route, useNavigate } from "react-router-dom";
import { MainMenu } from "./components/main-menu";
import { Game2048 } from "../games/2048/main";
import { FoodGame } from "../games/food/main";
import { Layout } from "./layout";

export const App = () => {
  const navigate = useNavigate();

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
