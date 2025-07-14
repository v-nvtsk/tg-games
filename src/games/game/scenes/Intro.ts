import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Intro extends Scene {
  private formElement!: Phaser.GameObjects.DOMElement;
  private selectedGender: string | null = null;

  constructor() {
    super("Intro");
  }

  init(): void {
    if (this.formElement) {
      this.formElement.destroy();
    }
  }

  preload(): void {
    // Загружаем HTML-форму
    this.load.html("nameform", "assets/text/nameform/index.html");
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Фон
    this.add.image(width / 2, height / 2, "menu/background");

    // Текст приглашения
    const promptText = this.add.text(width / 2, height / 2 - 120, "Введите ваше имя и выберите пол", {
      fontSize: "24px",
      color: "#fff",
      // backgroundColor: "#0008",
      padding: { left: 10, right: 10 },
      wordWrap: { width: 400 },
      align: "center",
      // TODO: исправить шрифт
      fontFamily: "Serif",
    }).setOrigin(0.5);

    // Загрузка формы
    this.formElement = this.add.dom(width / 2, height / 2).createFromCache("nameform");

    // Подписываемся на клики по кнопкам внутри формы
    this.formElement.addListener("click");

    this.formElement.on("click", (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.target as HTMLButtonElement;

      // Выбор пола
      if (target.name === "genderButton") {
        this.selectedGender = target.dataset.gender || null;

        // Сброс стилей всех кнопок
        const buttons = this.formElement.getChildByID("name-form-container")?.querySelectorAll<HTMLButtonElement>("[data-gender]");
        buttons?.forEach((btn: HTMLButtonElement) => {
          btn.style.backgroundColor = "#333";
        });

        // Подсветка выбранной кнопки
        target.style.backgroundColor = "#ff69b4";
      }

      // Клик по кнопке "Начать игру"
      if (target.id === "play-button") {
        const input = this.formElement.getChildByID("nameField") as HTMLInputElement;
        const name = input?.value.trim();

        if (!name || !this.selectedGender) {
          alert("Пожалуйста, введите имя и выберите пол");
          return;
        }

        // FIX: Remove this later
        console.log("User Data:", { name, gender: this.selectedGender });

        // Скрываем форму
        this.formElement.setVisible(false);
        promptText.setText(`Добро пожаловать, ${name}`);

        // Переход к следующей сцене
        this.time.delayedCall(1000, () => {
          this.scene.start("MainMenu");
        });
      }
    });

    // Анимация появления формы
    this.tweens.add({
      targets: this.formElement,
      y: height / 2,
      duration: 500,
      ease: "Power3",
    });

    EventBus.emit("current-scene-ready", this);
  }
}
