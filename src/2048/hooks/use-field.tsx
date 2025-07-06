import { useGame } from "./use-game";

export const useField = () => {
  const { gameState } = useGame();
  return gameState.field;
};
