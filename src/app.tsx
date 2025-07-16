import React, { useEffect, useRef } from "react";
import "./global.css";
import { gameFlowManager } from "./processes/game-flow/game-flow-manager";
import { useSceneState } from "./core/state/scene-store";
import { GameScene } from "./processes/game-flow/game-flow-manager"; // Убедитесь, что GameScene импортирован
import { IntroSceneWrapper, GameMapSceneWrapper, FoodGameSceneWrapper, Game2048SceneWrapper, MoveSceneWrapper } from "./ui/scenes";

export const App: React.FC = () => {
  const phaserCanvasRef = useRef<HTMLDivElement>(null);
  const currentScene = useSceneState((state) => state.currentScene);
  // sceneData теперь уже типизирована как SceneDataPayload | null из scene-store.ts
  // const sceneData = useSceneState((state) => state.sceneData);

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
