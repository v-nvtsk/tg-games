import { getAssetsPathByType } from "$/utils";

export interface IntroSlideMeta {
  key: string;
  src: string;
  /** 0‒1 — точка привязки внутри изображения (как object-position). */
  origin: { x: number;
    y: number };
  /** 0‒1 — позиция центра изображения в окне. */
  position: { x: number;
    y: number };
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
      origin: { x: 0.5,
        y: 0.5 },
      position: { x: 0.5,
        y: 0.5 },
    };
  });

  slides[1].origin = {
    x: 0,
    y: 0.5,
  };
  slides[1].position = {
    x: 0,
    y: 0.5,
  };

  slides[2].origin = {
    x: 0.6,
    y: 0.5,
  };
  slides[2].position = {
    x: 0.6,
    y: 0.5,
  };

  slides[3].origin = {
    x: 0.3,
    y: 0.5,
  };
  slides[3].position = {
    x: 0.3,
    y: 0.5,
  };

  slides[10].origin = {
    x: 0.3,
    y: 0.5,
  };
  slides[10].position = {
    x: 0.3,
    y: 0.5,
  };

  slides[11].origin = {
    x: 0.3,
    y: 0.5,
  };
  slides[11].position = {
    x: 0.3,
    y: 0.5,
  };

  return slides;
}
