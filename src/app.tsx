import React, { useCallback, useEffect, useRef } from "react";
import "./global.css";
import { gameFlowManager } from "./processes/game-flow/game-flow-manager";
import { useSceneStore } from "./core/state/scene-store";
import { IntroSceneWrapper, AuthSceneWrapper, GameMapSceneWrapper, GameFoodSceneWrapper, Game2048SceneWrapper, MoveSceneWrapper } from "./ui/scenes";
import { useAuth } from "./core/hooks";
import { FlyingGameSceneWrapper } from "./ui/scenes/flying-game-scene-wrapper";
import { GameScene } from "@core/types/common-types";

export const App: React.FC = () => {
  useAuth();

  const phaserCanvasRef = useRef<HTMLDivElement>(null);
  const currentScene = useSceneStore((state) => state.currentScene);

  useEffect(() => {
    if (phaserCanvasRef.current) {
      gameFlowManager.initializeGame(phaserCanvasRef.current.id);
      gameFlowManager.showAuth();
    }
  }, []);

  const renderSceneWrapper = useCallback(() => {
    switch (currentScene) {
    case GameScene.Auth:
      return <AuthSceneWrapper />;
    case GameScene.Intro:
      return <IntroSceneWrapper />;
    case GameScene.GameMap:
      return <GameMapSceneWrapper />;
    case GameScene.GameFood:
      return <GameFoodSceneWrapper />;
    case GameScene.Game2048:
      return <Game2048SceneWrapper />;
    case GameScene.Move:
      return <MoveSceneWrapper />;
    case GameScene.FlyingGame:
      return <FlyingGameSceneWrapper />;
    default:
      return null;
    }
  }, [currentScene]);

  return (
    <div id="game-container" ref={phaserCanvasRef}>
      {renderSceneWrapper()}
    </div>
  );
};
