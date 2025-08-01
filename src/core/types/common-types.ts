export interface MoveSceneData {
  scenePrefix?: string;
  fromLocationId?: string;
  toLocationId?: string;
  travelTime?: number;
  targetX: number;
  targetY: number;
  backgroundLayers: SceneBackground;
}

export interface GameMapSceneData {
  currentMapId?: string;
  unlockedRegions?: string[];
  selectedCity: string;
  targetX: number;
  targetY: number;
}

export interface GameFoodLevelData extends Record<string, unknown> {
  levelId?: string;
  currentScore?: number;
  targetScore?: number;
  targetX: number;
  targetY: number;
}

export interface IntroSceneData {
  episodeNumber: number;
}

export interface FlyingGame {
  targetX?: number;
  targetY?: number;
}

export interface DetectiveGameData {
  targetX?: number;
  targetY?: number;
}

export interface SceneDataMap {
  Auth: null;
  Intro: IntroSceneData;
  MoveScene: MoveSceneData;
  GameMap: GameMapSceneData;
  GameFood: GameFoodLevelData;
  Game2048: null;
  FlyingGameScene: FlyingGame;
  MoveToTrain: MoveSceneData | null;
  DetectiveGame: DetectiveGameData;
  RailwayStation: IntroSceneData;
}

export type SceneName = keyof SceneDataMap;

export type SceneData<T extends SceneName> = SceneDataMap[T];

export const GameScene = {
  Auth: "Auth",
  Intro: "Intro",
  GameMap: "GameMap",
  GameFood: "GameFood",
  Game2048: "Game2048",
  Move: "MoveScene",
  FlyingGame: "FlyingGameScene",
  MoveToTrain: "MoveToTrain",
  DetectiveGame: "DetectiveGame",
  RailwayStation: "RailwayStation",
} as const;

export type GameScene = typeof GameScene[keyof typeof GameScene];

export const Gender = {
  Male: "Male",
  Female: "Female",
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export function isGender(value: string): value is Gender {
  return Object.values(Gender).includes(value as Gender);
}

export interface QuizItem {
  id: string;
  text?: string[];
  question: string;
  answers: {
    id: string;
    text: string
  }[];
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
}

export type QuizQuestions = QuizItem[];

export interface SceneBackground {
  background: string | null;
  preBackground: string | null;
  light: string | null;
  front: string | null;
  ground: string;
}

// ✅ Новые типы для универсальной конфигурации слайдов
export interface SlidesSceneConfig {
  scene: string;
  backgroundMusic?: string;
  effects?: {
    canSkipDelay?: number;
    imageLoadDelay?: number;
  };
}

export interface SlidesConfig {
  getSlides: (episode: number) => any[]; // Episode[] - будет импортирован в конкретных файлах
  sceneConfig: SlidesSceneConfig;
}
