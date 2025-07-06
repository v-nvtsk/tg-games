// src/2048/hooks/use-game-input.tsx
import { useEffect } from "react";
import { useGameActions } from "./use-game-actions";

export const useGameInput = () => {
  const { moveLeft, moveRight, moveUp, moveDown } = useGameActions();

  useEffect(() => {
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

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("keydown", keyListener);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [moveLeft, moveRight, moveUp, moveDown]);
};
