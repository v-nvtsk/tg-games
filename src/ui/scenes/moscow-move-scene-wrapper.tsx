import { useEffect } from "react";
import { useMoveSceneStore } from "@core/state/move-scene-store";
import { getAssetsPath } from "../../utils";
import { QuizOverlay } from "../../features/game-quiz/components/quiz-overlay";
import { type QuizItem } from "@core/types/common-types";

export const MoscowMoveSceneWrapper = () => {
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
