import React, { useState } from "react";
import styles from "./style.module.css";
import { GameMenu } from "../game-menu";
import { Settings } from "../settings";

export const GameHeader: React.FC = () => {
  const [tooltip, setTooltip] = useState<{ text: string;
    left: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const showTooltip = (e: React.MouseEvent<HTMLDivElement>, text: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ text,
      left: rect.left + rect.width / 2 });
  };

  const handleDebugAction = (action: string) => {
    console.log("DEBUG action:", action);
    // здесь вызывайте переход к нужной сцене
    setMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(true)}>☰</button>

        <div className={styles.statusGroup}>
          <div
            className={styles.statusIcon}
            onMouseEnter={(e) => showTooltip(e, "Голод")}
            onMouseLeave={() => setTooltip(null)}
          >
            🍗
          </div>
          <div
            className={styles.statusIcon}
            onMouseEnter={(e) => showTooltip(e, "Энергия")}
            onMouseLeave={() => setTooltip(null)}
          >
            ⚡
          </div>
        </div>

        {tooltip && (
          <div className={styles.tooltip} style={{ left: tooltip.left }}>
            {tooltip.text}
          </div>
        )}
      </header>

      <GameMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSettings={() => {
          setMenuOpen(false);
          setSettingsOpen(true);
        }}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        soundEnabled={soundEnabled}
        onDebugAction={handleDebugAction}
      />

      <Settings visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};
