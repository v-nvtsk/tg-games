// === ./src/games/food/components/character-selector/index.ts ===
import styles from "./style.module.css";

interface CharacterSelectorProps {
  onSelect: (type: "boy" | "girl") => void;
}

export const CharacterSelector = ({ onSelect }: CharacterSelectorProps) => {
  return (
    <div className={styles.container}>
      <h2>Выбери персонажа</h2>
      <div className={styles.characters}>
        <div className={styles.character} onClick={() => onSelect("boy")}>
          <div className={styles.avatar}>👦</div>
          <span>Мальчик</span>
        </div>
        <div className={styles.character} onClick={() => onSelect("girl")}>
          <div className={styles.avatar}>👧</div>
          <span>Девочка</span>
        </div>
      </div>
    </div>
  );
};
