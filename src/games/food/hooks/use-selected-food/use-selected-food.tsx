import { useFoodGame } from "../use-food-game";

export const useSelectedFood = () => {
  const { gameState: { selectedFood } } = useFoodGame();
  return selectedFood;
};
