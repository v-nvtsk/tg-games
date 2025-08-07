import React, { useCallback, useEffect, useRef } from "react";
import "./global.css";
import { gameFlowManager } from "./processes/game-flow/game-flow-manager";
import { useSceneStore } from "./core/state/scene-store";
import { initDebugStores } from "./utils/debug-stores";
import {
  IntroSceneWrapper,
  AuthSceneWrapper,
  GameMapSceneWrapper,
  GameFoodSceneWrapper,
  Game2048SceneWrapper,
  MoveSceneWrapper,
  DetectiveGameSceneWrapper,
  RailwayStationSceneWrapper,
  CookingGameSceneWrapper,
} from "./ui/scenes";
import { useAuth } from "./core/hooks";
import { FlyingGameSceneWrapper } from "./ui/scenes/flying-game-scene-wrapper";
import { GameScene } from "@core/types/common-types";
import { MoveToTrainSceneWrapper } from "./ui/scenes/move-to-train-scene-wrapper";
import { Layout } from "./ui/layout/";

export const App: React.FC = () => {
  useAuth();
  const phaserCanvasRef = useRef<HTMLDivElement>(null);
  const currentScene = useSceneStore((state) => state.currentScene);

  useEffect(() => {
    if (phaserCanvasRef.current) {
      void gameFlowManager.initializeGame(phaserCanvasRef.current.id);
    }
    
    // Инициализация инструментов отладки
    initDebugStores();
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
    case GameScene.MoveToTrain:
      return <MoveToTrainSceneWrapper />;
    case GameScene.DetectiveGame:
      return <DetectiveGameSceneWrapper />;
    case GameScene.RailwayStation:
      return <RailwayStationSceneWrapper />;
    case GameScene.CookingGame:
      return <CookingGameSceneWrapper />;
    default:
      return null;
    }
  }, [currentScene]);

  const scene = renderSceneWrapper();

  return (
    <div id="game-container" ref={phaserCanvasRef}>
      {/* ✅ Оборачиваем сцену в Layout, кроме Auth */}
      {currentScene === GameScene.Auth ? scene : <Layout>{scene}</Layout>}
    </div>
  );
};
