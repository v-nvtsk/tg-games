import styles from './score.module.css';

interface ScoreProps {
  score: number;
  level: number;
}

export function Score({ score, level }: ScoreProps) {
  return (
    <div className={styles.scoreContainer}>
      <div className={styles.scoreItem}>
        <h3>очков</h3>
        <div className={styles.scoreValue}>
          <span className={styles.coinIcon}>🪙</span>
          {score}
        </div>
      </div>
    </div>
  );
} 