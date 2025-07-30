import { create } from "zustand";
import { apiClient } from "$/api";
import type { SceneName } from "@core/types/common-types";
import { logAppError } from "@utils/log-app-error";

interface PlayerState {
  playerName: string;
  playerGender: "boy" | "girl" | null;
  energy: number;
  hunger: number;
  currentScene: SceneName | null;
  currentEpisode: string | number | null;
  hiddenScenes: SceneName[];

  setPlayerName: (name: string) => void;
  setPlayerGender: (gender: "boy" | "girl" | null) => void;

  setEnergy: (value: number) => void;
  setHunger: (value: number) => void;
  setProgress: (scene: SceneName, episode: number) => void;
  hideScene: (scene: SceneName) => void;

  loadPlayerState: () => Promise<void>;
  savePlayerState: () => Promise<void>;
  saveGameProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;
}

export const usePlayerState = create<PlayerState>((set, get) => ({
  playerName: "",
  playerGender: null,
  energy: 100,
  hunger: 0,
  currentScene: null,
  currentEpisode: null,
  hiddenScenes: [],

  setPlayerName: (name) => set({ playerName: name }),
  setPlayerGender: (gender) => set({ playerGender: gender }),

  setEnergy: (value) => {
    set({ energy: value });
    get().savePlayerState()
      .catch((err) => logAppError("autoSaveEnergy", err));
  },

  setHunger: (value) => {
    set({ hunger: value });
    get().savePlayerState()
      .catch((err) => logAppError("autoSaveHunger", err));
  },

  setProgress: (scene, episode) => {
    set({ currentScene: scene,
      currentEpisode: episode });
    get().saveGameProgress()
      .catch((err) => logAppError("autoSaveProgress", err));
  },

  hideScene: (scene) => {
    set((state) => ({ hiddenScenes: [...state.hiddenScenes, scene] }));
    get().saveGameProgress()
      .catch((err) => logAppError("autoSaveHiddenScene", err));
  },

  /** 🔹 Загрузка состояния игрока с сервера */
  loadPlayerState: async () => {
    try {
      const [playerRes, progressRes] = await Promise.all([
        apiClient.gameState.gameStateControllerGetPlayerState(),
        apiClient.gameState.gameStateControllerGetGameProgress(),
      ]);

      const player = playerRes.data;
      const progress = progressRes.data;

      if (!player || !progress) {
        return;
      }

      /*
      TODO:
        Бэкенд сейчас не хранит / не возвращает текущее состояние прохождения игры

        Необходимо добавить:

          currentScene
          currentEpisode
          hiddenScenes
      */

      console.error("TODO: ", "Бэкенд сейчас не хранит / не возвращает текущее состояние прохождения игры");

      set({
        energy: player.energy,
        hunger: player.hunger,
        currentScene: progress.currentScene as SceneName || null,
        currentEpisode: progress.currentEpisode ? Number(progress.currentEpisode) : null,
        hiddenScenes: progress.hiddenScenes as SceneName[] || [],
      });
    } catch (err) {
      logAppError("loadPlayerState", err);
    }
  },

  /** 🔹 Сохранение состояния игрока */
  savePlayerState: async () => {
    try {
      const { energy, hunger } = get();
      await apiClient.gameState.gameStateControllerUpdatePlayerState({ energy,
        hunger });
    } catch (err) {
      logAppError("savePlayerState", err);
    }
  },

  /** 🔹 Сохранение прогресса игры */
  saveGameProgress: async () => {
    try {
      const { currentScene, currentEpisode, hiddenScenes } = get();
      await apiClient.gameState.gameStateControllerUpdateGameProgress({
        currentScene: currentScene || "",
        data: { currentEpisode,
          hiddenScenes },
      });
    } catch (err) {
      logAppError("saveGameProgress", err);
    }
  },

  /** 🔹 Дев-функция сброса прогресса */
  resetProgress: async () => {
    try {
      await Promise.all([
        apiClient.gameState.gameStateControllerDeletePlayerState(),
        apiClient.gameState.gameStateControllerDeleteGameProgress(),
      ]);
      set({
        energy: 100,
        hunger: 0,
        currentScene: null,
        currentEpisode: null,
        hiddenScenes: [],
      });
    } catch (err) {
      logAppError("resetProgress", err);
    }
  },
}));
