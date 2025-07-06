import { use, useEffect, useState } from "react";
import { type GameState } from "../provider/game-provider";
import { GameContext } from "../context/game-context";

export const useGame = () => {
  const game = use(GameContext);
  if (game === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }

  const [gameState, setGameState] = useState<GameState>(() => ({
    ...game.state,
    field: game.state.field.map((row) => row.map((item) => ({ ...item }))),
  }));

  useEffect(() => {
    const listener = (state: GameState) => {
      setGameState(state);
    };

    game.subscribe(listener);

    return () => {
      game.unsubscribe(listener);
    };
  }, [game]);

  return { game, gameState };
};
