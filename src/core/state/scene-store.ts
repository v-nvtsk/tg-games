import { create } from "zustand";
import { type SceneName, type SceneDataMap, type SceneBackground, type GameScene } from "@core/types/common-types";
import { useAuthStore } from "./auth-store";
import { logAppError } from "@utils/log-app-error";
import { logActivity } from "$/api/log-activity";
import type { Episode } from "$features/slides";

interface SceneState {
  currentScene: SceneName;
  sceneData: SceneDataMap[SceneName];
  backgroundLayers: SceneBackground | null;

  slidesConfig?: () => Episode[];
  slidesScene?: GameScene;

  /** === Методы === */
  setScene: <T extends SceneName>(scene: T, data: SceneDataMap[T]) => Promise<void>;
  setBackgroundLayers: (layers: SceneBackground) => void;
  setSlidesConfig: (config?: () => Episode[], scene?: GameScene) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  currentScene: "Auth",
  sceneData: null,
  backgroundLayers: null,
  slidesConfig: undefined,
  slidesScene: undefined,

  setScene: async (scene, data) => {
    const prevScene = get().currentScene;
    set({ currentScene: scene,
      sceneData: data });

    try {
      const { user, sessionId, token } = useAuthStore.getState();

      if (user?.id && sessionId && token) {
        await logActivity("scene_change", {
          userId: user.id,
          sessionId,
          action: "scene_change",
          fromScene: prevScene,
          toScene: scene,
          sceneData: data,
        }, scene);

        console.log(`[Scene Change]: ${prevScene} → ${scene}`);
      } else {
        console.warn("[Scene Change]: Activity not logged (no user/session/token).");
      }
    } catch (err: unknown) {
      logAppError("Scene Change Logging", err);
    }
  },

  setBackgroundLayers: (layers) => set({ backgroundLayers: layers }),

  setSlidesConfig: (config, scene) => set({
    slidesConfig: config,
    slidesScene: scene,
  }),
}));
