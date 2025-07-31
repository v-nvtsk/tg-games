import Phaser from "phaser";
import { gameConfig } from "@core/game-engine/config";
import { useAuthStore, useSceneStore } from "@core/state";
import { usePlayerState } from "@core/state/player-store";
import {
  type MoveSceneData,
  type GameFoodLevelData,
  type CookingGameData,
  GameScene,
} from "@core/types/common-types";
import { AuthPhaserScene } from "$features/auth-phaser-scene";
import { GameMapPhaserScene } from "@features/game-map";
import { MovePhaserScene } from "@features/move-phaser-scene";
import { GameFoodPhaserScene } from "$features/game-food";
import { Game2048PhaserScene } from "$features/game-2048";
import { FlyingGameScene } from "@features/flying-game/flying-game-scene";
import { getAssetsPath, getAssetsPathByType } from "$utils/get-assets-path";
import { getIntroSlides } from "../../features/slides";

class GameFlowManager {
  private game: Phaser.Game | null = null;

  /** ✅ Маппинг логическая → физическая Phaser-сцена */
  private readonly sceneMapping: Record<GameScene, GameScene> = {
    [GameScene.Auth]: GameScene.Auth,
    [GameScene.Intro]: GameScene.Intro,
    [GameScene.GameMap]: GameScene.GameMap,
    [GameScene.Move]: GameScene.Move,
    [GameScene.MoveToTrain]: GameScene.MoveToTrain,
    [GameScene.GameFood]: GameScene.GameFood,
    [GameScene.Game2048]: GameScene.Game2048,
    [GameScene.FlyingGame]: GameScene.FlyingGame,
    [GameScene.DetectiveGame]: GameScene.DetectiveGame,
    [GameScene.CookingGame]: GameScene.CookingGame,
  };

  async initializeGame(parent: string | HTMLElement) {
    if (!this.game) {
      this.game = new Phaser.Game({
        ...gameConfig,
        parent,
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

      // ✅ загружаем состояние игрока
      try {
        await usePlayerState.getState().loadPlayerState();
      } catch (err) {
        console.error("Failed to load player state on init", err);
      }

      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) {
        this.startScene(GameScene.Auth);
        return;
      }
      const { currentScene } = usePlayerState.getState();
      if (currentScene) {
        console.log(`Восстанавливаем сцену: ${currentScene}`);
        this.startScene(currentScene as GameScene);
      } else {
        console.log("Нет сохранённой сцены, показываем интро");
        this.showIntro();
      }
    }
  }

  /** ✅ Общий метод запуска Phaser сцены */
  private startPhaserScene(scene: GameScene, data?: Record<string, unknown>): void {
    if (!this.game) return;

    const phaserKey = this.sceneMapping[scene];
    if (!phaserKey) {
      console.warn(`Неизвестная сцена: ${scene}, запускаем интро`);
      return this.startPhaserScene(GameScene.Intro);
    }

    if (this.isSceneHidden(scene)) {
      console.warn(`${scene} скрыта, пропускаем`);
      return;
    }

    const payload = (data && typeof data === "object") ? data : {};
    this.stopActiveScenes();
    this.game.scene.start(phaserKey, payload);
    useSceneStore.setState({
      currentScene: scene,
      sceneData: data || null
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

  private isSceneHidden(scene: GameScene): boolean {
    return usePlayerState.getState().hiddenScenes.includes(scene);
  }

  showIntro(episodeNumber = 0) {
    useSceneStore.getState().setSlidesConfig(
      () => getIntroSlides(episodeNumber),
      GameScene.Intro,
    );

    this.startPhaserScene(GameScene.Intro, { episodeNumber });
  }

  startGameMap() {
    this.startPhaserScene(GameScene.GameMap);
  }

  showMoveScene(data?: Omit<MoveSceneData, "backgroundLayers">) {
    this.startPhaserScene(GameScene.Move, {
      ...data,
      backgroundLayers: useSceneStore.getState().backgroundLayers,
    });
  }

  showGame2048() {
    this.startPhaserScene(GameScene.Game2048);
  }

  showFlyingGame() {
    this.startPhaserScene(GameScene.FlyingGame);
  }

  /** ✅ Особый случай MoveToTrain */
  showMoveToTrainScene(data?: MoveSceneData) {
    if (!this.game) return;
    if (this.isSceneHidden(GameScene.MoveToTrain)) {
      console.warn("MoveToTrain is hidden, skipping.");
      return;
    }

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

    this.stopActiveScenes();
    this.game.scene.start(GameScene.Move, {
      ...data,
      scenePrefix: "MoveToTrain",
      backgroundLayers: layers,
    });

    console.log("▶️ Запущена логическая сцена MoveToTrain (Phaser: Move)", data);
  }

  showDetectiveGame() {
    this.startPhaserScene(GameScene.DetectiveGame);
  }

  public showGameCooking(data?: CookingGameData) {
    useSceneStore.setState({
      currentScene: GameScene.CookingGame,
      sceneData: data,
    });
  }

  /** ✅ Унифицированный способ восстановить сохранённую сцену */
  private startScene(sceneName: GameScene): void {
    if (sceneName === GameScene.MoveToTrain) {
      this.showMoveToTrainScene();
      return;
    }
    this.startPhaserScene(sceneName);
  }
}

export const gameFlowManager = new GameFlowManager();
