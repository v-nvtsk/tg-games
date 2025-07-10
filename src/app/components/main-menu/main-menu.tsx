import { useTelegramUser } from "../../hooks/use-telegram-user/use-telegram-user";
import styles from "./style.module.css";

export const MainMenu = ({ onStartGame }: { onStartGame: (game: string) => void }) => {
  const user = useTelegramUser();

  return (
    <div className={styles.menu}>
      <h1 className={styles.title}>Добро пожаловать!</h1>
      {user && <p>Привет, {user.first_name} {user.last_name || ""}</p>}
      <div className={styles.gameList}>
        <button onClick={() => onStartGame("2048")}>Игра 2048</button>
        <button onClick={() => onStartGame("food")}>Сбор еды</button>
      </div>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Игровая платформа
      </footer>
    </div>
  );
};
