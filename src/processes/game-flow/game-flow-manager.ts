import Phaser from "phaser";
import { gameConfig } from "@core/game-engine/config";
import { useSceneStore } from "@core/state";

import { AuthPhaserScene } from "$features/auth-phaser-scene";
import { GameFoodPhaserScene } from "$features/game-food";
import { GameMapPhaserScene } from "@features/game-map";
import { Game2048PhaserScene } from "$features/game-2048";
import { MovePhaserScene } from "@features/move-phaser-scene";
import { FlyingGameScene } from "@features/flying-game/flying-game-scene";
import { type MoveSceneData, type GameFoodLevelData, GameScene } from "@core/types/common-types";
import { getAssetsPath, getAssetsPathByType } from "$utils/get-assets-path";

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

  private stopActiveScenes(){
    Object.values(GameScene).forEach((scene) => {
      if (this.game && this.game.scene.isActive(scene))
        this.game.scene.stop(scene);
    });
  }

  showAuth() {
    if (this.game) {
      useSceneStore.setState({
        currentScene: GameScene.Auth,
        sceneData: null,
      });
      console.log("Showing Auth Scene");
    }
  }

  showIntro(episodeNumber = 0) {
    if (this.game) {
      // this.stopActiveScenes();

      useSceneStore.setState({
        currentScene: GameScene.Intro,
        sceneData: { episodeNumber },
      });
      console.log("Showing Intro Scene");
    }
  }

  startGameMap() {
    if (this.game) {
      this.stopActiveScenes();

      this.game.scene.start(GameScene.GameMap);
      useSceneStore.setState({
        currentScene: GameScene.GameMap,
        sceneData: null,
      });
      console.log("Starting Game Map Scene");
    }
  }

  showMoveScene(data?: Omit<MoveSceneData, "backgroundLayers">) {
    if (this.game) {
      this.stopActiveScenes();
      this.game.scene.start(GameScene.Move, data);
      useSceneStore.setState({
        currentScene: GameScene.Move,
        sceneData: data,
      });
      console.log("Showing Move Scene with data:", data);

      this.game.scene.start(GameScene.Move, {
        ...data,
        backgroundLayers: useSceneStore.getState().backgroundLayers,
      });
    }
  }

  showGameFood(data?: GameFoodLevelData) {
    if (this.game) {
      this.game.scene.start(GameScene.GameFood, data);
      useSceneStore.setState({
        currentScene: GameScene.GameFood,
        sceneData: data,
      });
      console.log("Starting Food Game Scene with data:", data);
    }
  }

  showGame2048() {
    if (this.game) {
      this.game.scene.start(GameScene.Game2048);
      useSceneStore.setState({
        currentScene: GameScene.Game2048,
        sceneData: null,
      });
      console.log("Starting 2048 Game Scene");
    }
  }

  public showFlyingGame() {
    if (this.game) {
      this.stopActiveScenes();

      this.game.scene.start(GameScene.FlyingGame);
      useSceneStore.setState({
        currentScene: GameScene.FlyingGame,
        sceneData: null,
      });
    }

    useSceneStore.setState({
      currentScene: GameScene.FlyingGame,
    });

  }

  /**
     * Показывает сцену перемещения (MovePhaserScene) с данными,
     * но указывает, что текущая сцена - MoscowMove.
     * Фон будет установлен в MoscowSceneWrapper.
     */
  public showMoscowMoveScene(data?: MoveSceneData) {
    if (this.game) {
      this.stopActiveScenes();

      const layers = {
        background: null,
        preBackground: null,
        light: getAssetsPathByType({ type: "images",
          scene: "to-train-move",
          filename: "background.svg" }),
        front: null,
        ground: getAssetsPath("images/platform.png"),
      };

      useSceneStore.setState({
        currentScene: GameScene.MoscowMove,
        sceneData: data,
        backgroundLayers: layers,
      });

      this.game.scene.start(GameScene.Move, {
        ...data,
        scenePrefix: "MoscowMove",
        backgroundLayers: useSceneStore.getState().backgroundLayers,
      });

      console.log("Showing Moscow Move Scene with Moscow backgrounds");
    }
  }

  public showDetectiveGame() {
    this.stopActiveScenes();

    useSceneStore.setState({
      currentScene: GameScene.DetectiveGame,
      sceneData: null,
    });
  }
}

export const gameFlowManager = new GameFlowManager();
