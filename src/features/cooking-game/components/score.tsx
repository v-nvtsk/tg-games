import styles from "./score.module.css";
import scoreIcon from "$/assets/images/scenes/cooking/icons/score_icon.svg";

interface ScoreProps {
  score: number;
}

export function Score({ score }: ScoreProps) {
  return (
    <div className={styles.scoreContainer}>
      <div className={styles.scoreIconWrapper}>
        <img src={scoreIcon} alt="score" className={styles.scoreIcon} />
        <div className={styles.scoreOverlay}>
          <span className={styles.scoreText}>{score} очков</span>
        </div>
      </div>
    </div>
  );
}
