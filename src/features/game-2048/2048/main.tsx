import { GameProvider } from "./provider/game-provider";
import { GameContent } from "./components/game-content";

export function Game2048() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
