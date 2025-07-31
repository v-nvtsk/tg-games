import { useCallback } from "react";
import { getAssetsPathByType } from "../../../utils";
import { useSettingsStore } from "../../state";
import type { GameScene } from "../../types/common-types";

interface HookProps {
  scene: GameScene;
}

export function usePlaySound({ scene }: HookProps) {
  const isSoundEnabled = useSettingsStore((s) => s.isSoundEnabled);

  const playSound = useCallback((filename: string) => {
    if (!isSoundEnabled) return;
    const audio = new Audio(getAssetsPathByType({
      type: "sounds",
      scene: String(scene).toLowerCase(),
      filename,
    }));
    audio.volume = 0.8;
    void audio.play().catch(() => {
      console.error(`Error playing sound: ${filename}`);
    });
  }, [isSoundEnabled, scene]);

  return [playSound] as const;
}
