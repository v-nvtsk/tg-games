import React from "react";
import { gameFlowManager, type MoveSceneData } from "../../processes/game-flow/game-flow-manager";
import { useSceneState } from "../../core/state/scene-store";

import styles from "./move-scene-wrapper.module.css";

export const MoveSceneWrapper: React.FC = () => {
  const sceneData = useSceneState((state) => state.sceneData);
  const moveSceneData = sceneData as MoveSceneData | undefined;

  const handleGoToMap = () => {
    gameFlowManager.startGameMap();
  };

  return (
    <div className={styles.sceneWrapper}>
      <div className={styles.infoBox}>
        <h2 className={styles.title}>Сцена Перемещения</h2>
        {moveSceneData && (
          <p className={styles.coordinates}>
            Целевые координаты: X: {moveSceneData.targetX}, Y: {moveSceneData.targetY}
          </p>
        )}
        <p className={styles.description}>
          Используйте стрелки или тапы по сторонам экрана для движения персонажа.
        </p>
        <button
          onClick={handleGoToMap}
          className={styles.backButton}
        >
          Вернуться на карту
        </button>
      </div>
    </div>
  );
};
