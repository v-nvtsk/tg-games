import { create } from "zustand";
import { type SceneName, type SceneDataMap, type SceneBackground } from "@core/types/common-types";
import { useAuthStore } from "./auth-store";
import { logAppError } from "@utils/log-app-error";
import { logActivity } from "$/api/log-activity";
import { getAssetsPathByType, getAssetsPath } from "../../utils";

interface SceneState {
  currentScene: SceneName;
  sceneData: SceneDataMap[SceneName];
  backgroundLayers: SceneBackground | null;

  setScene: <T extends SceneName>(scene: T, data: SceneDataMap[T]) => Promise<void>;
  setBackgroundLayers: (layers: SceneBackground) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  currentScene: "Auth",
  sceneData: null,
  backgroundLayers: {
    background: getAssetsPathByType({ type: "images",
      scene: "move",
      filename: "background.svg" }),
    preBackground: getAssetsPathByType({ type: "images",
      scene: "move",
      filename: "pre-background.svg" }),
    light: getAssetsPathByType({ type: "images",
      scene: "move",
      filename: "light.svg" }),
    front: getAssetsPathByType({ type: "images",
      scene: "move",
      filename: "front.svg" }),
    ground: getAssetsPath("images/platform.png"),
  },

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

  setBackgroundLayers: (layers) => set({ backgroundLayers: layers }),
}));
