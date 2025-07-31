import styles from './score.module.css';

interface ScoreProps {
  score: number;
}

export function Score({ score }: ScoreProps) {
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