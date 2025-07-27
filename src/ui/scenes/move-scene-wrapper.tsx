import React, { useState } from "react";
import { gameFlowManager } from "@processes/game-flow/game-flow-manager";
import styles from "./move-scene-wrapper.module.css";
import { CloseIcon } from "@ui/icons/close-icon";
import { ThoughtBubble } from "@components/thought-bubble";
import { useMoveSceneStore } from "@core/state";
import { motion } from "motion/react"; // Убедимся, что motion импортирован

export const MoveSceneWrapper: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const {
    isThoughtBubbleVisible,
    thoughtBubbleMessage,
    thoughtBubbleOptions,
    thoughtBubblePosition, // Координаты из Phaser
    onOptionSelected,
    hideThoughtBubble,
  } = useMoveSceneStore();

  const handleGoToMap = () => {
    hideThoughtBubble();
    gameFlowManager.startGameMap();
  };

  const handleCloseInfoBox = () => {
    setIsVisible(false);
  };

  const handleThoughtBubbleOptionSelected = (value: string) => {
    onOptionSelected.emit("optionSelected", value);
  };

  return (
    <>
      {isVisible && (
        <div className={styles.sceneWrapper}>
          <div className={styles.infoBox}>
            <button
              className={styles.closeButton}
              onClick={handleCloseInfoBox}
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
      )}

      {/* ThoughtBubble - Облако мыслей */}
      {isThoughtBubbleVisible && thoughtBubbleMessage && thoughtBubblePosition && (
        <motion.div
          // motion.div теперь сам является абсолютно позиционированным контейнером
          // и управляет своей позицией, а также передаёт CSS-класс для стилизации
          className={styles.thoughtBubbleContainer} // Новый класс для контейнера ThoughtBubble
          // initial={{
          //   opacity: 0,
          //   y: thoughtBubblePosition.y + 20, // Начальная позиция чуть ниже
          //   x: thoughtBubblePosition.x, // Начальная X позиция
          //   scale: 0.8,
          // }}
          // animate={{
          //   opacity: 1,
          //   y: thoughtBubblePosition.y, // Конечная Y позиция
          //   x: thoughtBubblePosition.x, // Конечная X позиция
          //   scale: 1,
          // }}
          // exit={{
          //   opacity: 0,
          //   y: thoughtBubblePosition.y + 20,
          //   x: thoughtBubblePosition.x,
          //   scale: 0.8,
          // }}
          // transition={{ duration: 0.3,
          //   ease: "easeOut" }}
          style={{ zIndex: 15 }} // Убедимся, что он поверх всего
        >
          <ThoughtBubble
            message={thoughtBubbleMessage}
            options={thoughtBubbleOptions}
            position="bottomLeft"
            onOptionSelected={handleThoughtBubbleOptionSelected}
            onClose={hideThoughtBubble}
          />
        </motion.div>
      )}
    </>
  );
};
