import styles from "./shop.module.css";

const inventoryData = [
  { icon: "🥕", label: "3 морковки" },
  { icon: "🍅", label: "2 помидора" },
  { icon: "🥒", label: "1 огурец" },
  { icon: "🥕", label: "3 морковки" },
  { icon: "🍅", label: "2 помидора" },
  { icon: "🥒", label: "1 огурец" },
];

const marketData = [
  { icon: "🥕", label: "морковь" },
  { icon: "🧂", label: "мука" },
  { icon: "🥒", label: "огурец свежий" },
  { icon: "🥩", label: "свиная шея" },
  { icon: "🥔", label: "картофель" },
  { icon: "🧈", label: "сливочное масло" },
];

export const Shop = () => {
  return (
    <div className={styles.container}>
      {/* Inventory Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Инвентарь</h2>

        <div className={styles.grid}>
          {inventoryData.map((item, idx) => (
            <div className={styles.inventoryItem} key={idx}>
              <div className={styles.itemIcon}>{item.icon}</div>
              <span className={styles.itemLabel}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button className={styles.navButton}>
            <span className={styles.chevron}>‹</span>
          </button>
          <span className={styles.pageInfo}>1 / 3</span>
          <button className={styles.navButton}>
            <span className={styles.chevron}>›</span>
          </button>
        </div>
      </div>

      {/* Market Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Маркет</h2>

        <div className={styles.grid}>
          {marketData.map((item, idx) => (
            <div className={styles.marketItem} key={idx}>
              <div className={styles.itemIcon}>{item.icon}</div>
              <span className={styles.itemLabel}>{item.label}</span>
              <button className={styles.buyButton}>КУПИТЬ</button>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button className={styles.navButton}>
            <span className={styles.chevron}>‹</span>
          </button>
          <span className={styles.pageInfo}>1 / 2</span>
          <button className={styles.navButton}>
            <span className={styles.chevron}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
};
