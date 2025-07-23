import { create } from "zustand";
import { type SceneName, type SceneDataMap } from "@core/types/common-types";
import { useAuthStore } from "./auth-store";
import { logAppError } from "@utils/log-app-error";
import { logActivity } from "$/api/log-activity";

interface SceneState {
  currentScene: SceneName;
  sceneData: SceneDataMap[SceneName];

  setScene: <T extends SceneName>(scene: T, data: SceneDataMap[T]) => Promise<void>;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  currentScene: "Auth",
  sceneData: null,

  setScene: async (scene, data) => {

    const previousScene = get().currentScene;

    set({ currentScene: scene,
      sceneData: data });

    try {
      const { user, sessionId, token } = useAuthStore.getState();

      if (user?.id && sessionId && token) {
        await logActivity("scene_change", {
          userId: user.id,
          sessionId,
          action: "scene_change",
          fromScene: previousScene,
          toScene: scene,
          sceneData: data,
        }, scene);

        console.log(`[Scene Change]: Logged scene change from ${previousScene} to: ${scene}`);
      } else {
        console.warn("[Scene Change]: Could not log scene change: user, sessionId, or token not available.");
      }
    } catch (logError: unknown) {
      logAppError("Scene Change Logging", logError);
    }
  },
}));
