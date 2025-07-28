import { getAssetsPathByType } from "$/utils";
import type { ThoughtBubblePosition } from "../../components";

export interface Action {
  type: "thoughts" | "speech" | "choice" | "message" | "button" | "empty";
  characterName: string;
  text?: string;
  options?: string[];
  button?: {
    text: string;
    action: () => void;
  }
}

export interface IntroSlideMeta {
  key: string;
  src: string;
  /** 0‒1 — точка привязки внутри изображения (как object-position). */
  originX: number;
  originY: number;
  /** 0‒1 — позиция центра изображения в окне. */
  positionX: number;
  positionY: number;
  message?: string | string[];
  buttonText?: string;
  thoughtBubbleText?: string;
  thoughtBubbleMessage?: {
    text: string;
    position: ThoughtBubblePosition
  };
  actions?: Action[];
  action?: () => void;
}

interface EpisodeConfig {
  slideIndex: number;
  filename: string;
  originX?: number;
  originY?: number;
  positionX?: number;
  positionY?: number;
  actions?: Action[];
}

const episodeConfigs: EpisodeConfig[] = [
  {
    slideIndex: 1,
    filename: "frame-36.jpg",
    originX: 0,
    positionX: 0,
    actions: [{
      type: "message",
      characterName: "Алексей",
      text: "Ты дома. Это твоя комната. Вроде ничего необычного: чай, уроки, лень. Но на столе — коробка. Почта. Отправитель не указан.",
    }],
  },
  {
    slideIndex: 2,
    filename: "frame-28.jpg",
    originX: 0.7,
    positionX: 0.7,
  },
  {
    slideIndex: 3,
    filename: "frame-27.jpg",
    actions: [{
      type: "thoughts",
      characterName: "Алексей",
      text: "«Да ладно. Это точно дед...»",
    }],
  },
  {
    slideIndex: 4,
    filename: "frame-29.jpg",
  },
  {
    slideIndex: 5,
    filename: "frame-25.jpg",
    actions: [{
      type: "thoughts",
      characterName: "Алексей",
      text: `В коробке — всё по-дедовски: аккуратно, но неформально. Карта выглядит как будто её уже кто-то прошёл. Дневник — почти пустой. Кассета — с подписью: "Старт. Не трогай, если не готов."`,
    }],
  },
  {
    slideIndex: 6,
    filename: "frame-31.jpg",
  },
  {
    slideIndex: 7,
    filename: "frame-30.jpg",
    actions: [
      {
        type: "thoughts",
        characterName: "Алексей",
        text: "«Типичный дед. \"Не трогай\" — значит, включай немедленно.»",
      },
      {
        type: "button",
        characterName: "Алексей",
        button: {
          text: "▶ «Включить кассету»",
          action: () => {
            console.log("Включить кассету");
          },
        },
      },
    ],
  },
  {
    slideIndex: 8,
    filename: "frame-25.jpg",
    originX: 0.3,
    positionX: 0.3,
    actions: [
      {
        type: "message",
        characterName: "Кассета",
        text: "«О! Ну ты и правда открыл это? Так и знал, что хватит смелости.......»",
      },
    ],
  },
  {
    slideIndex: 9,
    filename: "frame-31.jpg",
  },
  {
    slideIndex: 10,
    filename: "frame-30.jpg",
    actions: [{
      type: "thoughts",
      characterName: "Алексей",
      text: "«Дед, ну ты даёшь. Это что, твоя старая шутка или реальная головоломка?»",
    }],
  },
  {
    slideIndex: 11,
    filename: "frame-25.jpg",
    originX: 0.3,
    positionX: 0.3,
    actions: [{
      type: "message",
      characterName: "Кассета",
      text: "«Да, таких улиц много. Но одна из них — правильная. Начни с неё. Не торопись. Смотри по сторонам.»",
    }],
  },
  {
    slideIndex: 12,
    filename: "frame-34.jpg",
    actions: [
      {
        type: "message",
        characterName: "Кассета",
        text: "«Ты ищешь не клад, Алексей. Ты ищешь меня. Я оставил подсказки на улицах Солнечных по всей стране. Ищи людей. Они подскажут путь. Там, где тепло и светло, там и правда.»",
      },
      {
        type: "choice",
        characterName: "Алексей",
        options: [
          "«Похоже на квест...»",
          "«Ну... допустим...»",
          "«Ладно, дед...»",
          "«Начну записывать...»"
        ],
      },
    ],
  },
  {
    slideIndex: 11,
    filename: "frame-35.jpg",
    actions: [
      {
        type: "thoughts",
        characterName: "Алексей",
        text: "Что делать, нужно собираться",
      },
      {
        type: "button",
        characterName: "Алексей",
        button: {
          text: "▶ «Начать путь»",
          action: () => {
            console.log("Начать путь");
          },
        },
      },
    ],
  },
];

class Episode implements IntroSlideMeta {
  public key: string;
  public src: string;
  public action?: () => void;

  constructor(
    public slideNumber: number,
    public filename: string,
    public actions: Action[] = [{
      type: "empty",
      characterName: "Алексей",
    }],
    public originX: number = 0.5,
    public originY: number = 0.5,
    public positionX: number = 0.5,
    public positionY: number = 0.5,
  ) {
    this.slideNumber = slideNumber;
    this.key = `slide-${slideNumber.toString().padStart(2, "0")}`;
    this.src = getAssetsPathByType({
      type: "images",
      scene: "intro",
      filename: filename,
    });
    this.originX = originX;
    this.originY = originY;
    this.positionX = positionX;
    this.positionY = positionY;
    if (actions) {
      this.actions = this.actions.concat(actions);
    }
  }
}

/*
| origin      | position      | translate       | Результат                                     |
| ----------- | ------------- | --------------- | --------------------------------------------- |
| 0.5 / 0.5   | 0.5 / 0.5     | -50 / -50       | по центру                                     |
| **0** / 0.5 | **0** / 0.5   | **0** / -50     | левый край по центру вертикали                |
| **1** / 1   | **0.9** / 0.9 | **-100** / -100 | правый-нижний угол, но «прижат» к 90 % экрана |

*/

export function getIntroSlides(): IntroSlideMeta[] {
  const episodes: Episode[] = [];
  // Применяем конфигурации к эпизодам
  episodeConfigs.forEach((config) => {
    const episode = new Episode(config.slideIndex, config.filename, config.actions, config.originX, config.originY, config.positionX, config.positionY);
    episodes.push(episode);

    if (config.originX !== undefined) episode.originX = config.originX;
    if (config.originY !== undefined) episode.originY = config.originY;
    if (config.positionX !== undefined) episode.positionX = config.positionX;
    if (config.positionY !== undefined) episode.positionY = config.positionY;
  });

  return episodes;
}
