// === ./src/games/food/components/game-content/game-content.tsx ===
import { useState } from "react";
import { useFoodGame } from "../../hooks/use-food-game";
import { CharacterSelector } from "../character-selector";
import { RegionScreen } from "../region-screen";
import { CharacterStats } from "../character-stats";
import { Inventory } from "../inventory";
import { QuizScreen } from "../quiz-screen";

export function GameContent() {
  const { game, gameState } = useFoodGame();
  const [characterSelected, setCharacterSelected] = useState(false);

  const handleSelectCharacter = (type: "boy" | "girl") => {
    game.selectCharacter(type);
    setCharacterSelected(true);
  };

  if (!characterSelected) {
    return <CharacterSelector onSelect={handleSelectCharacter} />;
  }

  if (gameState.quizStarted) {
    return <QuizScreen />;
  }

  return (
    <div className="foodGame">
      <h2>Путешествие по России</h2>

      <CharacterStats
        hunger={gameState.character.hunger}
        happiness={gameState.character.happiness}
      />

      <RegionScreen />

      <Inventory
        items={gameState.inventory}
        onUseItem={(id: string) => game.useItem(id)}
      />
    </div>
  );
}
