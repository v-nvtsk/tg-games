import styles from "./score.module.css";

export const Score = ({ score, highscore }: { score: number,
  highscore: number }) => {

  return (
    <div className={styles.scoreContainer}>
      <span className={styles.score}>score:</span>
      <span className={styles.score}>best:</span>
      <span className={styles.score}>{score}</span>
      <span className={styles.score}>{highscore}</span>
    </div>

  );
};
