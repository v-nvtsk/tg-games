import { Score } from "./score";
import { TetrisGame } from "./tetris-game";
import { RecipeSelectorExample } from "./recipe-selector-example";
import styles from "./game-content.module.css";
import { useGameContext, useGameNavigation } from "./game-provider";
import shopIcon from "$/assets/images/scenes/cooking/icons/shop.png";
import bookIcon from "$/assets/images/scenes/cooking/icons/book.png";
import { Shop } from "./shop";

export function GameContent() {
  const { state } = useGameContext();
  const { goToRecipeBook, goToTetris, goToShop } = useGameNavigation();
  
  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case "tetris":
        return <TetrisGame />;
      case "recipe-book":
        return (
          <div className={styles.recipeBookContainer}>
            <RecipeSelectorExample />
            <button onClick={goToTetris} className={styles.backButton}>
              Вернуться к игре
            </button>
          </div>
        );
      case "shop":
        return <Shop />;
      default:
        return <TetrisGame />;
    }
  };

  return (
    <div className={styles.gameContainer}>
      {renderCurrentScreen()}
      {state.currentScreen === "tetris" && (
        <div className={styles.infoSection}>
          <div className={styles.scoreSection}>
            <Score score={state.score} />
            <div className={styles.actionButtons}>
              <img src={shopIcon} alt="shop" onClick={goToShop} />
              <img src={bookIcon} alt="book" onClick={goToRecipeBook} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}