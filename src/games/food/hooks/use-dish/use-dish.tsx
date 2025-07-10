import { useFoodGame } from "../use-food-game";

export const useDish = () => {
  const { gameState: { dish } } = useFoodGame();
  return dish;
};
