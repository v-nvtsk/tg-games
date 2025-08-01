import { useEffect } from "react";
import type { Action } from "$features/slides";

const DEFAULT_CAN_SKIP_DELAY = 7000;

interface UseSlideEffectsParams {
  imageLoaded: boolean;
  actionIndex: number;
  currentActions: Action[];
  showSkipButton: boolean;
  setCanSkip: (v: boolean) => void;
  config?: {
    canSkipDelay?: number;
    imageLoadDelay?: number;
  };
}

/**
 * Хук управляет эффектами слайда:
 * - Разрешает пропуск, если нет экшенов
 * - Устанавливает таймер для кнопки "Next"
 */
export function useSlideEffects({
  imageLoaded,
  actionIndex,
  currentActions,
  showSkipButton,
  setCanSkip,
  config,
}: UseSlideEffectsParams): void {

  // ✅ разрешаем пропуск, если нет экшенов
  useEffect(() => {
    if (imageLoaded && actionIndex === -1 && currentActions.length === 0) {
      setCanSkip(true);
    }
  }, [imageLoaded, actionIndex, currentActions.length, setCanSkip]);

  // ✅ таймер для кнопки Skip с настраиваемой задержкой
  useEffect(() => {
    if (showSkipButton) {
      const timeout = config?.canSkipDelay || DEFAULT_CAN_SKIP_DELAY;
      const t = setTimeout(() => setCanSkip(true), timeout);
      return () => clearTimeout(t);
    }
  }, [showSkipButton, imageLoaded, actionIndex, setCanSkip, config?.canSkipDelay]);
}
