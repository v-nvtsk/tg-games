import React, { useEffect } from "react";
import { useMoveSceneStore } from "@core/state/move-scene-store";
import { getAssetsPath } from "../../utils";
import { QuizOverlay } from "../../features/game-quiz/components/quiz-overlay";
import type { QuizItem } from "../../core/types/common-types";
import { useBackgroundMusic } from "../../core/hooks/use-background-music/use-music";
import { useSceneStore } from "../../core/state";

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
    backgroundMusic,
  } = useMoveSceneStore();

  const scene = useSceneStore.getState().currentScene;

  useBackgroundMusic({ scene,
    filename: backgroundMusic || "" });

  useEffect(() => {
    fetch(getAssetsPath("data/quiz.json"))
      .then((res) => res.json())
      .then(({ questions }: { questions: QuizItem[] }) => {
        setQuestions(questions);
        if (questions.length) {
          startQuizCycle();
        } })
      .catch(console.error);
  }, [setQuestions, startQuizCycle]);

  if (!questions.length) return null;

  return (
    <>
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
