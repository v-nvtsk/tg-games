import { useState } from "react";
import { SceneWrapper } from "@ui/components/scene-wrapper";
import { gameFlowManager } from "@processes/game-flow/game-flow-manager";
import styles from "./intro-scene-wrapper.module.css";

export const IntroSceneWrapper = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleGoToMap = () => {
    setIsVisible(false);
    gameFlowManager.startGameMap();
  };

  if (!isVisible) return null;

  return (
    <SceneWrapper
      title="Сцена Вступления"
      description="Используйте стрелки или тапы по сторонам экрана для движения персонажа."
      onClose={handleGoToMap}
      styles={styles}
    />
  );
};
