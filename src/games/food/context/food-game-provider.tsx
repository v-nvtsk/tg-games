// src/games/food/context/food-game-provider.tsx
import { type PropsWithChildren, useRef, useState, useEffect } from "react";
import { FoodGameLogic, type FoodGameState } from "./food-game-logic";
import { FoodGameContext } from "./food-game-context";

export function FoodGameProvider({ children }: PropsWithChildren) {
  const gameRef = useRef(new FoodGameLogic());
  const [, setGameState] = useState(() => gameRef.current.gameState);

  useEffect(() => {
    const listener = (state: FoodGameState) => {
      setGameState({ ...state });
    };
    gameRef.current.subscribe(listener);
    return () => {
      gameRef.current.unsubscribe(listener);
    };
  }, []);

  return (
    <FoodGameContext value={gameRef.current}>
      {children}
    </FoodGameContext>
  );
}
