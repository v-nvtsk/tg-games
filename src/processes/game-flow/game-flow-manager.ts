import Phaser from "phaser";
import { gameConfig } from "@core/game-engine/config";
import { useAuthStore, useMoveSceneStore, useSceneStore } from "@core/state";
import { usePlayerState } from "@core/state/player-store";
import {
  type MoveSceneData,
  GameScene,
} from "@core/types/common-types";
import { GameMapPhaserScene } from "@features/game-map";
import { MovePhaserScene } from "@features/move-phaser-scene";
import { FlyingGameScene } from "@features/flying-game/flying-game-scene";
import { getAssetsPath, getAssetsPathByType } from "$utils/get-assets-path";
import { introSlidesConfig, railwayStationSlidesConfig } from "../../features/slides/configs";

class GameFlowManager {
  private game: Phaser.Game | null = null;

  /** ✅ Маппинг логическая → физическая Phaser-сцена */
  private readonly sceneMapping: Partial<Record<GameScene, GameScene>> = {
    [GameScene.GameMap]: GameScene.GameMap,
    [GameScene.FlyingGame]: GameScene.FlyingGame,
    [GameScene.MoveToTrain]: GameScene.Move,
    [GameScene.MoveAfterTrain]: GameScene.Move,
  };

  async initializeGame(parent: string | HTMLElement) {
    if (!this.game) {
      this.game = new Phaser.Game({
        ...gameConfig,
        parent,
        scene: [
          GameMapPhaserScene,
          MovePhaserScene,
          FlyingGameScene,
        ],
      });

      this.game.events.on(Phaser.Core.Events.READY, () => {
        console.log("Phaser Game Ready");
      });

      // ✅ загружаем состояние игрока
      try {
        await usePlayerState.getState().loadPlayerState();
      } catch (err) {
        console.error("Failed to load player state on init", err);
      }

      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        this.showAuth();
        return;
      }
      const { checkPoint } = usePlayerState.getState();
      if (checkPoint) {
        console.log(`Восстанавливаем сцену: ${checkPoint}`);
        // this.startScene(checkPoint as GameScene);
        // сделать мапу сцены на show функции
      } else {
        console.log("Нет сохранённой сцены, показываем интро");
        this.showIntro();
      }
    }
  }

  /** ✅ Общий метод запуска Phaser сцены */
  private startPhaserScene(scene: GameScene, data?: Record<string, unknown>): void {
    if (!this.game) {
      console.error("Game not initialized");
      return;
    }

    const phaserKey = this.sceneMapping[scene];
    if (!phaserKey) {
      console.log(`▶️ Запущена React сцена ${scene}`, data);
      return;
    }

    const payload = (data && typeof data === "object") ? data : {};
    this.stopActiveScenes();
    this.game.scene.start(phaserKey, payload);
    useSceneStore.setState({
      currentScene: scene,
      sceneData: data || null,
    });

    console.log(`▶️ Запущена логическая сцена ${scene} (Phaser: ${phaserKey})`, data);
  }

  private stopActiveScenes() {
    Object.values(GameScene).forEach((scene) => {
      if (this.game?.scene.isActive(scene)) {
        this.game.scene.stop(scene);
      }
    });
  }

  showAuth() {
    useSceneStore.getState().setScene(GameScene.Auth, null);
  }

  showIntro() {
    useSceneStore.getState().setSlidesConfig(introSlidesConfig);
    useSceneStore.getState().setScene(GameScene.Intro, null);
  }

  showGameMap() {
    this.startPhaserScene(GameScene.GameMap);
    useSceneStore.getState().setScene(GameScene.GameMap, {
    });
  }

  showMoveAfterTrain(data?: Omit<MoveSceneData, "backgroundLayers">) {
    this.startPhaserScene(GameScene.MoveAfterTrain, {
      ...data,
      backgroundLayers: useSceneStore.getState().backgroundLayers,
    });
  }

  showGame2048() { }

  showFlyingGame() {
    this.startPhaserScene(GameScene.FlyingGame);
  }

  /** ✅ Особый случай MoveToTrain */
  showMoveToTrainScene(data?: MoveSceneData) {
    if (!this.game) return;

    const layers = {
      background: null,
      preBackground: null,
      light: getAssetsPathByType({
        type: "images",
        scene: "to-train-move",
        filename: "background.svg",
      }),
      front: null,
      ground: getAssetsPath("images/platform.png"),
    };

    useSceneStore.setState({
      currentScene: GameScene.MoveToTrain,
      sceneData: data,
      backgroundLayers: layers,
    });

    useMoveSceneStore.setState({
      backgroundMusic: "Andrey Bakt - Rainy Hanoi.mp3",
    });

    this.stopActiveScenes();
    this.game.scene.start(GameScene.Move, {
      ...data,
      scenePrefix: "MoveToTrain",
      backgroundLayers: layers,
    });

    console.log("▶️ Запущена логическая сцена MoveToTrain (Phaser: Move)", data);
  }

  showRailwayStation() {
    useSceneStore.getState().setSlidesConfig(railwayStationSlidesConfig);
    useSceneStore.getState().setScene(GameScene.RailwayStation, null);
  }

  showGameCooking() {
    useSceneStore.getState().setScene(GameScene.CookingGame, null);
  }

  showDetectiveGame() {
    useSceneStore.getState().setScene(GameScene.DetectiveGame, null);
  }
}

export const gameFlowManager = new GameFlowManager();
