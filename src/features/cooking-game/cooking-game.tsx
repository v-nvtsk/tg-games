import { GameProvider, GameContent } from './components';
import styles from './cooking-game.module.css';

export function CookingGame() {
  return (
    <div className={styles.gameContainer}>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
}
