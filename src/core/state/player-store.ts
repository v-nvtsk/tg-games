import { create } from "zustand";

interface PlayerState {
  playerName: string;
  playerGender: "boy" | "girl" | null;
  setPlayerName: (name: string) => void;
  setPlayerGender: (gender: "boy" | "girl" | null) => void;
  resetPlayerState: () => void; // Можно добавить для сброса состояния
}

export const usePlayerState = create<PlayerState>((set) => ({
  playerName: "",
  playerGender: null,
  setPlayerName: (name) => set({ playerName: name }),
  setPlayerGender: (gender) => set({ playerGender: gender }),
  resetPlayerState: () => set({ playerName: "", playerGender: null }),
}));
