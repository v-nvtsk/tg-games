import styles from "./style.module.css";

interface InventoryProps {
  items: { id: string; name: string; happinessValue: number }[];
  onUseItem: (id: string) => void;
}

export const Inventory = ({ items, onUseItem }: InventoryProps) => {
  return (
    <div className={styles.container}>
      <h3>Рюкзак ({items.length}/5)</h3>

      {items.length === 0 ? (
        <p>Рюкзак пуст</p>
      ) : (
        <ul className={styles.itemsList}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span>{item.name} (+{item.happinessValue})</span>
              <button onClick={() => onUseItem(item.id)}>Использовать</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
