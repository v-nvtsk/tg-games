import { getAssetsPath } from "../../../utils/get-assets-path";
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
    this.load.html("nameform", getAssetsPath("text/nameform/index.html"));
    // this.load.image("map", getAssetsPath("map.png"));
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    this.formElement = this.add.dom(width / 2, height / 2).createFromCache("nameform");

    // this.add.image(width / 2, height / 2, "global/map").setOrigin(0.3, 0.5)
    //   .setScale(0.5)
    //   .setAlpha(0.5);

    // Получаем корневой узел формы
    const formNode = this.formElement.node;

    // === Обработка кликов на уровне DOM ===
    formNode.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLElement;

      // --- Клик по кнопке выбора пола ---
      if (target.closest(".gender-button")) {
        const genderBtn = target.closest(".gender-button") as HTMLButtonElement;
        this.selectedGender = genderBtn.dataset.gender || null;

        // Обновляем стили
        const buttons = formNode.querySelectorAll<HTMLButtonElement>(".gender-button");
        buttons.forEach((btn) => btn.classList.remove("selected"));
        genderBtn.classList.add("selected");

        this.checkFormValidity();
      }

      // --- Клик по кнопке "Начать игру" ---
      if (target.id === "startGameBtn" && !target.classList.contains("disabled")) {
        this.handleStartButtonClick();
      }
    });

    // === Обработка ввода имени ===
    const nameInput = formNode.querySelector("#nameInput") as HTMLInputElement;
    if (nameInput) {
      nameInput.addEventListener("input", () => {
        this.checkFormValidity();
      });

      nameInput.addEventListener("keypress", (e: KeyboardEvent) => {
        if (e.key === "Enter" && !formNode.querySelector("#startGameBtn")?.classList.contains("disabled")) {
          this.handleStartButtonClick();
        }
      });
    }

    // Анимация появления
    this.tweens.add({
      targets: this.formElement,
      y: height / 2,
      duration: 500,
      ease: "Power3",
    });

    EventBus.emit("current-scene-ready", this);
  }

  private checkFormValidity(): void {
    const nameInput = this.formElement.node.querySelector<HTMLInputElement>("#nameInput");
    const genderBtn = this.formElement.node.querySelector<HTMLButtonElement>(".gender-button.selected");
    const startBtn = this.formElement.node.querySelector<HTMLButtonElement>("#startGameBtn");

    if (nameInput && startBtn) {
      if (nameInput.value.trim() && genderBtn) {
        startBtn.classList.remove("disabled");
        startBtn.textContent = "НАЧАТЬ ИГРУ";
      } else {
        startBtn?.classList.add("disabled");
        startBtn.textContent = "ЗАПОЛНИТЕ ВСЕ ПОЛЯ";
      }
    }
  }

  private handleStartButtonClick(): void {
    const nameInput = this.formElement.node.querySelector<HTMLInputElement>("#nameInput");
    const name = nameInput?.value.trim();

    if (!name || !this.selectedGender) return;

    this.formElement.setVisible(false);

    this.add.text(this.scale.width / 2, this.scale.height / 2 - 120, `Добро пожаловать, ${name}`, {
      fontSize: "24px",
      color: "#fff",
      padding: { left: 10, right: 10 },
      wordWrap: { width: window.innerWidth * 0.8 },
      align: "center",
      fontFamily: "Serif",
    }).setOrigin(0.5);

    this.time.delayedCall(1000, () => {
      // TODO: надо удалить все слушатели кнопок и прочих элементов
      this.scene.start("MapScene");
    });
  }
}
