import { useRef, useEffect, useState } from "react";
import type { Episode } from "$features/slides/common";

export function useSlideSounds() {
  const [current, setCurrent] = useState<Episode | null>(null);
  const activeSounds = useRef<HTMLAudioElement[]>([]);
  const bgRef = useRef<HTMLAudioElement | null>(null);

  const playSceneSound = (url?: string): void => {
    if (!url) return;
    const audio = new Audio(url);
    audio.volume = 0.8;
    activeSounds.current.push(audio);
    audio.addEventListener("ended", () => {
      activeSounds.current = activeSounds.current.filter((a) => a !== audio);
    });
    void audio.play().catch(() => void 0);
  };

  useEffect(() => {
    if (!current) return;

    // остановка старого фонового звука
    if (bgRef.current) {
      bgRef.current.pause();
      bgRef.current = null;
    }

    // запуск нового
    if (current.backgroundSound) {
      const bg = new Audio(current.backgroundSound);
      bg.loop = true;
      bg.volume = 0.5;
      void bg.play().catch(() => void 0);
      bgRef.current = bg;
    }

    // стартовый звук
    if (current.startSound) playSceneSound(current.startSound);

    return () => {
      if (bgRef.current) {
        bgRef.current.pause();
        bgRef.current = null;
      }
    };
  }, [current]);

  return { playSceneSound,
    setCurrentSlide: setCurrent };
}
