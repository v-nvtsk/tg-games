import { useEffect } from "react";
import { useMoveSceneStore } from "@core/state/move-scene-store";
import { getAssetsPath } from "$utils";
import { QuizOverlay } from "$/features/game-quiz/components/quiz-overlay";
import { type QuizItem } from "@core/types/common-types";
import { useBackgroundMusic } from "$/core/hooks/use-background-music/use-music";

export const MoveToTrainSceneWrapper = () => {
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

  useBackgroundMusic({ scene: "move-to-train",
    filename: "Звук утреннего города.mp3" });

  useBackgroundMusic({ scene: "move-to-train",
    filename: "Andrey Bakt - Rainy Hanoi.mp3" });

  useEffect(() => {
    fetch(getAssetsPath("data/move-to-train.json"))
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
