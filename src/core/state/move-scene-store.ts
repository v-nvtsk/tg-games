import { create } from "zustand";
import { gameFlowManager } from "@processes/game-flow/game-flow-manager";
import type { QuizItem } from "@core/types/common-types";

const TIMEOUT_FOR_QUESTION = 5000; // 5 секунд движения для появления вопроса

interface MoveSceneState {
  questions: QuizItem[];
  currentIndex: number;
  isQuizVisible: boolean;
  stage: "intro" | "question" | "hidden";
  selected: string | null;
  canSkip: boolean;
  remainTime: number; // Оставшееся время движения до следующего вопроса
  timerId: number | null; // ID таймера setInterval
  isMoving: boolean; // Флаг, указывающий, движется ли игрок
  setQuestions: (questions: QuizItem[]) => void;
  startQuizCycle: () => void;
  openQuiz: (index: number) => void;
  skipIntro: () => void;
  answerQuestion: (answerId: string) => void;
  completeQuiz: () => void;
  hideQuiz: () => void;
  startTimer: () => void; // Запускает/сбрасывает таймер
  pauseTimer: () => void; // Приостанавливает таймер
  resumeTimer: () => void; // Возобновляет таймер
  setMoving: (moving: boolean) => void; // Устанавливает статус движения игрока
}

export const useMoveSceneStore = create<MoveSceneState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  isQuizVisible: false,
  stage: "hidden",
  selected: null,
  canSkip: false,
  remainTime: TIMEOUT_FOR_QUESTION, // Инициализируем с полным временем
  timerId: null, // Нет активного таймера изначально
  isMoving: false, // Игрок не движется изначально

  setQuestions: (questions) => set({ questions }),

  // Обновленный метод setMoving:
  // Теперь он управляет запуском/паузой таймера в зависимости от движения игрока.
  setMoving: (moving: boolean) => {
    set({ isMoving: moving });
    const { isQuizVisible } = get(); // Удалена 'stage', так как она не используется здесь

    // Управляем таймером только если квиз НЕ видим (т.е. мы ждем следующего вопроса)
    // или если квиз уже на стадии "question" и нужно его скрыть/перейти к следующему.
    if (!isQuizVisible) { // Если квиз скрыт, то мы ждем следующего вопроса
      if (moving) {
        get().resumeTimer(); // При начале движения возобновляем/запускаем таймер
      } else {
        get().pauseTimer(); // При остановке движения приостанавливаем таймер
      }
    }
    // Если isQuizVisible true, то квиз уже показан, и движение игрока не должно влиять на текущий таймер квиза.
    // Таймер внутри openQuiz/answerQuestion управляется отдельно.
  },

  // Запускает новый таймер или сбрасывает существующий.
  // Таймер теперь отсчитывает время, пока игрок ДВИЖЕТСЯ.
  startTimer: () => {
    const { timerId } = get();
    if (timerId !== null) {
      clearInterval(timerId); // Очищаем любой существующий таймер
    }

    set({ remainTime: TIMEOUT_FOR_QUESTION }); // Сбрасываем время

    // Запускаем таймер только если игрок ДВИЖЕТСЯ.
    if (get().isMoving) {
      const newTimerId = setInterval(() => {
        const { remainTime: currentRemainTime } = get(); // Удалена 'isMoving', так как она не используется здесь
        if (!get().isMoving) { // Если игрок остановился, приостанавливаем таймер
          clearInterval(newTimerId);
          set({ timerId: null });
          return;
        }

        if (currentRemainTime <= 0) {
          clearInterval(newTimerId);
          set({ timerId: null });
          get().openQuiz(get().currentIndex); // Открываем следующий вопрос
        } else {
          set((state) => ({ remainTime: state.remainTime - 1000 })); // Уменьшаем на 1 секунду
        }
      }, 1000) as unknown as number;

      set({ timerId: newTimerId });
    } else {
      // Если игрок не движется, таймер не запускается, просто сбрасываем remainTime и timerId
      set({ timerId: null });
    }
  },

  // Приостанавливает таймер
  pauseTimer: () => {
    const { timerId } = get();
    if (timerId !== null) {
      clearInterval(timerId);
      set({ timerId: null });
    }
  },

  // Возобновляет таймер с оставшегося времени.
  // Таймер теперь отсчитывает время, пока игрок ДВИЖЕТСЯ.
  resumeTimer: () => {
    const { timerId, remainTime } = get(); // Удалена 'isMoving', так как она не используется здесь
    // Возобновляем только если таймера нет, осталось время, и игрок ДВИЖЕТСЯ
    if (timerId === null && remainTime > 0 && get().isMoving) { // Используем get().isMoving
      const newTimerId = setInterval(() => {
        const { remainTime: currentRemainTime } = get(); // Удалена 'currentIsMoving', так как она не используется здесь
        if (!get().isMoving) { // Если игрок остановился, приостанавливаем
          clearInterval(newTimerId);
          set({ timerId: null });
          return;
        }

        if (currentRemainTime <= 0) {
          clearInterval(newTimerId);
          set({ timerId: null });
          get().openQuiz(get().currentIndex);
        } else {
          set((state) => ({ remainTime: state.remainTime - 1000 }));
        }
      }, 1000) as unknown as number;

      set({ timerId: newTimerId });
    }
  },

  // Запускает цикл квиза.
  // Если игрок движется, таймер сразу запустится. Если нет, он запустится при начале движения.
  startQuizCycle: () => {
    const { questions, currentIndex, completeQuiz } = get(); // Удалена 'isMoving', так как она не используется здесь
    if (currentIndex >= questions.length) {
      completeQuiz();
      return;
    }
    // Запускаем таймер. Он сам проверит, движется ли игрок.
    // Если игрок движется, таймер начнет отсчет. Если нет, он будет ждать начала движения.
    get().startTimer();
  },

  /** 🔹 Показ квиза */
  openQuiz: (index) => {
    const { questions, pauseTimer } = get();
    pauseTimer(); // Останавливаем таймер движения при показе квиза

    if (index >= questions.length) {
      get().completeQuiz();
      return;
    }
    set({
      currentIndex: index,
      isQuizVisible: true,
      stage: "intro",
      selected: null,
      canSkip: false,
      remainTime: TIMEOUT_FOR_QUESTION, // Сброс таймера для нового вопроса
    });

    // Таймаут для возможности пропуска интро остается отдельным
    setTimeout(() => {
      if (get().isQuizVisible && get().currentIndex === index) {
        set({ canSkip: true });
      }
    }, TIMEOUT_FOR_QUESTION);
  },

  skipIntro: () => {
    const { stage, canSkip } = get();
    if (stage === "intro" && canSkip) {
      set({ stage: "question" });
    }
  },

  /** 🔹 Обработка ответа */
  answerQuestion: (answerId) => {
    const { currentIndex, questions, pauseTimer } = get();
    pauseTimer(); // Приостанавливаем таймер при выборе ответа

    set({ selected: answerId });
    console.log("Ответ отправлен:", { questionId: questions[currentIndex].id,
      answerId });

    setTimeout(() => {
      set({ isQuizVisible: false,
        stage: "hidden" });
      if (currentIndex < questions.length - 1) {
        set((state) => ({ currentIndex: state.currentIndex + 1 })); // Переходим к следующему индексу
        // После ответа, ждем 1 секунду, затем запускаем следующий цикл квиза.
        // startQuizCycle сам проверит состояние isMoving и запустит таймер, если игрок движется.
        setTimeout(() => get().startQuizCycle(), 1000);
      } else {
        get().completeQuiz();
      }
    }, 1000); // Короткая задержка перед скрытием квиза
  },

  completeQuiz: () => {
    // Логика завершения квиза
    set({ isQuizVisible: false,
      stage: "hidden" });
    gameFlowManager.startGameMap(); // Возвращаемся на карту
  },

  hideQuiz: () => {
    get().pauseTimer(); // Убедимся, что таймер приостановлен, когда квиз скрыт
    set({ isQuizVisible: false,
      stage: "hidden" });
  },
}));
