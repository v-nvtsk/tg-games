import { getAssetsPathByType } from "$/utils";
import type { ThoughtBubblePosition } from "../../components";

export interface IntroSlideMeta {
  key: string;
  src: string;
  /** 0‒1 — точка привязки внутри изображения (как object-position). */
  originX: number;
  originY: number ;
  /** 0‒1 — позиция центра изображения в окне. */
  positionX: number;
  positionY: number ;
  message?: string | string[];
  buttonText?: string;
  thoughtBubbleText?: string;
  thoughtBubbleMessage?: {
    text: string;
    position: ThoughtBubblePosition
  };
  action?: () => void;
}

/*
| origin      | position      | translate       | Результат                                     |
| ----------- | ------------- | --------------- | --------------------------------------------- |
| 0.5 / 0.5   | 0.5 / 0.5     | -50 / -50       | по центру                                     |
| **0** / 0.5 | **0** / 0.5   | **0** / -50     | левый край по центру вертикали                |
| **1** / 1   | **0.9** / 0.9 | **-100** / -100 | правый-нижний угол, но «прижат» к 90 % экрана |

*/

export function getIntroSlides(): IntroSlideMeta[] {

  /*

*/

  const files = [
    "frame-36.jpg", // 00
    "frame-28.jpg", // 01
    "frame-27.jpg", // 02
    "frame-29.jpg", // 03
    "frame-25.jpg", // 04
    "frame-25.jpg", // 05
    "frame-31.jpg", // 06
    "frame-30.jpg", // 07
    "frame-30.jpg", // 08
    "frame-25.jpg", // 09
    "frame-31.jpg", // 10
    "frame-30.jpg", // 11
    "frame-25.jpg", // 12
    "frame-34.jpg", // 13
    "frame-34.jpg", // 14
    "frame-34.jpg", // 15
    "frame-35.jpg", // 16
    "frame-35.jpg", // 17
  ];

  const slides: IntroSlideMeta[] = Array.from({ length: files.length }, (_, i) => {
    const n = (i + 1).toString().padStart(2, "0");
    const key = `slide-${n}`;
    return {
      key,
      src: getAssetsPathByType({
        type: "images",
        scene: "intro",
        filename: `${files[i]}`,
      }),
      originX: 0.5,
      originY: 0.5,
      positionX: 0.5,
      positionY: 0.5,
    };
  });

  slides[1].originX = 0;
  slides[1].positionX = 0;

  slides[2].originX = 0.7;
  slides[2].positionX = 0.7;

  slides[3].originX = 0.5;
  slides[3].positionX = 0.5;

  slides[8].originX = 0.3;
  slides[8].positionX = 0.3;

  slides[9].originX = 0.3;
  slides[9].positionX = 0.3;

  slides[10].originX = 0.3;
  slides[10].positionX = 0.3;

  slides[11].originX = 0;
  slides[11].positionX = 0;

  slides[1].message = ["Ты дома. Это твоя комната. Вроде ничего необычного: чай, уроки, лень.",
    "Но на столе — коробка. Почта. Отправитель не указан."];

  slides[9].message = ["Голос деда:«О! Ну ты и правда открыл это? Так и знал, что хватит смелости......"];

  slides[12].message = ["Да, таких улиц много. Но одна из них — правильная.",
    "Начни с неё. Не торопись. Смотри по сторона......"];

  slides[14].message = ["«Ты ищешь не клад, Алексей. Ты ищешь меня. Я оставил подсказки на улицах Солнечных по всей стране. Ищи людей. Они подскажут путь. Там, где тепло и светло, там и правда.»"];

  slides[3].thoughtBubbleMessage = {
    text: "Да ладно. Это точно дед. Только он мог прислать что-то без объяснений. И с интригой.»",
    position: "bottomRight",
  };

  slides[5].thoughtBubbleMessage = {
    text: `В коробке — всё по-дедовски: аккуратно, но неформально.
Карта выглядит как будто её уже кто-то прошёл. Дневник — почти пустой.
Кассета — с подписью: “Старт. Не трогай, если не готов.”`,
    position: "topLeft",
  };

  slides[7].thoughtBubbleMessage = { text: "«Типичный дед. “Не трогай” — значит, включай немедленно.»",
    position: "bottomRight",
  };

  slides[11].thoughtBubbleMessage = { text: "«Дед, ну ты даёшь. Это что, твоя старая шутка или реальная головоломка?»",
    position: "bottomRight",
  };

  slides[17].thoughtBubbleMessage = { text: "Что делать, нужно собираться",
    position: "topLeft",
  };

  slides[8].buttonText = "▶ «Включить кассету»";

  return slides;
}
