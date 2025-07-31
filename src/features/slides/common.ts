import { getAssetsPathByType } from "$/utils/get-assets-path";

export interface Action {
  type: "thoughts" | "speech" | "choice" | "message" | "button" | "empty";
  characterName?: string;
  text?: string;
  options?: string[];
  button?: {
    text: string;
    sound?: string;
    action: () => void;
  },
  onNext?: {
    sound?: string
  }
}

export interface EpisodeConfig {
  slideIndex: number;
  filename: string;
  originX?: number;
  originY?: number;
  positionX?: number;
  positionY?: number;
  backgroundSound?: string,
  startSound?: string;
  actions?: Action[];
}

/*
| origin      | position      | translate       | Результат                                     |
| ----------- | ------------- | --------------- | --------------------------------------------- |
| 0.5 / 0.5   | 0.5 / 0.5     | -50 / -50       | по центру                                     |
| **0** / 0.5 | **0** / 0.5   | **0** / -50     | левый край по центру вертикали                |
| **1** / 1   | **0.9** / 0.9 | **-100** / -100 | правый-нижний угол, но «прижат» к 90 % экрана |
*/
export class Episode {
  public key: string;
  public src: string;
  public slideIndex: number;
  public scene: string;
  public actions: Action[];
  public originX: number;
  public originY: number;
  public positionX: number;
  public positionY: number;
  public backgroundSound?: string;
  public startSound?: string;

  constructor(config: EpisodeConfig & { scene: string }) {
    this.slideIndex = config.slideIndex;
    this.scene = config.scene;
    this.key = `slide-${config.slideIndex.toString().padStart(2, "0")}`;

    this.src = getAssetsPathByType({
      type: "images",
      scene: this.scene,
      filename: config.filename,
    });

    this.originX = config.originX ?? 0.5;
    this.originY = config.originY ?? 0.5;
    this.positionX = config.positionX ?? 0.5;
    this.positionY = config.positionY ?? 0.5;

    this.backgroundSound = config.backgroundSound
  ? getAssetsPathByType({
    type: "sounds",
    scene: this.scene,
    filename: config.backgroundSound,
  })
  : undefined;

    this.startSound = config.startSound
  ? getAssetsPathByType({
    type: "sounds",
    scene: this.scene,
    filename: config.startSound,
  })
  : undefined;

    // ✅ нормализуем actions и звуки
    this.actions = (config.actions ?? []).map((a) => ({
      ...a,
      button: a.button
        ? {
          ...a.button,
          sound: a.button.sound
              ? getAssetsPathByType({
                type: "sounds",
                scene: this.scene,
                filename: a.button.sound,
              })
              : undefined,
        }
        : undefined,
      onNext: a.onNext?.sound
        ? {
          sound: getAssetsPathByType({
            type: "sounds",
            scene: this.scene,
            filename: a.onNext.sound,
          }),
        }
        : a.onNext,
    }));
  }
}
