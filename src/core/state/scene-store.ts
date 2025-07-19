import { create } from "zustand";
import { type SceneName, type SceneDataMap } from "./scene-types";
import { ActivityLogsApi, Configuration } from "$/api/generated";
import { useAuthStore } from "./auth-store";
import { logAppError } from "../../utils/log-app-error";

interface SceneState {
  currentScene: SceneName;
  sceneData: SceneDataMap[SceneName];

  setScene: <T extends SceneName>(scene: T, data: SceneDataMap[T]) => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSceneStore = create<SceneState>((set, get) => ({
  currentScene: "Intro",
  sceneData: null,

  setScene: async (scene, data) => {

    const previousScene = get().currentScene;

    set({ currentScene: scene, sceneData: data });

    try {
      const { user, sessionId, token } = useAuthStore.getState();

      if (user?.id && sessionId && token) {
        const activityLogsConfig = new Configuration({
          basePath: API_BASE_URL,
          accessToken: () => token,
        });
        const activityLogsApi = new ActivityLogsApi(activityLogsConfig);

        await activityLogsApi.activityLogControllerCreate({
          userId: user.id,
          action: "scene_change",
          details: {
            fromScene: previousScene,
            toScene: scene,
            sceneData: data,
          },
          sessionId: sessionId,
        });
        console.log(`[Scene Change]: Logged scene change from ${previousScene} to: ${scene}`);
      } else {
        console.warn("[Scene Change]: Could not log scene change: user, sessionId, or token not available.");
      }
    } catch (logError: unknown) {
      logAppError("Scene Change Logging", logError);
    }
  },
}));
