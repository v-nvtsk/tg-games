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

    return () => {
      game.unsubscribe(listener);
    };
  }, [game]);

  return { game, gameState };
};
