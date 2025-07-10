import { use, useEffect, useState } from "react";
import { FoodGameContext } from "../../context/food-game-context";
import { type FoodGameState } from "../../context/food-game-logic";

export const useFoodGame = () => {
  const game = use(FoodGameContext);

  if (game === undefined) {
    throw new Error("useFoodGame must be used within a FoodGameProvider");
  }

  const [gameState, setGameState] = useState<FoodGameState>(() => game.gameState);

  useEffect(() => {
    const listener = (state: FoodGameState) => {
      setGameState(state);
    };

    game.subscribe(listener);
    return () => game.unsubscribe(listener);
  }, [game]);

  return { game, gameState };
};

// Новый хук для работы с персонажем
export const useCharacter = () => {
  const { gameState } = useFoodGame();
  return gameState.character;
};

// Хук для работы с регионом
export const useCurrentRegion = () => {
  const { gameState } = useFoodGame();
  return gameState.regions[gameState.currentRegion];
};

// Хук для работы с инвентарем
export const useInventory = () => {
  const { gameState } = useFoodGame();
  return gameState.inventory;
};
