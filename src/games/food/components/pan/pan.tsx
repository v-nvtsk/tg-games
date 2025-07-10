import styles from "./style.module.css";

interface PanProps {
  list: string[];
  onRemove: (item: string) => void;
}

export const Pan = ({ list, onRemove }: PanProps) => {
  return (
    <ul className={styles.pan}>
      {list.map((item, index) => {
        const key = `${item}-${index}`;
        return (
          <li key={key} className={styles.panItem} onClick={() => onRemove(item)}>
            {item}
          </li>
        );
      })}
    </ul>
  );
};
