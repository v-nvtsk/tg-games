import { Scene } from "phaser";
import { getAssetsPath } from "../../../utils/get-assets-path";

const CITY_RADIUS = 150;

interface Cities {
  name: string;
  x: number;
  y: number;
  object: Phaser.GameObjects.Arc | null;
}

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

  private isDragging = false;
  private goButton!: Phaser.GameObjects.Text | null;
  private selectedCity: Cities | null = null; // Добавим для отслеживания выбранного города

  constructor() {
    super("MapScene");
  }

  private cities: Cities[] = [
    { name: "Москва", x: 920, y: 1100, object: null },
    { name: "Санкт-Петербург", x: 950, y: 800, object: null },
    { name: "Казань", x: 1150, y: 1350, object: null },
  ];

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
    this.player = this.add.sprite(this.cities[0].x, this.cities[0].y, "player_marker");
    this.player.setScrollFactor(1); // игрок следует за камерой

    // --- ГОРОДА ---
    this.cities.forEach((city) => {
      // draw a circle R=CITY_RADIUS
      city.object = this.add.circle(city.x, city.y, CITY_RADIUS, 0xffe600, 0.2)
        .setScrollFactor(1)
        .setAlpha(0.00001)
        .setInteractive();

      city.object.on("pointerup", () => {
        if (!this.isDragging) {
          this.selectedCity = city; // Сохраняем выбранный город
          camera.centerOn(city.x, city.y);
          this.startPulseAnimation(city.object as Phaser.GameObjects.Arc);
        }
      });
    });

    camera.centerOn(this.player.x, this.player.y);

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

      this.isDragging = true;
      if (this.goButton) {
        this.goButton.removeAllListeners();
        this.goButton.destroy();
        this.goButton = null;
      }

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
      this.isDragging = false;
    });
  }

  private startPulseAnimation(circle: Phaser.GameObjects.Arc): void {
    // Сброс предыдущей анимации
    this.tweens.killTweensOf(circle);

    // Анимация пульсации через tween
    this.tweens.add({
      targets: circle,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 1,
      duration: 800,
      ease: "Linear",
      repeat: -1, // бесконечное повторение
      yoyo: true,
    });

    // Создаем кнопку "Идти" если её нет
    if (this.goButton) {
      this.goButton.destroy();
    }

    // Получаем размеры экрана
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    this.goButton = this.add.text(
      screenWidth - 120, // Отступ от правого края
      screenHeight - 60, // Отступ от нижнего края
      "Идти",
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#4CAF50",
        padding: { left: 25, right: 25, top: 12, bottom: 12 },
        align: "center",
      },
    )
      .setScrollFactor(0) // Фиксированная позиция на экране
      .setDepth(100) // Высокий уровень отображения
      .setOrigin(0.5) // Центрирование
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.goButton?.setScale(1.05);
      })
      .on("pointerout", () => {
        this.goButton?.setScale(1);
      })
      .on("pointerdown", () => {
        this.goButton?.setScale(0.95);
      })
      .on("pointerup", () => {
        if (this.selectedCity) {
        // Перемещаем игрока в выбранный город
          this.player.setPosition(this.selectedCity.x, this.selectedCity.y);
          // Запускаем сцену перемещения
          this.scene.start("MoveScene");
        }
      });
  }

  update(): void {
    // Обновляем позицию кнопки при изменении размера экрана
    if (this.goButton) {
      const screenWidth = this.cameras.main.width;
      const screenHeight = this.cameras.main.height;
      this.goButton.setPosition(screenWidth - 120, screenHeight - 60);
    }
  }
}
