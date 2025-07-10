// === ./src/games/food/components/quiz-screen/quiz-screen.tsx ===
import styles from "./style.module.css";
import { useFoodGame } from "../../hooks/use-food-game";
// Добавляем импорт regionQuizzes
import { regionQuizzes } from "../../context/food-game-logic";

export const QuizScreen = () => {
  const { game, gameState } = useFoodGame();
  const regionId = gameState.currentRegion;

  // Проверяем наличие викторины для региона
  if (!regionQuizzes[regionId]) {
    return <div>Викторина для этого региона не найдена</div>;
  }

  const questions = regionQuizzes[regionId];
  const currentQuestion = questions[gameState.currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    game.answerQuestion(optionIndex);
  };

  return (
    <div className={styles.container}>
      <h2>Викторина: {gameState.regions[regionId].name}</h2>

      <div className={styles.questionContainer}>
        <p className={styles.questionText}>{currentQuestion.question}</p>

        <div className={styles.options}>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={styles.optionButton}
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.progress}>
        Вопрос {gameState.currentQuestion + 1} из {questions.length}
      </div>

      <button
        className={styles.backButton}
        onClick={() => game.endQuiz()}
      >
        Назад к региону
      </button>
    </div>
  );
};
