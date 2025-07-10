import {
  useGameActions,
  useGameOver,
  useScore,
} from "../hooks";
import { Field } from "./field";
import styles from "./style.module.css";
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
      <div className={styles.titleBar}>
        <button className={styles.restartBtn} onClick={handleRestartClick}>restart</button>
        <h2 className={[styles.game, over && styles.gameOver].join(" ")}>Game Over</h2>
      </div>
      <Score score={score} highscore={highScore}/>
      <Field />
    </div>
  );
}
