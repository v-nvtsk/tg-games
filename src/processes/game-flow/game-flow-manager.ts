import Phaser from "phaser";
import { gameConfig } from "@core/game-engine/config";
import { useSceneStore, type FoodGameLevelData, type MoveSceneData } from "@core/state";

import { AuthPhaserScene } from "$features/auth-phaser-scene";
import { FoodGamePhaserScene } from "@features/food-game";
import { GameMapPhaserScene } from "@features/game-map";
import { Game2048PhaserScene } from "@features/2048-game";
import { MovePhaserScene } from "@features/move-phaser-scene";

export const GameScene = {
  Auth: "Auth",
  Intro: "Intro",
  GameMap: "GameMap",
  FoodGame: "FoodGame",
  Game2048: "Game2048",
  Move: "MoveScene",
} as const;

export type GameScene = typeof GameScene[keyof typeof GameScene];

class GameFlowManager {
  private game: Phaser.Game | null = null;

  initializeGame(parent: string | HTMLElement) {
    if (!this.game) {
      this.game = new Phaser.Game({
        ...gameConfig,
        parent: parent,
        scene: [
          AuthPhaserScene,
          GameMapPhaserScene,
          MovePhaserScene,
          FoodGamePhaserScene,
          Game2048PhaserScene,
        ],
      });
      console.log("Phaser Game Initialized", this.game);

      this.game.events.on(Phaser.Core.Events.READY, () => {
        console.log("Phaser Game Ready");
      });
    }
  }

  showIntro() {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.stop(GameScene.FoodGame);
      this.game.scene.stop(GameScene.Game2048);
      this.game.scene.start(GameScene.Intro);
      useSceneStore.setState({ currentScene: GameScene.Intro, sceneData: null });
      console.log("Showing Intro Scene");
    }
  }

  startGameMap() {
    if (this.game) {
      this.game.scene.stop(GameScene.Intro);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.stop(GameScene.FoodGame);
      this.game.scene.stop(GameScene.Game2048);
      this.game.scene.start(GameScene.GameMap);
      useSceneStore.setState({ currentScene: GameScene.GameMap, sceneData: null });
      console.log("Starting Game Map Scene");
    }
  }

  showMoveScene(data: MoveSceneData) {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.start(GameScene.Move, data);
      useSceneStore.setState({ currentScene: GameScene.Move, sceneData: data });
      console.log("Showing Move Scene with data:", data);
    }
  }

  showFoodGame(data: FoodGameLevelData) {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.start(GameScene.FoodGame, data);
      useSceneStore.setState({ currentScene: GameScene.FoodGame, sceneData: data });
      console.log("Starting Food Game Scene with data:", data);
    }
  }

  showGame2048() {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.start(GameScene.Game2048);
      useSceneStore.setState({ currentScene: GameScene.Game2048, sceneData: null });
      console.log("Starting 2048 Game Scene");
    }
  }
}

export const gameFlowManager = new GameFlowManager();
