import React, { useEffect, useLayoutEffect, useRef } from "react";
import "./global.css";
import { gameFlowManager } from "./processes/game-flow/game-flow-manager";
import { useSceneState } from "./core/state/scene-store";
import { GameScene } from "./processes/game-flow/game-flow-manager"; // Убедитесь, что GameScene импортирован
import { IntroSceneWrapper, GameMapSceneWrapper, FoodGameSceneWrapper, Game2048SceneWrapper, MoveSceneWrapper } from "./ui/scenes";
import { useTelegram } from "./core/hooks";
import { authenticate } from "./api";

export const App: React.FC = () => {
  const { webApp } = useTelegram();

  const phaserCanvasRef = useRef<HTMLDivElement>(null);
  const currentScene = useSceneState((state) => state.currentScene);

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
    } else {
      console.warn("Telegram initData not available");
    }
  }, [webApp]);

  useEffect(() => {
    if (phaserCanvasRef.current) {
      gameFlowManager.initializeGame(phaserCanvasRef.current.id);
      gameFlowManager.showIntro();
    }
  }, []);

  const renderSceneWrapper = () => {
    switch (currentScene) {
    case GameScene.Intro:
      return <IntroSceneWrapper />;
    case GameScene.GameMap:
      return <GameMapSceneWrapper />;
    case GameScene.FoodGame:
      // sceneData теперь SceneDataPayload | null, поэтому передаем как есть
      return <FoodGameSceneWrapper />;
    case GameScene.Game2048:
      return <Game2048SceneWrapper />;
    case GameScene.Move: // Добавляем рендеринг для MoveScene
      return <MoveSceneWrapper />;
    default:
      return null;
    }
  };

  return (
    <div
      id="game-container"
      ref={phaserCanvasRef}
      className="relative w-full h-full overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {renderSceneWrapper()}
    </div>
  );
};
