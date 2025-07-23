import { useEffect, useState } from "react";
import styles from "./move-scene-wrapper.module.css";
import { CloseIcon } from "@ui/icons/close-icon";

export const IntroSceneWrapper = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timerId);
    };
  });

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
          Сюда добавить функции в режиме разработки: скип интро, например.<br/>
          Можно добавить какую-то информацию. Сообщение исчезнет через 5с
        </p>
        {}
      </div>
    </div>
  );
};
