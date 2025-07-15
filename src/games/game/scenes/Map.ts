import { Scene } from "phaser";
import { getAssetsPath } from "../../../utils/get-assets-path";

export class MapScene extends Scene {
  private mapImage!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cameraBounds = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  };

  // Для обработки жестов на мобильных устройствах
  private lastTouchDistance = 0;
  private touchStartX = 0;
  private touchStartY = 0;
  // private isDragging = false;
  private velocityX = 0;
  private velocityY = 0;

  constructor() {
    super("MapScene");
  }

  preload() {
    this.load.image("map", getAssetsPath("map.png"));
    this.load.spritesheet("player_marker", getAssetsPath("schoolboy.png"), {
      frameWidth: 95,
      frameHeight: 256,
      startFrame: 0,
      endFrame: 0,
    });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // --- ФОН ---
    this.mapImage = this.add.image(0, 0, "map").setOrigin(0, 0);

    // Устанавливаем размер камеры по размеру карты
    const mapWidth = this.mapImage.width;
    const mapHeight = this.mapImage.height;

    this.cameraBounds = {
      minX: 0,
      minY: 0,
      maxX: mapWidth - width,
      maxY: mapHeight - height,
    };

    // --- КАМЕРА ---
    const camera = this.cameras.main;
    camera.setScroll(0, 0);
    camera.setBounds(this.cameraBounds.minX, this.cameraBounds.minY, mapWidth, mapHeight);

    // --- ИГРОК ---
    this.player = this.physics.add.sprite(100, 100, "player_marker");
    this.player.setImmovable(true);
    this.player.setGravityY(0);
    // Установите начальные координаты игрока на карте (например, 100, 100)
    this.player.setPosition(100, 100);
    this.player.setScrollFactor(1); // чтобы игрок "прилипал" к экрану

    // --- ОБРАБОТЧИКИ ЖЕСТОВ ---
    // --- ОБРАБОТЧИК ТАПА И ПЕРЕМЕЩЕНИЯ КАРТЫ ---
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.event instanceof TouchEvent && pointer.event.touches.length === 1) {
        this.touchStartX = pointer.x;
        this.touchStartY = pointer.y;
        this.lastTouchDistance = 0;
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;

      if (pointer.event instanceof TouchEvent && pointer.event.touches.length === 1) {
        const dx = pointer.x - this.touchStartX;
        const dy = pointer.y - this.touchStartY;

        const camera = this.cameras.main;
        let newX = camera.scrollX - dx;
        let newY = camera.scrollY - dy;

        newX = Phaser.Math.Clamp(newX, this.cameraBounds.minX, this.cameraBounds.maxX);
        newY = Phaser.Math.Clamp(newY, this.cameraBounds.minY, this.cameraBounds.maxY);

        camera.setScroll(newX, newY);

        this.touchStartX = pointer.x;
        this.touchStartY = pointer.y;
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (
        pointer.isDown &&
        pointer.event instanceof TouchEvent &&
        pointer.event.touches.length === 2
      ) {
        const touch1 = pointer.event.touches[0];
        const touch2 = pointer.event.touches[1];

        // Внутри input.on("pointermove") для двух пальцев
        const currentTouchDistance = Phaser.Math.Distance.Between(
          touch1.clientX,
          touch1.clientY,
          touch2.clientX,
          touch2.clientY,
        );

        if (this.lastTouchDistance > 0) {
          const zoomFactor = currentTouchDistance / this.lastTouchDistance;
          const newScale = Phaser.Math.Clamp(this.mapImage.scaleX * zoomFactor, 0.5, 3); // используем текущий scale
          this.mapImage.setScale(newScale);

          const camera = this.cameras.main;

          // Обновляем границы камеры с учетом нового масштаба
          const mapWidth = this.mapImage.width * newScale;
          const mapHeight = this.mapImage.height * newScale;
          camera.setBounds(0, 0, mapWidth, mapHeight);
        }

        this.lastTouchDistance = currentTouchDistance; // обновляем расстояние

        // --- СДВИГ КАМЕРЫ ---
        const dx = (touch1.clientX + touch2.clientX) / 2 - this.touchStartX;
        const dy = (touch1.clientY + touch2.clientY) / 2 - this.touchStartY;

        const camera = this.cameras.main;
        let newX = camera.scrollX - dx;
        let newY = camera.scrollY - dy;

        newX = Phaser.Math.Clamp(newX, this.cameraBounds.minX, this.cameraBounds.maxX);
        newY = Phaser.Math.Clamp(newY, this.cameraBounds.minY, this.cameraBounds.maxY);

        camera.setScroll(newX, newY);

        this.touchStartX += dx;
        this.touchStartY += dy;

        // --- МАСШТАБИРОВАНИЕ (ZOOM) ---
        const zoomFactor = currentTouchDistance / this.lastTouchDistance;

        if (zoomFactor !== 1) {
          const newScale = Phaser.Math.Clamp(this.mapImage.scaleX * zoomFactor, 0.5, 3);

          this.mapImage.setScale(newScale);

          // Обновляем границы камеры
          const mapWidth = this.mapImage.width * newScale;
          const mapHeight = this.mapImage.height * newScale;

          camera.setBounds(0, 0, mapWidth, mapHeight);

          // 🔁 Сохраняем текущее расстояние для следующего шага
          this.lastTouchDistance = currentTouchDistance; // <-- Основное исправление
        }
      }
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (pointer.event instanceof TouchEvent && pointer.event.touches.length === 0) {
        this.isDragging = false;
        this.velocityX = (pointer.x - this.touchStartX) * 0.5;
        this.velocityY = (pointer.y - this.touchStartY) * 0.5;
      }
    });

    this.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        if (Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1) {
          const camera = this.cameras.main;
          let newX = camera.scrollX - this.velocityX;
          let newY = camera.scrollY - this.velocityY;

          newX = Phaser.Math.Clamp(newX, this.cameraBounds.minX, this.cameraBounds.maxX);
          newY = Phaser.Math.Clamp(newY, this.cameraBounds.minY, this.cameraBounds.maxY);

          camera.setScroll(newX, newY);

          this.velocityX *= 0.92;
          this.velocityY *= 0.92;
        }
      },
    });

    // --- ОПЦИОНАЛЬНО: СКРОЛЛ КОЛЕСИКОМ МЫШИ ---
    window.addEventListener("wheel", (event) => {
      const camera = this.cameras.main;
      let newX = camera.scrollX + event.deltaX;
      let newY = camera.scrollY + event.deltaY;

      newX = Phaser.Math.Clamp(newX, this.cameraBounds.minX, this.cameraBounds.maxX);
      newY = Phaser.Math.Clamp(newY, this.cameraBounds.minY, this.cameraBounds.maxY);

      camera.setScroll(newX, newY);
    });
  }

  // --- Помощник для определения типа события ---
  private isTouchEvent(event: Event): event is TouchEvent {
    return "touches" in event;
  }

  update() {
    // Здесь можно добавить логику обновления позиции игрока или других элементов
  }
}
