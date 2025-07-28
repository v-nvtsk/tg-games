import { getAssetsPathByType } from "$/utils/get-assets-path";

export interface Action {
  type: "thoughts" | "speech" | "choice" | "message" | "button" | "empty";
  characterName?: string;
  text?: string;
  options?: string[];
  button?: {
    text: string;
    action: () => void;
  }
}

export interface EpisodeConfig {
  slideIndex: number;
  filename: string;
  originX?: number;
  originY?: number;
  positionX?: number;
  positionY?: number;
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

  constructor(
    public slideIndex: number,
    public filename: string,
    public scene: string,
    public actions: Action[] = [],
    public originX = 0.5,
    public originY = 0.5,
    public positionX = 0.5,
    public positionY = 0.5,
  ) {
    this.slideIndex = slideIndex;
    this.key = `slide-${slideIndex.toString().padStart(2, "0")}`;
    this.src = getAssetsPathByType({
      type: "images",
      scene: "intro",
      filename: filename,
    });
    this.originX = originX;
    this.originY = originY;
    this.positionX = positionX;
    this.positionY = positionY;
  }
}
