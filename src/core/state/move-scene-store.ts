import { create } from "zustand";
import { gameFlowManager } from "@processes/game-flow/game-flow-manager";
import type { QuizItem } from "@core/types/common-types";

const TIMEOUT_FOR_QUESTION = 5000;

interface MoveSceneState {
  questions: QuizItem[];
  currentIndex: number;
  isQuizVisible: boolean;
  stage: "intro" | "question" | "hidden";
  selected: string | null;

  // --- Методы ---
  setQuestions: (questions: QuizItem[]) => void;
  startQuizCycle: () => void;
  openQuiz: (index: number) => void;
  skipIntro: () => void;
  answerQuestion: (answerId: string) => void;
  completeQuiz: () => void;
  hideQuiz: () => void;
}

export const useMoveSceneStore = create<MoveSceneState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  isQuizVisible: false,
  stage: "hidden",
  selected: null,

  setQuestions: (questions) => set({ questions }),

  /** 🔹 Запуск цикла: первый таймер */
  startQuizCycle: () => {
    const { questions } = get();
    if (!questions.length) return;
    set({ currentIndex: 0 });
    setTimeout(() => get().openQuiz(0), TIMEOUT_FOR_QUESTION);
  },

  /** 🔹 Показ квиза */
  openQuiz: (index) => {
    const { questions } = get();
    if (index >= questions.length) {
      get().completeQuiz();
      return;
    }
    set({ currentIndex: index,
      isQuizVisible: true,
      stage: "intro",
      selected: null });

    // Переход к стадии question через 5 секунд
    setTimeout(() => {
      if (get().isQuizVisible && get().currentIndex === index) {
        set({ stage: "question" });
      }
    }, TIMEOUT_FOR_QUESTION);
  },

  /** 🔹 Скип интро по тапу */
  skipIntro: () => {
    if (get().stage === "intro") set({ stage: "question" });
  },

  /** 🔹 Обработка ответа */
  answerQuestion: (answerId) => {
    const { currentIndex, questions } = get();
    set({ selected: answerId });

    // Симуляция запроса к серверу
    console.log("Ответ отправлен:", { questionId: questions[currentIndex].id,
      answerId });

    setTimeout(() => {
      set({ isQuizVisible: false,
        stage: "hidden" });

      if (currentIndex < questions.length - 1) {
        // Следующий вопрос через TIMEOUT_FOR_QUESTION
        setTimeout(() => get().openQuiz(currentIndex + 1), TIMEOUT_FOR_QUESTION);
      } else {
        get().completeQuiz();
      }
    }, 1000);
  },

  /** 🔹 Завершение квиза и переход на карту */
  completeQuiz: () => {
    console.log("Квиз завершён. Переход к карте...");
    set({ isQuizVisible: false,
      stage: "hidden" });
    gameFlowManager.startGameMap();
  },

  /** 🔹 Принудительное скрытие квиза */
  hideQuiz: () => set({ isQuizVisible: false,
    stage: "hidden" }),
}));
