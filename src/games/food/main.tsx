import { FoodGameProvider } from "./context/food-game-provider";
import { GameContent } from "./components/game-content";

export function FoodGame() {
  return (
    <FoodGameProvider>
      <GameContent />
    </FoodGameProvider>
  );
}
