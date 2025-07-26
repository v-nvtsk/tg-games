import { getAssetsPathByType } from "$/utils";

export interface IntroSlideMeta {
  key: string;
  src: string;
  /** 0‒1 — точка привязки внутри изображения (как object-position). */
  originX: number;
  originY: number ;
  /** 0‒1 — позиция центра изображения в окне. */
  positionX: number;
  positionY: number ;
}

/*
| origin      | position      | translate       | Результат                                     |
| ----------- | ------------- | --------------- | --------------------------------------------- |
| 0.5 / 0.5   | 0.5 / 0.5     | -50 / -50       | по центру                                     |
| **0** / 0.5 | **0** / 0.5   | **0** / -50     | левый край по центру вертикали                |
| **1** / 1   | **0.9** / 0.9 | **-100** / -100 | правый-нижний угол, но «прижат» к 90 % экрана |

*/

export function getIntroSlides(): IntroSlideMeta[] {
  const slides = Array.from({ length: 16 }, (_, i) => {
    const n = (i + 1).toString().padStart(2, "0");
    const key = `slide-${n}`;
    return {
      key,
      src: getAssetsPathByType({
        type: "images",
        scene: "intro",
        filename: `${key}_small.jpg`,
      }),
      originX: 0.5,
      originY: 0.5,
      positionX: 0.5,
      positionY: 0.5,
    };
  });

  slides[1].originX = 0;
  slides[1].positionX = 0;

  slides[2].originX = 0.6;
  slides[2].positionX = 0.6;

  slides[3].originX = 0.3;
  slides[3].positionX = 0.3;

  slides[10].originX = 0.3;
  slides[10].positionX = 0.3;

  slides[11].originX = 0.3;
  slides[11].positionX = 0.3;

  return slides;
}
