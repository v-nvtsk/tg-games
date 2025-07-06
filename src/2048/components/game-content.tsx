import { Field } from "./field";
import { useScore, useGameOver, useGameActions } from "../hooks";
import { Score } from "./score";
import styles from "./app.module.css";

export function GameContent() {
  const { score, highScore } = useScore();
  const over = useGameOver();
  const { restart } = useGameActions();

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>2048</h1>
      <button onClick={restart}>restart</button>
      <h2 className={over ? styles.gameOver : styles.game}>Game Over</h2>
      <Score score={score} highscore={highScore}/>
      <Field />
    </div>
  );
}
