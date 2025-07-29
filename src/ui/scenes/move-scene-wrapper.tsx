import React, { useEffect } from "react";
// import { gameFlowManager } from "@processes/game-flow/game-flow-manager";
// import styles from "./move-scene-wrapper.module.css";
// import { CloseIcon } from "@ui/icons/close-icon";
import { useMoveSceneStore } from "@core/state/move-scene-store";
import { getAssetsPath } from "../../utils";
import { QuizOverlay } from "../../features/game-quiz/components/quiz-overlay";
import type { QuizItem } from "../../core/types/common-types";

export const MoveSceneWrapper: React.FC = () => {
  const {
    questions,
    currentIndex,
    isQuizVisible,
    stage,
    selected,
    setQuestions,
    startQuizCycle,
    skipIntro,
    answerQuestion,
  } = useMoveSceneStore();

  // ✅ Загружаем вопросы из JSON
  useEffect(() => {
    fetch(getAssetsPath("data/quiz.json"))
      .then((res) => res.json())
      .then(({ questions }: { questions: QuizItem[] }) => {
        setQuestions(questions);
        startQuizCycle(); // после загрузки сразу запускаем цикл
      })
      .catch(console.error);
  }, [setQuestions, startQuizCycle]);

  // ✅ Если нет вопросов — ничего не рендерим
  if (!questions.length) return null;

  return (
    <>
      {/* Информационный блок */}
      {/* <div className={styles.sceneWrapper}>
        <div className={styles.infoBox}>
          <button className={styles.closeButton} aria-label="Закрыть">
            <CloseIcon />
          </button>
          <h2 className={styles.title}>Сцена Перемещения</h2>
          <p className={styles.description}>
            Используйте стрелки или тапы по сторонам экрана для движения персонажа.
          </p>
          <button className={styles.backButton} onClick={() => gameFlowManager.startGameMap()}>
            Вернуться на карту
          </button>
        </div>
      </div> */}

      {/* ✅ Отображение квиза */}
      {isQuizVisible && (
        <QuizOverlay
          question={questions[currentIndex]}
          stage={stage}
          selected={selected}
          onSkipIntro={skipIntro}
          onAnswer={answerQuestion}
        />
      )}
    </>
  );
};
