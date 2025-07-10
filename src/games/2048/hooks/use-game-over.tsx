import { useGame } from "./use-game";

export const useGameOver = () => {
  const { gameState } = useGame();
  return gameState.over;
};
