import React from "react";
import styles from "./style.module.css";
import type { QuizItem } from "@core/types/common-types";

interface Props {
  question: QuizItem;
  stage: "intro" | "question" | "hidden";
  selected: string | null;
  onSkipIntro: () => void;
  onAnswer: (answerId: string) => void;
}

export const QuizOverlay: React.FC<Props> = ({ question, stage, selected, onSkipIntro, onAnswer }) => {
  if (stage === "hidden") return null;

  return (
    <div className={styles.quizWrapper} onClick={onSkipIntro}>
      {/* SVG облако */}
      <svg className={styles.cloud} viewBox="0 0 493 503" preserveAspectRatio="xMidYMid meet">
        <path
          d="M341.61 18.89C395.45 52.93 416.47 133.15 416.47 133.15C566.96 188.63 448.37 330.11 448.37 330.11C441.43 463.96 358.91 393.22 358.91 393.22C363.76 494.47 270.43 458.51 270.43 458.51C227.03 548.07 155.02 472.28 155.02 472.28C59.32 484.07 121.73 393.22 121.73 393.22C24.64 415.41 54.46 333.58 54.46 333.58C-2.41 343.29 6.61 276.71 0.37 194.18C-5.87 111.65 69.72 113.04 69.72 113.04C69.72 113.04 61.4 79.06 87.75 45.77C114.1 12.48 226.53 0 226.53 0L299.3 5.2C314.3 6.27 328.9 10.86 341.61 18.89Z"
          fill="white"
          stroke="#333"
          strokeWidth="3"
        />
      </svg>

      {/* Контент */}
      <div className={styles.content}>
        {stage === "intro" && question?.text && (
          <div className={styles.questionText}>
            {question.text.map((line, i) => <p key={i}>{line}</p>)}
          </div>
        )}

        {stage === "question" && (
          <div className={styles.question}>
            <h3>{question.question}</h3>
            <div className={styles.questionAnswers}>
              {question.answers.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onAnswer(a.id)}
                  className={`${styles.answerButton} ${selected === a.id ? styles.active : ""}`}
                >
                  {a.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

