import Phaser from "phaser";
import { gameConfig } from "@core/game-engine/config";
import { GameScene, useSceneStore, type GameFoodLevelData, type MoveSceneData } from "@core/state";

import { AuthPhaserScene } from "$features/auth-phaser-scene";
import { GameFoodPhaserScene } from "$features/game-food";
import { GameMapPhaserScene } from "@features/game-map";
import { Game2048PhaserScene } from "$features/game-2048";
import { MovePhaserScene } from "@features/move-phaser-scene";
import { IntroPhaserScene } from "@features/intro-phaser-scene";
import { FlyingGameScene } from "@features/flying-game/flying-game-scene";

class GameFlowManager {
  private game: Phaser.Game | null = null;

  initializeGame(parent: string | HTMLElement) {
    if (!this.game) {
      this.game = new Phaser.Game({
        ...gameConfig,
        parent: parent,
        scene: [
          AuthPhaserScene,
          IntroPhaserScene,
          GameMapPhaserScene,
          MovePhaserScene,
          GameFoodPhaserScene,
          Game2048PhaserScene,
          FlyingGameScene,
        ],
      });
      console.log("Phaser Game Initialized", this.game);

      this.game.events.on(Phaser.Core.Events.READY, () => {
        console.log("Phaser Game Ready");
      });
    }
  }

  showAuth() {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.stop(GameScene.GameFood);
      this.game.scene.stop(GameScene.Game2048);
      this.game.scene.stop(GameScene.Intro);
      this.game.scene.start(GameScene.Auth);
      useSceneStore.setState({ currentScene: GameScene.Auth,
        sceneData: null });
      console.log("Showing Auth Scene");
    }
  }

  showIntro() {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.stop(GameScene.GameFood);
      this.game.scene.stop(GameScene.Game2048);
      this.game.scene.stop(GameScene.Auth);
      this.game.scene.start(GameScene.Intro);
      useSceneStore.setState({ currentScene: GameScene.Intro,
        sceneData: null });
      console.log("Showing Intro Scene");
    }
  }

  startGameMap() {
    if (this.game) {
      this.game.scene.stop(GameScene.Intro);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.stop(GameScene.GameFood);
      this.game.scene.stop(GameScene.Game2048);
      this.game.scene.stop(GameScene.Intro);
      this.game.scene.start(GameScene.GameMap);
      useSceneStore.setState({ currentScene: GameScene.GameMap,
        sceneData: null });
      console.log("Starting Game Map Scene");
    }
  }

  showMoveScene(data: MoveSceneData) {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.start(GameScene.Move, data);
      useSceneStore.setState({ currentScene: GameScene.Move,
        sceneData: data });
      console.log("Showing Move Scene with data:", data);
    }
  }

  showGameFood(data: GameFoodLevelData) {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.start(GameScene.GameFood, data);
      useSceneStore.setState({ currentScene: GameScene.GameFood,
        sceneData: data });
      console.log("Starting Food Game Scene with data:", data);
    }
  }

  showGame2048() {
    if (this.game) {
      this.game.scene.stop(GameScene.GameMap);
      this.game.scene.stop(GameScene.Move);
      this.game.scene.start(GameScene.Game2048);
      useSceneStore.setState({ currentScene: GameScene.Game2048,
        sceneData: null });
      console.log("Starting 2048 Game Scene");
    }
  }

  public showFlyingGame() {
    if (this.game) {
      this.game.scene.start(GameScene.FlyingGame);
    }
  }
}

export const gameFlowManager = new GameFlowManager();
