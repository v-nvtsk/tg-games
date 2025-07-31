import React from "react";
import styles from "./style.module.css";

interface SettingsProps {
  visible: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Настройки</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.item}>📶 Качество: Высокое</div>
        <div className={styles.item}>🎨 Тема: Светлая</div>
        <div className={styles.item}>💾 Сброс прогресса</div>
      </div>
    </div>
  );
};
