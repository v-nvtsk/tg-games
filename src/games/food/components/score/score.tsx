import styles from "./style.module.css";

interface ScoreProps {
  score: number;
  highScore: number;
}

export const Score = ({ score, highScore }: ScoreProps) => {
  return (
    <div className={styles.scoreContainer}>
      <span>Счёт: {score}</span>
      <span>Рекорд: {highScore}</span>
    </div>
  );
};
