import { useState } from "react";
import styles from "./move-scene-wrapper.module.css";
import { CloseIcon } from "@ui/icons/close-icon";

export const IntroSceneWrapper = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.sceneWrapper}>
      <div className={styles.infoBox}>
        {}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Закрыть"
        >
          <CloseIcon />
        </button>

        {}
        <h2 className={styles.title}>Добро пожаловать!</h2>
        <p className={styles.description}>
          Игра начинается...
        </p>
        {}
      </div>
    </div>
  );
};
