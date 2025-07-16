// === src/features/game-map/game-map-scene-wrapper.tsx ===
import React from "react";
import { gameFlowManager, type GameMapSceneData } from "../../processes/game-flow/game-flow-manager"; // Импортируем GameMapSceneData
import { usePlayerState } from "@/core/state/player-store";
import { GoButton } from "../../ui/components/go-button";
import { useSceneState } from "../../core/state/scene-store";

import styles from "./game-map-scene-wrapper.module.css";

export const GameMapSceneWrapper: React.FC = () => {
  const playerName = usePlayerState((state) => state.playerName);
  const playerGender = usePlayerState((state) => state.playerGender);
  const sceneData = useSceneState((state) => state.sceneData); // Получаем данные сцены

  // Приводим sceneData к типу GameMapSceneData для безопасного доступа к свойствам
  const gameMapSceneData = sceneData as GameMapSceneData | undefined;

  const handleGoToIntro = () => {
    gameFlowManager.showIntro();
  };

  const handleGoToMoveScene = (event: React.MouseEvent) => {
    event.preventDefault();
    if (gameMapSceneData && gameMapSceneData.targetX !== undefined && gameMapSceneData.targetY !== undefined) {
      // Передаем данные о целевом городе в MoveScene
      gameFlowManager.showMoveScene({
        targetX: gameMapSceneData.targetX,
        targetY: gameMapSceneData.targetY,
      });
    } else {
      console.error("Недостаточно данных для перехода в MoveScene.");
    }
  };

  // Проверяем, есть ли выбранный город в gameMapSceneData
  const showGoButton = gameMapSceneData && gameMapSceneData.selectedCity;

  return (
    <>
      <div className={styles.headerContainer}>
        {/* Контейнер для информации об игроке */}
        <div className={styles.playerInfoWrapper}>
          {/* Иконка игрока / аватар */}
          {playerGender === "boy" ? (
            <svg className={`${styles.genderIcon} ${styles.boy}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          ) : (
            <svg className={`${styles.genderIcon} ${styles.girl}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          )}
          <div>
            <p className={styles.playerName}>Привет, {playerName || "Игрок"}!</p>
            <p className={styles.playerRole}>
              {playerGender === "boy" ? "Путешественник" : playerGender === "girl" ? "Путешественница" : "Неизвестно"}
            </p>
          </div>
        </div>

        {/* Кнопка "Начальный экран" */}
        <button
          onClick={handleGoToIntro}
          className={styles.introButton}
          aria-label="Перейти на начальный экран"
        >
          {/* Иконка домика */}
          <svg className={styles.introButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-9v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span>Начальный экран</span>
        </button>
      </div>

      {/* Кнопка "Идти" - рендерится условно */}
      {showGoButton && gameMapSceneData && ( // Добавляем проверку gameMapSceneData
        <GoButton
          onClick={handleGoToMoveScene}
          text={`Идти в ${gameMapSceneData.selectedCity}`} // Динамический текст кнопки
        />
      )}
    </>
  );
};
