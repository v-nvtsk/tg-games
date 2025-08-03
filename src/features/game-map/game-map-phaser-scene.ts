import { Scene } from "phaser";
import { getAssetsPath, getAssetsPathByType } from "@utils/get-assets-path";
import { GameScene } from "@core/types/common-types";
import { logActivity } from "$/api/log-activity";
import { useSceneStore } from "../../core/state";

const CITY_RADIUS = 100;
const TAP_THRESHOLD = 10;

interface City {
  name: string;
  x: number;
  y: number;
  object: Phaser.GameObjects.Arc | null;
}

export default class GameMapPhaserScene extends Scene {
  private mapImage!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Sprite;
  private cities: City[] = [
    { name: "Москва",
      x: 920,
      y: 1100,
      object: null },
    { name: "Санкт-Петербург",
      x: 950,
      y: 800,
      object: null },
    { name: "Казань",
      x: 1150,
      y: 1350,
      object: null },
  ];

  private lastTouchDistance = 0;
  private minZoom = 0.5;
  private maxZoom = 3;
  private currentZoom = 1;
  private selectedCity = "";

  constructor() {
    super(GameScene.GameMap);
  }

  preload(): void {
    // ✅ Загружаем одну большую карту SVG/PNG
    // this.load.image("map_image", getAssetsPath("images/map.svg"));
    this.load.svg("map_image", getAssetsPathByType({ type: "images",
      scene: "game-map",
      filename: "map.svg" }));

    this.load.spritesheet("player_marker", getAssetsPath("images/hero.png"), {
      frameWidth: 174,
      frameHeight: 300,
    });
  }

  create(): void {
    // ✅ Отображаем карту
    this.mapImage = this.add.image(0, 0, "map_image").setOrigin(0, 0);

    const mapWidth = this.mapImage.width;
    const mapHeight = this.mapImage.height;

    const camera = this.cameras.main;
    camera.setBounds(0, 0, mapWidth, mapHeight);

    // ✅ Игрок
    this.player = this.add.sprite(this.cities[0].x - 70, this.cities[0].y, "player_marker").setScale(0.5);
    this.player.setScrollFactor(1);

    // ✅ Города
    this.cities.forEach((city) => {
      city.object = this.add.circle(city.x, city.y, CITY_RADIUS, 0xffe600, 0.2)
        .setScrollFactor(1)
        .setAlpha(0.000001)
        .setInteractive();

      city.object.on("pointerup", (pointer: Phaser.Input.Pointer) => {
        const distance = Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.upX, pointer.upY);

        if (distance < TAP_THRESHOLD) {
          void logActivity("city_tapped_success", { cityName: city.name,
            tapDistance: distance }, GameScene.GameMap);

          camera.centerOn(city.x, city.y);
          if (city.name !== this.selectedCity) {
            this.startPulseAnimation(city.object as Phaser.GameObjects.Arc);
          }
          useSceneStore.setState({
            currentScene: GameScene.GameMap,
            sceneData: { selectedCity: city.name,
              targetX: city.x,
              targetY: city.y },
          });
          this.selectedCity = city.name;
        } else {
          void logActivity("city_tapped_fail_drag", { cityName: city.name,
            tapDistance: distance }, GameScene.GameMap);
        }
      });
    });

    camera.centerOn(this.player.x, this.player.y);

    // ✅ Панорамирование, зум (логика из старой версии остаётся)
    this.setupCameraControls(camera);

    void logActivity("scene_enter", { scene: GameScene.GameMap }, GameScene.GameMap);
  }

  private setupCameraControls(camera: Phaser.Cameras.Scene2D.Camera) {
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.event instanceof TouchEvent && pointer.event.touches.length >= 1) {
        this.lastTouchDistance = 0;
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;

      const distanceMoved = Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.x, pointer.y);

      if (distanceMoved > TAP_THRESHOLD) {
        if (pointer.event instanceof TouchEvent && pointer.event.touches.length === 1) {
          camera.scrollX += pointer.prevPosition.x - pointer.x;
          camera.scrollY += pointer.prevPosition.y - pointer.y;
        } else if (pointer.event instanceof TouchEvent && pointer.event.touches.length === 2) {
          const touches = pointer.event.touches;
          const currentDistance = Phaser.Math.Distance.Between(
            touches[0].clientX,
            touches[0].clientY,
            touches[1].clientX,
            touches[1].clientY,
          );

          if (this.lastTouchDistance > 0 && currentDistance !== this.lastTouchDistance) {
            const zoomFactor = currentDistance / this.lastTouchDistance;
            this.currentZoom = Phaser.Math.Clamp(this.currentZoom * zoomFactor, this.minZoom, this.maxZoom);
            camera.setZoom(this.currentZoom);
          }
          this.lastTouchDistance = currentDistance;
        }
      }
    });

    this.input.on("pointerup", () => {
      this.lastTouchDistance = 0;
    });
  }

  private startPulseAnimation(circle: Phaser.GameObjects.Arc): void {
    this.tweens.killTweensOf(circle);

    this.tweens.add({
      targets: circle,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 1,
      duration: 300,
      ease: "Linear",
      repeat: 0,
      yoyo: true,
      onComplete: () => {
        circle.setAlpha(0.000001);
        circle.setScale(1);
      },
    });
  }

  update(): void {
    /* ничего не требуется */
  }
}
