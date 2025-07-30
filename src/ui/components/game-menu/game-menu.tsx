import React from "react";
import styles from "./style.module.css";
import { gameFlowManager } from "../../../processes";

interface GameMenuProps {
  visible: boolean;
  onClose: () => void;
  onSettings: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  onDebugAction?: (action: string) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  visible,
  onClose,
  onSettings,
  onToggleSound,
  soundEnabled,
}) => {
  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Меню</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.item} onClick={onSettings}>⚙️ Настройки</div>
        <div className={styles.item} onClick={onToggleSound}>
          🔊 Звук: {soundEnabled ? "Вкл" : "Выкл"}
        </div>

        <div className={styles.subHeader}>Debug</div>
        <div className={styles.item} onClick={() => gameFlowManager.showFlyingGame()}>🛩️ Игра полёт</div>
        <div className={styles.item} onClick={() => gameFlowManager.showMoscowMoveScene()}>🚉 Сцена переход к вокзалу</div>
        <div className={styles.item} onClick={() => gameFlowManager.showMoveScene()}>🌲 Сцена переход в лесу</div>
        <div className={styles.item} onClick={() => gameFlowManager.showDetectiveGame()}>🕵️ Детектив</div>
        <div className={styles.item} onClick={() => gameFlowManager.startGameMap()}>🧭 Карта</div>
      </div>
    </div>
  );
};
