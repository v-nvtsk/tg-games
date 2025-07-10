import {
  useGameActions,
  useGameOver,
  useScore,
} from "../hooks";
import { Field } from "./field";
import styles from "./game.module.css";
import { Score } from "./score";

export function GameContent() {
  const { score, highScore } = useScore();
  const over = useGameOver();
  const { restart } = useGameActions();

  const handleRestartClick = () => {
    restart();
  };

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>2048</h1>
      <button className={styles.restartBtn} onClick={handleRestartClick}>restart</button>
      <h2 className={over ? styles.gameOver : styles.game}>Game Over</h2>
      <Score score={score} highscore={highScore}/>
      <Field />
    </div>
  );
}
