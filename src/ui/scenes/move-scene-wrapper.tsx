import React, { useEffect } from "react";
import { useMoveSceneStore } from "@core/state/move-scene-store";
import { getAssetsPath, getAssetsPathByType } from "../../utils";
import { QuizOverlay } from "../../features/game-quiz/components/quiz-overlay";
import type { QuizItem } from "../../core/types/common-types";
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
  } = useMoveSceneStore();
  const { setBackgroundLayers } = useSceneStore();

  useEffect(() => {
    setBackgroundLayers({
      background: getAssetsPathByType({ type: "images",
        scene: "forest",
        filename: "background.svg" }),
      preBackground: getAssetsPathByType({ type: "images",
        scene: "forest",
        filename: "pre-background.svg" }),
      light: getAssetsPathByType({ type: "images",
        scene: "forest",
        filename: "light.svg" }),
      front: getAssetsPathByType({ type: "images",
        scene: "forest",
        filename: "front.svg" }),
      ground: getAssetsPath("images/platform.png"),
    });
  }, [setBackgroundLayers]);

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
