import { Field } from "./field";
import { useScore, useGameOver, useGameActions } from "../hooks";
import { Score } from "./score";
import styles from "./app.module.css";

export function GameContent() {
  const { score, highScore } = useScore();
  const over = useGameOver();
  const { restart } = useGameActions();

  const handleRestartClick = () => {
    console.log("Restart button tapped/clicked!"); // Добавлено: Лог при нажатии на кнопку
    restart();
  };

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.title}>2048</h1>
      <button onClick={handleRestartClick}>restart</button> {/* Используем новую функцию-обработчик */}
      <h2 className={over ? styles.gameOver : styles.game}>Game Over</h2>
      <Score score={score} highscore={highScore}/>
      <Field />
    </div>
  );
}
