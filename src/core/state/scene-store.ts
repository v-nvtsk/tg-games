import { create } from "zustand";
import { type SceneName, type SceneDataMap, type SceneBackground, type SlidesConfig } from "@core/types/common-types";
import { useAuthStore } from "./auth-store";
import { logAppError } from "@utils/log-app-error";
import { logActivity } from "$/api/log-activity";

interface SceneState {
  currentScene: SceneName;
  sceneData: SceneDataMap[SceneName];
  backgroundLayers: SceneBackground | null;

  slidesConfig?: SlidesConfig;

  /** === Методы === */
  setScene: <T extends SceneName>(scene: T, data: SceneDataMap[T]) => Promise<void>;
  setBackgroundLayers: (layers: SceneBackground) => void;
  setSlidesConfig: (config?: SlidesConfig) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  currentScene: "Auth",
  sceneData: null,
  backgroundLayers: null,
  slidesConfig: undefined,

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

  setSlidesConfig: (config) => set({ slidesConfig: config }),
}));
