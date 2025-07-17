// src/core/state/scene-store.ts (обновленный)
import { create } from "zustand";
import { type SceneName, type SceneDataMap } from "./scene-types";

interface SceneState {
  currentScene: SceneName;
  sceneData: SceneDataMap[SceneName]; // Используем SceneDataMap
  setScene: <T extends SceneName>(scene: T, data: SceneDataMap[T]) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: "Intro",
  sceneData: null,
  setScene: (scene, data) => set({ currentScene: scene, sceneData: data }),
}));
