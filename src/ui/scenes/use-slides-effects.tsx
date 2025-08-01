import { useEffect } from "react";
import type { Action } from "$features/slides";
import { GameConstants } from "../../core/constants/constants";

interface UseSlideEffectsParams {
  imageLoaded: boolean;
  actionIndex: number;
  currentActions: Action[];
  showSkipButton: boolean;
  setCanSkip: (v: boolean) => void;
  config?: {
    canSkipDelay?: boolean;
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
  // currentActions,
  showSkipButton,
  setCanSkip,
  config,
}: UseSlideEffectsParams): void {

  // // ✅ разрешаем пропуск, если нет экшенов
  // useEffect(() => {
  //   if (imageLoaded && actionIndex === -1 && currentActions.length === 0) {
  //     setCanSkip(true);
  //   }
  // }, [imageLoaded, actionIndex, currentActions.length, setCanSkip]);

  // ✅ таймер для кнопки Skip с настраиваемой задержкой
  useEffect(() => {
    if (showSkipButton) {
      const timeout = config?.canSkipDelay ? 0 : GameConstants.SLIDE_TIMEOUT;
      const t = setTimeout(() => setCanSkip(true), timeout);
      return () => clearTimeout(t);
    }
  }, [showSkipButton, imageLoaded, actionIndex, setCanSkip, config?.canSkipDelay]);
}
