// === src/features/game-map/GameMapPhaserScene.ts ===
import { Scene } from "phaser";
import { getAssetsPath } from "@/utils/get-assets-path";
import { GameScene, type GameMapSceneData } from "@/processes/game-flow/game-flow-manager"; // Импортируем GameMapSceneData
import { useSceneState } from "@/core/state/scene-store";

const CITY_RADIUS = 100;

interface City {
  name: string;
  x: number;
  y: number;
  object: Phaser.GameObjects.Arc | null;
}

export default class GameMapPhaserScene extends Scene {
  private mapImage!: Phaser.Tilemaps.Tilemap;
  private player!: Phaser.GameObjects.Sprite;

  private lastTouchDistance = 0;
  private touchStartX = 0;
  private touchStartY = 0;

  private minZoom = 0.5;
  private maxZoom = 3;
  private currentZoom = 1;

  private isDragging = false;

  private selectedCity = "";

  constructor() {
    super(GameScene.GameMap);
  }

  private cities: City[] = [
    { name: "Москва", x: 920, y: 1100, object: null },
    { name: "Санкт-Петербург", x: 950, y: 800, object: null },
    { name: "Казань", x: 1150, y: 1350, object: null },
  ];

  preload(): void {
    this.load.image("gamemap-tileset-part1-key", getAssetsPath("images/map_part1.png"));
    this.load.image("gamemap-tileset-part2-key", getAssetsPath("images/map_part2.png"));
    this.load.image("gamemap-tileset-part3-key", getAssetsPath("images/map_part3.png"));
    this.load.tilemapTiledJSON("my_map", getAssetsPath("tiled/tiled-gamemap.json"));

    this.load.spritesheet("player_marker", getAssetsPath("images/schoolboy.png"), {
      frameWidth: 95,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 0,
    });
  }

  create(): void {
    this.mapImage = this.make.tilemap({ key: "my_map" });

    const tileset1 = this.mapImage.addTilesetImage("gamemap-tileset-part1", "gamemap-tileset-part1-key");
    const tileset2 = this.mapImage.addTilesetImage("gamemap-tileset-part2", "gamemap-tileset-part2-key");
    const tileset3 = this.mapImage.addTilesetImage("gamemap-tileset-part3", "gamemap-tileset-part3-key");

    if (tileset1 && tileset2 && tileset3) {
      this.mapImage.createLayer("Tile Layer 1", [tileset1, tileset2, tileset3], 0, 0);
    } else {
      console.error("Ошибка: Один или несколько тайлсетов не были загружены.");
    }

    this.cameras.main.setBounds(0, 0, this.mapImage.widthInPixels, this.mapImage.heightInPixels);

    const camera = this.cameras.main;
    const mapWidth = this.mapImage.widthInPixels;
    const mapHeight = this.mapImage.heightInPixels;

    camera.setBounds(0, 0, mapWidth, mapHeight);

    this.player = this.add.sprite(this.cities[0].x - 70, this.cities[0].y, "player_marker").setScale(0.5);
    this.player.setScrollFactor(1);

    this.cities.forEach((city) => {
      city.object = this.add.circle(city.x, city.y, CITY_RADIUS, 0xffe600, 0.2)
        .setScrollFactor(1)
        .setAlpha(0.000001)
        .setInteractive();

      city.object.on("pointerup", () => {
        if (!this.isDragging) {
          camera.centerOn(city.x, city.y);
          if (city.name !== this.selectedCity) {
            this.startPulseAnimation(city.object as Phaser.GameObjects.Arc);
          }
          // Обновляем состояние React, чтобы показать кнопку "Идти"
          // Передаем данные, соответствующие GameMapSceneData
          useSceneState.setState({
            currentScene: GameScene.GameMap,
            sceneData: { selectedCity: city.name, targetX: city.x, targetY: city.y } as GameMapSceneData,
          });
          this.selectedCity = city.name;
        }
      });
    });

    camera.centerOn(this.player.x, this.player.y);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.event instanceof TouchEvent && pointer.event.touches.length >= 1) {
        this.touchStartX = pointer.x;
        this.touchStartY = pointer.y;
        this.lastTouchDistance = 0;
      }
      useSceneState.setState({ // Обновляем состояние React, сбрасывая данные
        currentScene: GameScene.GameMap,
        sceneData: null,
      });
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;

      this.isDragging = true;

      if (pointer.event instanceof TouchEvent && pointer.event.touches.length === 1) {
        const dx = pointer.x - this.touchStartX;
        const dy = pointer.y - this.touchStartY;

        const newScrollX = camera.scrollX - dx;
        const newScrollY = camera.scrollY - dy;

        camera.setScroll(newScrollX, newScrollY);

        this.touchStartX = pointer.x;
        this.touchStartY = pointer.y;
      }

      if (pointer.event instanceof TouchEvent && pointer.event.touches.length === 2) {
        const touches = pointer.event.touches;
        const touch1 = touches[0];
        const touch2 = touches[1];

        const currentDistance = Phaser.Math.Distance.Between(
          touch1.clientX,
          touch1.clientY,
          touch2.clientX,
          touch2.clientY,
        );

        if (this.lastTouchDistance > 0 && currentDistance !== this.lastTouchDistance) {
          const zoomFactor = currentDistance / this.lastTouchDistance;
          this.currentZoom = Phaser.Math.Clamp(this.currentZoom * zoomFactor, this.minZoom, this.maxZoom);
          camera.setZoom(this.currentZoom);
        }

        this.lastTouchDistance = currentDistance;

        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        if (currentDistance !== this.lastTouchDistance) {
          const worldPoint = camera.getWorldPoint(centerX, centerY);
          camera.centerOn(worldPoint.x, worldPoint.y);
        }
      }
    });

    this.input.on("pointerup", () => {
      this.lastTouchDistance = 0;
      camera.setZoom(this.currentZoom);
      this.isDragging = false;
    });

    useSceneState.setState({ currentScene: GameScene.GameMap, sceneData: null }); // Использование useSceneState.setState
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
    });
  }

  update(): void {
    // Логика обновления, если есть
  }
}
