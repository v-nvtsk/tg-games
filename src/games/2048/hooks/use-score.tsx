import { useGame } from "./use-game";

export const useScore = () => {
  const { gameState } = useGame();
  return { score: gameState.score, highScore: gameState.highScore };
};
