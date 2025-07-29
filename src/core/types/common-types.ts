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

export interface GameFoodLevelData {
  levelId?: string;
  currentScore?: number;
  targetScore?: number;
  targetX: number;
  targetY: number;
}

export interface IntroSceneData {
  targetX: number;
  targetY: number;
}

export interface FlyingGame{
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
  MoscowMoveScene: MoveSceneData | null;
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
  MoscowMove: "MoveScene",
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
  text: string[];
  question: string;
  answers: { id: string;
    text: string }[];
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
