import { type PropsWithChildren, useRef, useState, useEffect } from "react";
import { FoodGameLogic, type FoodGameState } from "./food-game-logic";
import { FoodGameContext } from "./food-game-context";
import { getFoodGameState, saveFoodGameState, type FoodGameSaveState } from "../../../api";
import { useAuth } from "../../../hooks/use-auth/use-auth";

export function FoodGameProvider({ children }: PropsWithChildren) {
  const token = useAuth();
  const gameRef = useRef(new FoodGameLogic());
  const [, setGameState] = useState(() => gameRef.current.gameState);

  // Загрузка состояния
  useEffect(() => {
    if (!token) return;

    const loadState = async () => {
      try {
        const savedState = await getFoodGameState(token);
        if (savedState) {
          gameRef.current.gameState = {
            ...gameRef.current.gameState,
            ...savedState,
          };
          setGameState({ ...gameRef.current.gameState });
        }
      } catch (error) {
        console.error("Failed to load game state:", error);
      }
    };

    void loadState();
  }, [token]);

  // Сохранение состояния
  useEffect(() => {
    const game = gameRef.current;
    if (!game || !token) return;

    const listener = (state: FoodGameState) => {
      const saveData: FoodGameSaveState = {
        character: state.character,
        currentRegion: state.currentRegion,
        inventory: state.inventory,
        regions: state.regions,
        score: state.score,
        highScore: state.highScore,
      };

      saveFoodGameState(token, saveData).catch((error) => {
        console.error("Failed to save game state:", error);
      });
    };

    game.subscribe(listener);
    return () => game.unsubscribe(listener);
  }, [token]);

  return (
    <FoodGameContext value={gameRef.current}>
      {children}
    </FoodGameContext>
  );
}
