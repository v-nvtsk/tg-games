import { useFoodGame } from "../use-food-game";

export const useSelectedFood = () => {
  const { gameState: { inventory } } = useFoodGame();
  return inventory;
};
