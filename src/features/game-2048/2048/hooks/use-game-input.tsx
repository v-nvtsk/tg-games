import { useEffect, type RefObject } from "react";
import { useGameActions } from "./use-game-actions";

export const useGameInput = (fieldRef: RefObject<HTMLElement | null>) => {
  const { moveLeft, moveRight, moveUp, moveDown } = useGameActions();

  useEffect(() => {
    const fieldElement = fieldRef.current;
    if (!fieldElement) {
      return;
    }

    const keyListener = (e: KeyboardEvent) => {
      switch (e.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
        break;
      default:
        return;
      }
    };

    document.addEventListener("keydown", keyListener);

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;

      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      const minSwipeDistance = 30;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipeDistance) {
        if (dx > 0) {
          moveRight();
        } else {
          moveLeft();
        }
      } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipeDistance) {
        if (dy > 0) {
          moveDown();
        } else {
          moveUp();
        }
      }
      touchStartX = 0;
      touchStartY = 0;
      touchEndX = 0;
      touchEndY = 0;
    };

    fieldElement.addEventListener("touchstart", handleTouchStart, { passive: false });
    fieldElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    fieldElement.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("keydown", keyListener);
      fieldElement.removeEventListener("touchstart", handleTouchStart);
      fieldElement.removeEventListener("touchmove", handleTouchMove);
      fieldElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [fieldRef, moveLeft, moveRight, moveUp, moveDown]);
};
