import styles from "./style.module.css";
import { useFoodGame } from "../../hooks/use-food-game";

export const QuizScreen = () => {
  const { game, gameState } = useFoodGame();
  const quiz = gameState.quiz;

  if (!quiz.questions.length) {
    return <div>Викторина для этого региона не найдена</div>;
  }

  const currentQuestion = quiz.questions[quiz.currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    game.answerQuestion(optionIndex);
  };

  return (
    <div className={styles.container}>
      <h2>Викторина: {gameState.regions[gameState.currentRegion].name}</h2>

      <div className={styles.questionContainer}>
        <p className={styles.questionText}>{currentQuestion.question}</p>

        <div className={styles.options}>
          {currentQuestion.options.map((option, index) => {
            const key = `${currentQuestion.id}-${index}`;
            return (
              <button
                key={key}
                className={styles.optionButton}
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            );})}
        </div>
      </div>

      <div className={styles.progress}>
        Вопрос {quiz.currentQuestion + 1} из {quiz.questions.length}
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
