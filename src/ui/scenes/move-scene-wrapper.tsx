import React from "react";
import { gameFlowManager, type MoveSceneData } from "../../processes/game-flow/game-flow-manager";
import { useSceneState } from "../../core/state/scene-store";
import styles from "./move-scene-wrapper.module.css";
import { CloseIcon } from "@/ui/icons/close-icon"; // Или любая SVG-иконка "X"

export const MoveSceneWrapper: React.FC = () => {
  const sceneData = useSceneState((state) => state.sceneData);
  const moveSceneData = sceneData as MoveSceneData | undefined;
  const [isVisible, setIsVisible] = React.useState(true);

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
        {/* Кнопка закрытия */}
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Закрыть"
        >
          <CloseIcon />
        </button>

        <h2 className={styles.title}>Сцена Перемещения</h2>
        {moveSceneData && (
          <p className={styles.coordinates}>
            Целевые координаты: X: {moveSceneData.targetX}, Y: {moveSceneData.targetY}
          </p>
        )}
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
