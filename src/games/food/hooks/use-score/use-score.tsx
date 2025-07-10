import { useFoodGame } from "../use-food-game";

export const useScore = () => {
  const { gameState: { score, highScore } } = useFoodGame();
  return { score, highScore };
};
