import { Scene } from "phaser";
import { getAssetsPath } from "../../../utils/get-assets-path";

export class MapScene extends Scene {
  private mapImage!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Sprite;

  // Жесты
  private lastTouchDistance = 0;
  private touchStartX = 0;
  private touchStartY = 0;

  // Масштабирование
  private minZoom = 0.5;
  private maxZoom = 3;
  private currentZoom = 1;

  constructor() {
    super("MapScene");
  }

  preload(): void {
    this.load.image("map", getAssetsPath("map.png"));
    this.load.spritesheet("player_marker", getAssetsPath("schoolboy.png"), {
      frameWidth: 95,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 0,
    });
  }

  create(): void {

    // --- ФОН ---
    this.mapImage = this.add.image(0, 0, "map").setOrigin(0, 0);

    // --- КАМЕРА ---
    const camera = this.cameras.main;
    const mapWidth = this.mapImage.width;
    const mapHeight = this.mapImage.height;

    // Устанавливаем границы камеры
    camera.setBounds(0, 0, mapWidth, mapHeight);

    // --- ИГРОК ---
    this.player = this.add.sprite(400, 750, "player_marker");
    this.player.setScrollFactor(1); // игрок следует за камерой

    // --- СЛУШАТЕЛИ ЖЕСТОВ ---
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.event instanceof TouchEvent && pointer.event.touches.length >= 1) {
        this.touchStartX = pointer.x;
        this.touchStartY = pointer.y;
        this.lastTouchDistance = 0;
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;

      if (pointer.event instanceof TouchEvent && pointer.event.touches.length === 1) {
        // Перетаскивание
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

        // Центрируем зум относительно центра пальцев
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
    });
  }

  update(): void {
    // Можно добавить дополнительную логику здесь
  }
}
