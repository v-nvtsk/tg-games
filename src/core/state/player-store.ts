import { create } from "zustand";
import { apiClient } from "$/api";
import type { SceneName } from "@core/types/common-types";
import { logAppError } from "@utils/log-app-error";

interface PlayerState {
  playerName: string;
  playerGender: "boy" | "girl" | null;
  energy: number;
  hunger: number;
  checkPoint: string | null;

  setPlayerName: (name: string) => void;
  setPlayerGender: (gender: "boy" | "girl" | null) => void;

  setEnergy: (value: number) => void;
  setHunger: (value: number) => void;

  increaseEnergy: () => void;
  decreaseEnergy: () => void;

  setProgress: (scene: SceneName, episode: number) => void;

  loadPlayerState: () => Promise<void>;
  savePlayerState: () => Promise<void>;
  saveGameProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;
}

export const usePlayerState = create<PlayerState>((set, get) => ({
  playerName: "",
  playerGender: null,
  energy: 20,
  hunger: 0,
  checkPoint: null,

  setPlayerName: (name) => set({ playerName: name }),
  setPlayerGender: (gender) => set({ playerGender: gender }),

  setEnergy: (value) => {
    set({ energy: value });
    get().savePlayerState()
      .catch((err) => logAppError("autoSaveEnergy", err));
  },

  increaseEnergy() {
    if (get().energy < 20) {
      set((state) => ({ energy: state.energy + 1 }));
      get().savePlayerState()
        .catch((err) => logAppError("autoSaveEnergy", err));
    }
  },

  decreaseEnergy() {
    if (get().energy > 1) {
      set((state) => ({ energy: state.energy - 1 }));
      get().savePlayerState()
        .catch((err) => logAppError("autoSaveEnergy", err));
    }
  },

  setHunger: (value) => {
    set({ hunger: value });
    get().savePlayerState()
      .catch((err) => logAppError("autoSaveHunger", err));
  },

  setProgress: (checkPoint) => {
    set({ checkPoint });
    get().saveGameProgress()
      .catch((err) => logAppError("autoSaveProgress", err));
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

      set({
        energy: player.energy,
        hunger: player.hunger,
        checkPoint: progress.currentScene as SceneName || null,
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
      const { checkPoint } = get();
      await apiClient.gameState.gameStateControllerUpdateGameProgress({
        currentScene: checkPoint || "",
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
        checkPoint: null,
      });
    } catch (err) {
      logAppError("resetProgress", err);
    }
  },
}));
