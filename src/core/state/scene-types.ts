export interface MoveSceneData {
  fromLocationId?: string;
  toLocationId?: string;
  travelTime?: number;
  targetX: number;
  targetY: number;
}

export interface GameMapSceneData {
  currentMapId?: string;
  unlockedRegions?: string[];
  selectedCity: string;
  targetX: number;
  targetY: number;
}

export interface FoodGameLevelData {
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

export interface SceneDataMap {
  Auth: null;
  Intro: IntroSceneData;
  MoveScene: MoveSceneData;
  GameMap: GameMapSceneData;
  FoodGame: FoodGameLevelData;
  Game2048: null;
}

export type SceneName = keyof SceneDataMap;

export type SceneData<T extends SceneName> = SceneDataMap[T];
