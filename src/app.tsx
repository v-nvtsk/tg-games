import React, { useEffect, useLayoutEffect, useRef } from "react";
import "./global.css";
import { gameFlowManager, GameScene } from "./processes/game-flow/game-flow-manager";
import { useSceneStore } from "./core/state/scene-store";
import { IntroSceneWrapper, GameMapSceneWrapper, FoodGameSceneWrapper, Game2048SceneWrapper, MoveSceneWrapper } from "./ui/scenes";
import { useAuth, useTelegram } from "./core/hooks";

export const App: React.FC = () => {
  const { webApp } = useTelegram();

  const phaserCanvasRef = useRef<HTMLDivElement>(null);
  const currentScene = useSceneStore((state) => state.currentScene);
  const token = useAuth();

  useLayoutEffect(() => {
    const initAuth = () => {
      try {
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
  }, [token, webApp]);

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
      return <FoodGameSceneWrapper />;
    case GameScene.Game2048:
      return <Game2048SceneWrapper />;
    case GameScene.Move:
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
