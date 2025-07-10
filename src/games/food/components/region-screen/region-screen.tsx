import styles from "./style.module.css";
import { useFoodGame } from "../../hooks/use-food-game";

export const RegionScreen = () => {
  const { game, gameState } = useFoodGame();
  const region = gameState.regions[gameState.currentRegion];

  return (
    <div className={styles.container}>
      <h2>Текущий регион: {region.name}</h2>
      <div className={styles.requirements}>
        <p>Требуется счастья: {region.requiredHappiness}/100</p>
        <progress
          value={gameState.character.happiness}
          max={region.requiredHappiness}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.button}>Игра</button>
        <button
          className={styles.button}
          onClick={() => game.startQuiz()}
        >
          Викторина
        </button>
        <button className={styles.button}>Готовка</button>
      </div>
    </div>
  );
};
