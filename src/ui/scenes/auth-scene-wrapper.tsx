import React from "react";
import { gameFlowManager } from "@processes/game-flow/game-flow-manager";
import { usePlayerState } from "@core/state/player-store";

import styles from "./auth-scene-wrapper.module.css";

export const AuthSceneWrapper: React.FC = () => {
  const setPlayerName = usePlayerState((state) => state.setPlayerName);
  const setPlayerGender = usePlayerState((state) => state.setPlayerGender);
  const playerName = usePlayerState((state) => state.playerName);
  const selectedGender = usePlayerState((state) => state.playerGender);

  const handleGenderSelect = (gender: "boy" | "girl") => {
    setPlayerGender(gender);
  };

  const handleStartGame = () => {
    if (playerName && selectedGender) {
      gameFlowManager.showIntro();
    }
  };

  const isStartButtonDisabled = !playerName || !selectedGender;

  return (
    <div className={styles.sceneWrapper}>
      <div className={styles.gameContainer}>
        <div className={styles.backgroundGradient}></div>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.contentWrapper}>
          {}
          <div className={styles.gameTitle}>
            <h1 className={styles.mainTitle}>ПУТЕШЕСТВЕННИК</h1>
            <div className={styles.titleGlow}></div> {}
            <p className={styles.subtitle}>Начни свое приключение</p>
          </div>

          {}
          <div className={styles.gameCard}>
            <div className={styles.cardContent}>
              {}
              <div className={styles.inputSection}>
                <label htmlFor="nameInput" className={styles.inputLabel}>Введите ваше имя</label>
                <input
                  type="text"
                  id="nameInput"
                  className={styles.nameInput}
                  maxLength={20}
                  placeholder="Ваше имя"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>

              {}
              <div className={styles.genderSection}>
                <label className={styles.genderLabel}>Выберите пол</label>
                <div className={styles.genderButtons}>
                  {}
                  <button
                    className={`${styles.genderButton} ${selectedGender === "boy" ? styles.selected : ""}`}
                    onClick={() => handleGenderSelect("boy")}
                    name="genderButton"
                  >
                    <div className={styles.genderCard}>
                      <div className={`${styles.genderOverlay} ${styles.maleOverlay}`}></div>
                      <div className={`${styles.genderAvatar} ${styles.maleAvatar}`}>
                        <svg className={styles.genderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <span className={styles.genderText}>Парень</span>
                      <div className={styles.selectedIndicator}>
                        <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                  </button>

                  {}
                  <button
                    className={`${styles.genderButton} ${selectedGender === "girl" ? styles.selected : ""}`}
                    onClick={() => handleGenderSelect("girl")}
                    name="genderButton"
                  >
                    <div className={styles.genderCard}>
                      <div className={`${styles.genderOverlay} ${styles.femaleOverlay}`}></div>
                      <div className={`${styles.genderAvatar} ${styles.femaleAvatar}`}>
                        <svg className={styles.genderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <span className={styles.genderText}>Девушка</span>
                      <div className={styles.selectedIndicator}>
                        <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {}
              <button
                id="startGameBtn"
                className={`${styles.startButton} ${isStartButtonDisabled ? styles.startButtonDisabled : styles.startButtonEnabled}`}
                onClick={handleStartGame}
                disabled={isStartButtonDisabled}
                name="play-button"
              >
                <span className={styles.buttonText}>
                  {isStartButtonDisabled ? "ЗАПОЛНИТЕ ВСЕ ПОЛЯ" : "НАЧАТЬ ИГРУ"}
                </span>
              </button>
            </div>
          </div>

          {}
          <div className={styles.footerInfo}>
            <p className={styles.footerInfoText}>Версия 1.001 • Telegram Mini App</p>
          </div>
        </div>
      </div>
    </div>
  );
};
