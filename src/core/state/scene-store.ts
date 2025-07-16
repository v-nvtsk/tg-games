import { create } from "zustand";
import type { GameScene } from "@/processes/game-flow/game-flow-manager";
import type { SceneDataPayload } from "@/processes/game-flow/game-flow-manager"; // Добавляем импорт SceneDataPayload

interface SceneState {
  currentScene: GameScene | null;
  sceneData: SceneDataPayload | null;
  setCurrentScene: (scene: GameScene, data?: SceneDataPayload) => void;
}

export const useSceneState = create<SceneState>((set) => ({
  currentScene: null,
  sceneData: null,
  setCurrentScene: (scene, data) => set({ currentScene: scene, sceneData: data }),
}));
