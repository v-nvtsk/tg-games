import { use, useEffect, useState } from "react";
import { type GameState } from "../provider/game-provider";
import { GameContext } from "../context/game-context";

export const useGame = () => {
  const game = use(GameContext);
  if (game === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }

  // Используем глубокую копию состояния, чтобы React видел изменения вложенных объектов
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...game.state,
    field: game.state.field.map((row) => row.map((item) => ({ ...item }))),
  }));

  useEffect(() => {
    const listener = (state: GameState) => {
      // Обновляем состояние React при изменении состояния игры
      setGameState(state);
    };

    game.subscribe(listener);

    return () => {
      game.unsubscribe(listener);
    };
  }, [game]); // 'game' - единственная зависимость, она не меняется после первого рендера

  return { game, gameState };
};
