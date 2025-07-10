import styles from "./style.module.css";

export const FoodTransporter = ({ list, onClick }: { list: string[], onClick: (item: string) => void }) => {

  return (
    <ul className={styles.foodTransporter}>
      {list.map((item, index) => {
        const key = `${item}-${index}`;
        return (
          <li onClick={() => onClick(item)} key={key} className={styles.transporterItem}>{item}</li>
        );})}
    </ul>
  );
};
