import { Link } from "react-router-dom";
import styles from "./style.module.css";

interface LayoutProps {
  gameName: string;
  score?: number;
  highScore?: number;
  children: React.ReactNode;
}

export const Layout = ({ gameName, score, highScore, children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.topBar}>
          <Link to="/" className={styles.backButton}>
            ← Меню
          </Link>
          <h2 className={styles.title}>{gameName}</h2>
        </div>
        {(score !== undefined || highScore !== undefined) && (
          <div className={styles.scoreInfo}>
            {score !== undefined && <span>Счёт: {score}</span>}
            {highScore !== undefined && <span>Рекорд: {highScore}</span>}
          </div>
        )}
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
