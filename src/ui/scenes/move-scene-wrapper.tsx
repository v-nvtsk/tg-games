import { useState } from "react";
import { gameFlowManager } from "@processes/game-flow/game-flow-manager";
import styles from "./move-scene-wrapper.module.css";
import { CloseIcon } from "@ui/icons/close-icon";

export const MoveSceneWrapper = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleGoToMap = () => {
    gameFlowManager.startGameMap();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.sceneWrapper}>
      <div className={styles.infoBox}>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Закрыть"
        >
          <CloseIcon />
        </button>

        <h2 className={styles.title}>Сцена Перемещения</h2>
        <p className={styles.description}>
          Используйте стрелки или тапы по сторонам экрана для движения персонажа.
        </p>
        <button className={styles.backButton} onClick={handleGoToMap}>
          Вернуться на карту
        </button>
      </div>
    </div>
  );
};
