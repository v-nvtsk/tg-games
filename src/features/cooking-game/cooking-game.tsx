import { useEffect, useState } from "react";
import { GameProvider, GameContent } from "./components";
import { RecipeSelectorExample } from "./components/recipe-selector-example";
import styles from "./cooking-game.module.css";

export function CookingGame() {
  const [showRecipes, setShowRecipes] = useState(false);

  useEffect(() => {
    setShowRecipes(true);
  }, []);

  return (
    <div className={styles.gameContainer}>
      <GameProvider>

        {showRecipes ? <RecipeSelectorExample /> : <GameContent />}
      </GameProvider>
    </div>
  );
}
