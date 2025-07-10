import styles from "./style.module.css";
import { useFoodGame } from "../../hooks/use-food-game";
import { ROUTES } from "../../../../constants/routes";
import { useNavigate } from "react-router-dom";

export const RegionScreen = () => {
  const { game, gameState } = useFoodGame();
  const region = gameState.regions[gameState.currentRegion];
  const navigate = useNavigate();

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
        <button className={styles.button}
          onClick={() => void navigate(ROUTES.GAME_2048)}>
          Игра
        </button>
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
