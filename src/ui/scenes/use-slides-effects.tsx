import { useEffect } from "react";
import type { Action } from "$features/slides";

const SLIDE_TIMEOUT = 100;

interface UseSlideEffectsParams {
  imageLoaded: boolean;
  actionIndex: number;
  currentActions: Action[];
  showSkipButton: boolean;
  setCanSkip: (v: boolean) => void;
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
}: UseSlideEffectsParams): void {

  // ✅ разрешаем пропуск, если нет экшенов
  useEffect(() => {
    if (imageLoaded && actionIndex === -1 && currentActions.length === 0) {
      setCanSkip(true);
    }
  }, [imageLoaded, actionIndex, currentActions.length, setCanSkip]);

  // ✅ таймер для кнопки Skip
  useEffect(() => {
    if (showSkipButton) {
      const t = setTimeout(() => setCanSkip(true), SLIDE_TIMEOUT);
      return () => clearTimeout(t);
    }
  }, [showSkipButton, imageLoaded, actionIndex, setCanSkip]);
}
