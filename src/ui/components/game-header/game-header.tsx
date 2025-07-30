import React, { useState } from "react";
import styles from "./style.module.css";
import { GameMenu } from "../game-menu";
import { Settings } from "../settings";
import { usePlayerState } from "../../../core/state";

interface GameHeaderProps {
  compact?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ compact = false }) => {
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
    console.log("DEBUG:", action);
    setMenuOpen(false);
    // Здесь логика перехода на сцену
  };

  const hunger = usePlayerState((state) => state.hunger);
  const energy = usePlayerState((state) => state.energy);

  return (
    <>
      <header className={`${styles.header} ${compact ? styles.compact : ""}`}>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(true)}>☰</button>

        {!compact && (
          <div className={styles.statusGroup}>
            <div
              className={styles.statusIcon}
              onMouseEnter={(e) => showTooltip(e, "Голод")}
              onMouseLeave={() => setTooltip(null)}
            >
              🍗 : {hunger}
            </div>
            <div
              className={styles.statusIcon}
              onMouseEnter={(e) => showTooltip(e, "Энергия")}
              onMouseLeave={() => setTooltip(null)}
            >
              ⚡ : {energy}
            </div>
          </div>
        )}

        {tooltip && !compact && (
          <div className={styles.tooltip} style={{ left: tooltip.left }}>
            {tooltip.text}
          </div>
        )}
      </header>

      <GameMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSettings={() => { setMenuOpen(false); setSettingsOpen(true); }}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        soundEnabled={soundEnabled}
        onDebugAction={handleDebugAction}
      />

      <Settings visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};
