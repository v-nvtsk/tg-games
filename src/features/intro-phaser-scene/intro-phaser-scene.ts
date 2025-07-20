// === src/features/intro-phaser-scene/intro-phaser-scene.ts ===
import Phaser from "phaser";
import { getAssetsPathByType, setBackground } from "$/utils";
import { gameFlowManager } from "$/processes";

export interface Slide {
  key: string;
  path: string;
  message: string; // Добавляем поле для сообщения
}

export class IntroPhaserScene extends Phaser.Scene {
  private slides: Slide[];
  private currentSlideIndex = 0;
  private background!: Phaser.GameObjects.Image;
  private thoughtBubbleContainer!: Phaser.GameObjects.Container; // Контейнер для облачка мыслей и текста
  private nextButton!: Phaser.GameObjects.Image; // Объект для кнопки "дальше"
  private progressBarBackground!: Phaser.GameObjects.Graphics; // Фон индикатора прогресса
  private progressBarFill!: Phaser.GameObjects.Graphics; // Заполняющая часть индикатора прогресса (теперь Graphics)
  private tapAllowed = false; // Флаг, разрешающий тап для переключения слайда

  constructor() {
    super("Intro"); // Ключ сцены "Intro"
    this.slides = [
      { key: "slide1",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide1.png" }),
        message: "Добро пожаловать в мир приключений!" },
      { key: "slide2",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide2.png" }),
        message: "Исследуйте неизведанные земли и города." },
      { key: "slide3",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide3.png" }),
        message: "Встречайте новых друзей." },
      { key: "slide4",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide4.png" }),
        message: "Развивайте свои навыки и становитесь сильнее." },
      { key: "slide5",
        path: getAssetsPathByType({ type: "images",
          scene: "intro",
          filename: "slide5.png" }),
        message: "Ваше путешествие начинается прямо сейчас!" },
    ];
  }

  preload() {
    this.slides.forEach((slide) => {
      this.load.image(slide.key, slide.path);
    });

    // Загружаем изображение для кнопки "дальше" из файла SVG в assets
    // Путь: src/assets/images/icons/next-arrow.svg
    this.load.svg("nextButtonIcon", getAssetsPathByType({ type: "images",
      filename: "icons/next-arrow.svg" }), { width: 64,
      height: 64 });
  }

  create() {
    this.showSlide(this.currentSlideIndex);
    // Явно привязываем контекст 'this' к handleTap для Phaser.Input.on
    this.input.on("pointerdown", this.handleTap.bind(this));
  }

  private showSlide(index: number) {
    // Сбрасываем флаг разрешения тапа при показе нового слайда
    this.tapAllowed = false;

    if (index >= this.slides.length) {
      this.scene.stop();
      gameFlowManager.startGameMap();
      // Уничтожаем кнопку и индикатор прогресса, если они существуют и мы переходим на карту
      if (this.nextButton) {
        this.tweens.killTweensOf(this.nextButton); // Останавливаем мерцание
        this.nextButton.destroy();
      }
      if (this.progressBarBackground) {
        this.progressBarBackground.destroy();
      }
      if (this.progressBarFill) {
        this.tweens.killTweensOf(this.progressBarFill); // Останавливаем твин прогресса
        this.progressBarFill.destroy();
      }
      // Уничтожаем облачко мыслей
      if (this.thoughtBubbleContainer) {
        this.thoughtBubbleContainer.destroy();
      }
      return;
    }

    // Уничтожаем предыдущие объекты, если они существуют
    if (this.background) {
      this.background.destroy();
    }
    if (this.thoughtBubbleContainer) {
      this.thoughtBubbleContainer.destroy();
    }
    if (this.nextButton) {
      this.tweens.killTweensOf(this.nextButton); // Останавливаем мерцание перед уничтожением
      this.nextButton.destroy();
    }
    if (this.progressBarBackground) {
      this.progressBarBackground.destroy();
    }
    if (this.progressBarFill) {
      this.tweens.killTweensOf(this.progressBarFill); // Останавливаем твин прогресса перед уничтожением
      this.progressBarFill.destroy();
    }

    const { key, message } = this.slides[index];

    // Используем setBackground для установки изображения с сохранением пропорций и заполнением высоты
    // coverMode = true по умолчанию, но явно указываем для ясности
    this.background = setBackground(this, key, true);

    // После того как setBackground установил origin(0,0) и масштабировал изображение,
    // мы меняем его позицию и origin, чтобы оно центрировалось на экране.
    // Сначала устанавливаем origin в центр изображения (0.5, 0.5)
    this.background.setOrigin(0.5, 0.5);
    // Затем позиционируем центр изображения в центр экрана
    this.background.setPosition(this.scale.width / 2, this.scale.height / 2);

    // Создаем облачко мыслей с текстом
    this.thoughtBubbleContainer = this.createThoughtBubble(message);
    this.thoughtBubbleContainer.setAlpha(0); // Изначально делаем облачко невидимым
    this.thoughtBubbleContainer.setPosition(this.scale.width / 2, this.scale.height * 0.75); // Позиционируем контейнер

    // Создаем кнопку "дальше"
    this.nextButton = this.add.image(
      this.scale.width - 80, // Позиция по X (справа)
      this.scale.height - 80, // Позиция по Y (снизу)
      "nextButtonIcon", // Ключ загруженного изображения кнопки
    )
      .setOrigin(0.5) // Центрируем кнопку
      .setScale(1) // Начальный масштаб
      .setAlpha(0) // Изначально невидима
      .setInteractive({ useHandCursor: true }); // Делаем интерактивной

    // Добавляем обработчик для кнопки
    this.nextButton.on("pointerdown", () => {
      // Вызываем handleTap, чтобы обработать переход к следующему слайду
      // Это также учтет задержку в 3 секунды через tapAllowed
      this.handleTap();
    });

    // Создаем индикатор прогресса
    const progressBarWidth = this.scale.width * 0.6; // Ширина 60% от ширины экрана
    const progressBarHeight = 10; // Высота индикатора
    const progressBarX = (this.scale.width - progressBarWidth) / 2; // Центр по X
    const progressBarY = this.scale.height - 30; // Позиция у нижнего края
    const progressBarRadius = progressBarHeight / 2; // Радиус для скругления углов

    // Фон индикатора (используем fillRoundedRect)
    this.progressBarBackground = this.add.graphics({ fillStyle: { color: 0x888888,
      alpha: 0.5 } });
    this.progressBarBackground.fillRoundedRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight, progressBarRadius);

    // Сам прогресс-бар, который будет заполняться (теперь также Graphics)
    this.progressBarFill = this.add.graphics({ fillStyle: { color: 0x4CAF50,
      alpha: 1 } });
    // Изначально не рисуем его здесь, а рисуем в onUpdate, чтобы контролировать его форму

    // Анимация появления фона
    this.background.alpha = 0;
    this.tweens.add({
      targets: this.background,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        // Анимация появления облачка мыслей после появления фона
        this.tweens.add({
          targets: this.thoughtBubbleContainer,
          alpha: 1,
          y: this.scale.height * 0.70, // Небольшое движение вверх при появлении
          duration: 700,
          ease: "Power2",
          onComplete: () => {
            // Запускаем анимацию прогресс-бара
            this.tweens.add({
              targets: { currentWidth: 0 }, // Анимируем вспомогательное свойство
              currentWidth: progressBarWidth, // До полной ширины
              duration: 3000, // Длительность 3 секунды
              ease: "Linear",
              onUpdate: (tween) => {
                // Перерисовываем прогресс-бар на каждом кадре анимации
                this.progressBarFill.clear();
                const currentAnimatedWidth = tween.getValue() || 0;

                if (currentAnimatedWidth > 0) {
                  // Если ширина меньше, чем радиус * 2 (чтобы обеспечить закругление с обеих сторон),
                  // рисуем круг, который растет.
                  if (currentAnimatedWidth < progressBarRadius * 2) {
                    this.progressBarFill.fillCircle(progressBarX + currentAnimatedWidth / 2, progressBarY + progressBarRadius, currentAnimatedWidth / 2);
                  } else {
                    // Иначе рисуем закругленный прямоугольник
                    this.progressBarFill.fillRoundedRect(progressBarX, progressBarY, currentAnimatedWidth, progressBarHeight, progressBarRadius);
                  }
                }
              },
              onComplete: () => {
                // Разрешаем тап только после завершения анимации прогресс-бара
                this.tapAllowed = true;
                // Анимация появления кнопки "дальше" и запуск мерцания
                this.tweens.add({
                  targets: this.nextButton,
                  alpha: 1,
                  scale: 1.2, // Небольшое увеличение для привлечения внимания
                  duration: 300,
                  yoyo: true, // Возврат к исходному размеру
                  repeat: 0,
                  ease: "Power1",
                  onComplete: () => {
                    // Запускаем мерцание кнопки после ее появления
                    this.tweens.add({
                      targets: this.nextButton,
                      alpha: { from: 1,
                        to: 0.5 }, // Мерцание от полной прозрачности до половины
                      duration: 500, // Скорость мерцания
                      yoyo: true, // Туда-обратно
                      repeat: -1, // Бесконечное повторение
                      ease: "Sine.easeInOut", // Плавное мерцание
                    });
                  },
                });
              },
            });
          },
        });
      },
    });
  }

  // Новый метод для создания облачка мыслей
  private createThoughtBubble(message: string): Phaser.GameObjects.Container {
    const bubblePadding = 20;
    const pointerWidth = 20;
    const pointerHeight = 15;
    const borderRadius = 15;

    // Создаем текстовый объект, чтобы определить его размеры
    const text = this.add.text(0, 0, message, {
      fontFamily: "Arial",
      fontSize: "28px", // Немного уменьшим размер шрифта для облачка
      color: "#000000", // Цвет текста внутри облачка
      align: "center",
      wordWrap: { width: this.scale.width * 0.7,
        useAdvancedWrap: true }, // Ограничиваем ширину текста
    }).setOrigin(0.5);

    const textWidth = text.width;
    const textHeight = text.height;

    const bubbleWidth = textWidth + bubblePadding * 2;
    const bubbleHeight = textHeight + bubblePadding * 2;

    // Создаем графику для облачка
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 0.9); // Белый цвет, полупрозрачный
    graphics.lineStyle(2, 0x000000, 1); // Черная обводка

    // Рисуем закругленный прямоугольник
    graphics.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, borderRadius);
    graphics.strokeRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, borderRadius);

    // Рисуем "хвостик" облачка (треугольник)
    graphics.beginPath();
    graphics.moveTo(0, bubbleHeight / 2 - borderRadius / 2); // Нижний центр облачка
    graphics.lineTo(-pointerWidth / 2, bubbleHeight / 2 + pointerHeight); // Левая точка хвостика
    graphics.lineTo(pointerWidth / 2, bubbleHeight / 2 + pointerHeight); // Правая точка хвостика
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    // Создаем контейнер для облачка и текста
    const container = this.add.container(0, 0, [graphics, text]);
    container.setDepth(10); // Убедимся, что облачко поверх всего

    return container;
  }

  private handleTap(): void {
    // Проверяем, разрешен ли тап для переключения слайда
    if (this.tapAllowed) {
      this.tapAllowed = false; // Сразу сбрасываем флаг, чтобы избежать множественных тапов

      // Останавливаем все твины для кнопки перед ее исчезновением
      this.tweens.killTweensOf(this.nextButton);
      // Останавливаем твин прогресс-бара
      this.tweens.killTweensOf(this.progressBarFill);

      // Анимация исчезновения текущего слайда, текста, кнопки и прогресс-бара
      this.tweens.add({
        targets: [this.background, this.thoughtBubbleContainer, this.nextButton, this.progressBarBackground, this.progressBarFill], // Анимируем все объекты
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.background.destroy(); // Уничтожаем изображение после исчезновения
          this.thoughtBubbleContainer.destroy(); // Уничтожаем контейнер облачка
          this.nextButton.destroy(); // Уничтожаем кнопку
          this.progressBarBackground.destroy(); // Уничтожаем фон прогресс-бара
          this.progressBarFill.destroy(); // Уничтожаем заполняющую часть прогресс-бара
          this.currentSlideIndex++; // Переходим к следующему слайду
          this.showSlide(this.currentSlideIndex); // Показываем следующий слайд
        },
      });
    }
  }
}
