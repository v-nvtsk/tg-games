import { create } from "zustand";
import Phaser from "phaser"; // Для EventEmitter

interface ThoughtOption {
  text: string;
  value: string;
}

interface MoveSceneState {
  isThoughtBubbleVisible: boolean;
  thoughtBubbleMessage: string | null;
  thoughtBubbleOptions: ThoughtOption[];
  thoughtBubblePosition: { x: number;
    y: number } | null;
  onOptionSelected: Phaser.Events.EventEmitter; // EventEmitter для связи с Phaser сценой

  showThoughtBubble: (message: string, options?: ThoughtOption[]) => void;
  hideThoughtBubble: () => void;
  setThoughtBubblePosition: (position: { x: number;
    y: number }) => void;
}

/**
 * Zustand-стор для управления состоянием ThoughtBubble в MoveSceneWrapper.
 */
export const useMoveSceneStore = create<MoveSceneState>((set) => ({
  isThoughtBubbleVisible: false,
  thoughtBubbleMessage: null,
  thoughtBubbleOptions: [],
  thoughtBubblePosition: null,
  onOptionSelected: new Phaser.Events.EventEmitter(),

  showThoughtBubble: (message, options = []) => set({
    isThoughtBubbleVisible: true,
    thoughtBubbleMessage: message,
    thoughtBubbleOptions: options,
  }),
  hideThoughtBubble: () => set({
    isThoughtBubbleVisible: false,
    thoughtBubbleMessage: null,
    thoughtBubbleOptions: [],
  }),
  setThoughtBubblePosition: (position) => set({ thoughtBubblePosition: position }),
}));
