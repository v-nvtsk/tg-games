import { useState, useCallback, useMemo } from "react";
import { Episode } from "$features/slides/common";
import type { Action } from "$features/slides";
import { useSceneStore } from "../../core/state/scene-store";

export function useSlidesNavigation(
  slides: Episode[],
  playSceneSound: (url?: string) => void,
) {
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [actionIndex, setActionIndex] = useState<number>(-1);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [canSkip, setCanSkip] = useState<boolean>(false);

  const currentSlide: Episode = slides[slideIndex];

  const currentActions: Action[] = useMemo(() => currentSlide.actions ?? [], [currentSlide]);
  const currentAction: Action | null =
    actionIndex >= 0 && actionIndex < currentActions.length ? currentActions[actionIndex] : null;

  const processUpdate = useCallback(() => {
    const nextSound: string | undefined = currentAction?.onNext?.sound;
    if (nextSound) playSceneSound(nextSound);

    if (currentActions.length > 0 && actionIndex < currentActions.length - 1) {
      setActionIndex((i) => i + 1);
    } else if (slideIndex < slides.length - 1) {
      setSlideIndex((i) => i + 1);
      setActionIndex(-1);
      setImageLoaded(false); // ✅ добавляем сброс
    } else {
      useSceneStore.getState().setSlidesConfig(undefined);
      setSlideIndex(0);
      setActionIndex(-1);
      setImageLoaded(false);
    }
  }, [actionIndex, currentActions, slideIndex, slides, currentAction, playSceneSound]);

  const goNext = useCallback(() => {
    if (!canSkip) return;
    setCanSkip(false);
    processUpdate();
  }, [canSkip, processUpdate]);

  const handleActionButtonClick = useCallback((action: Action) => {
    if (action.button?.sound) playSceneSound(action.button.sound);
    action.button?.action?.();
    processUpdate();
  }, [processUpdate, playSceneSound]);

  const handleChoiceSelect = useCallback((option: string, idx: number) => {
    // ✅ Проверяем, есть ли условные действия для выбранного варианта
    if (currentAction?.conditionalActions?.[idx]) {
      // ✅ Вставляем условные действия после текущего действия
      const updated = [...currentActions];
      const conditionalActions = currentAction.conditionalActions[idx];
      updated.splice(actionIndex + 1, 0, ...conditionalActions);
      
      // ✅ Обновляем действия в текущем слайде (временное решение)
      // В идеале это должно быть в store, но пока используем локальное состояние
      currentSlide.actions = updated;
    } else {
      // ✅ Fallback: добавляем thoughts действие с выбранным текстом (как было раньше)
      const updated = [...currentActions];
      updated.splice(actionIndex + 1, 0, { 
        type: "thoughts",
        text: option 
      });
      currentSlide.actions = updated;
    }
    
    processUpdate();
  }, [currentActions, actionIndex, processUpdate, currentAction, currentSlide]);

  return {
    slideIndex,
    actionIndex,
    currentSlide,
    currentAction,
    currentActions,
    imageLoaded,
    setImageLoaded,
    canSkip,
    setCanSkip,
    goNext,
    handleActionButtonClick,
    handleChoiceSelect,
  };
}
