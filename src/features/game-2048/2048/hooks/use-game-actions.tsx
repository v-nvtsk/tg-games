import { useCallback } from "react";
import { useGame } from "./use-game";

export const useGameActions = () => {
  const { game } = useGame();
  return {
    moveLeft: useCallback(() => game.moveLeft(), [game]),
    moveRight: useCallback(() => game.moveRight(), [game]),
    moveUp: useCallback(() => game.moveUp(), [game]),
    moveDown: useCallback(() => game.moveDown(), [game]),
    restart: useCallback(() => game.restart(), [game]),
  };
};
