import { create } from "zustand";

interface IntroSceneState {
  isThoughtBubbleVisible: boolean;
  thoughtBubbleMessage: string | null;
  showThoughtBubble: (message: string) => void;
  hideThoughtBubble: () => void;
}

/**
 * Zustand-стор для управления состоянием ThoughtBubble в IntroSceneWrapper.
 */
export const useIntroSceneStore = create<IntroSceneState>((set) => ({
  isThoughtBubbleVisible: false,
  thoughtBubbleMessage: null,
  showThoughtBubble: (message) => set({ isThoughtBubbleVisible: true,
    thoughtBubbleMessage: message }),
  hideThoughtBubble: () => set({ isThoughtBubbleVisible: false,
    thoughtBubbleMessage: null }),
}));
