import type { FC } from "react";
import styles from "./style.module.css";

interface SceneNotificationProps {
  message: string;
  onClose: () => void;
}

export const SceneNotification: FC<SceneNotificationProps> = ({ message, onClose }) => {
  return (
    <div className={styles.notificationContainer}>
      <div className={styles.notification}>
        {message}
        <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          <span className={styles.closeIcon}>×</span>
        </button>
      </div>
    </div>
  );
};
