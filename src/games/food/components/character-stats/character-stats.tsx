import styles from "./style.module.css";

interface CharacterStatsProps {
  hunger: number;
  happiness: number;
}

export const CharacterStats = ({ hunger, happiness }: CharacterStatsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.stat}>
        <span>Сытость:</span>
        <progress value={hunger} max="100" />
        <span>{hunger}%</span>
      </div>
      <div className={styles.stat}>
        <span>Счастье:</span>
        <progress value={happiness} max="100" />
        <span>{happiness}%</span>
      </div>
    </div>
  );
};
