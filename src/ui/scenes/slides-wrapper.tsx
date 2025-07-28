import { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Episode, type Action } from "$features/slides";
import styles from "./slides-wrapper.module.css";
import { ThoughtBubble } from "../../components";
import { Button } from "../components/button";
import { Messagebox } from "../components/messagebox";

const SLIDE_TIMEOUT = 100;

interface SlidesWrapperProps {
  createSlides: () => Episode[];
  onComplete: () => void;
  episodeNumber: number;
}

export const SlidesWrapper = ({ createSlides, onComplete, episodeNumber }: SlidesWrapperProps) => {
  const slides = useMemo(createSlides, []);
  const [slideIndex, setSlideIndex] = useState(episodeNumber);
  const [actionIndex, setActionIndex] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  const currentSlide = slides[slideIndex];
  const currentActions = currentSlide?.actions || [];
  const currentAction = actionIndex >= 0 && actionIndex < currentActions.length
    ? currentActions[actionIndex]
    : null;

  const translateX = -currentSlide.originX * 100;
  const translateY = -currentSlide.originY * 100;
  const showSkipButton = currentAction?.type !== "button" && currentAction?.type !== "choice";

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const processUpdate = useCallback(() => {
    if (currentActions.length > 0 && actionIndex < currentActions.length - 1) {
      setActionIndex(actionIndex + 1);
    } else {
      if (slideIndex < slides.length - 1) {
        setSlideIndex((prev) => prev + 1);
        setActionIndex(-1);
        setImageLoaded(false);
      } else {
        onComplete();
      }
    }
  }, [actionIndex, currentActions.length, slideIndex, slides]);

  const goNext = useCallback(() => {
    if (!canSkip) return;
    setCanSkip(false);

    processUpdate();
  }, [processUpdate, canSkip]);

  const handleActionButtonClick = useCallback((action: Action) => {
    if (action?.button?.action) {
      action.button.action();
    }
    processUpdate();
  }, [processUpdate]);

  const handleChoiceSelect = useCallback((option: string) => {
    currentActions.splice(actionIndex + 1, 0, {
      type: "thoughts",
      text: option,
    });
    processUpdate();
  }, [processUpdate]);

  useEffect(() => {
    if (imageLoaded && actionIndex === -1) {
      if (currentActions.length === 0) {
        setCanSkip(true);
      }
    }
  }, [imageLoaded, actionIndex]);

  useEffect(() => {
    if (showSkipButton) {
      const timer = setTimeout(() => {
        setCanSkip(true);
      }, SLIDE_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [imageLoaded, actionIndex]);

  return (
    <div className={styles.wrapper} onPointerDown={goNext}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.key}
          className={styles.slideLayer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={currentSlide.src}
            className={styles.image}
            style={{
              objectPosition: `${currentSlide.originX * 100}% ${currentSlide.originY * 100}%`,
              left: `${currentSlide.positionX * 100}%`,
              top: `${currentSlide.positionY * 100}%`,
              transform: `translate(${translateX}%, ${translateY}%)`,
            }}
            draggable={false}
            onLoad={handleImageLoad}
          />

          {/* Кнопка "Далее" показывается по истечении таймаута */}
          {canSkip && showSkipButton && (
            <motion.button
              className={styles.nextBtn}
              initial={{ scale: 0,
                opacity: 0 }}
              animate={{ scale: 1.2,
                opacity: 1 }}
              transition={{ type: "spring",
                stiffness: 280 }}
              onPointerDown={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Отображение actions */}
      <AnimatePresence mode="wait">
        {currentAction && (
          <motion.div
            key={`${slideIndex}-${actionIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Message action */}
            {currentAction.type === "message" && currentAction.text && (
              <div className={styles.messageContainer}>
                <Messagebox text={currentAction.text} />
              </div>
            )}

            {/* Thoughts action */}
            {currentAction.type === "thoughts" && currentAction.text && (
              <ThoughtBubble
                message={currentAction.text}
                bubbleType="thought"
                characterName={currentAction.characterName}
              />
            )}

            {/* Speech action */}
            {currentAction.type === "speech" && currentAction.text && (
              <ThoughtBubble
                message={currentAction.text}
                bubbleType="speech"
                characterName={currentAction.characterName}
              />
            )}

            {/* Choice action */}
            {currentAction.type === "choice" && currentAction.options && (
              <>
                <div className={styles.choiceContainer}>
                  <div className={styles.choiceMessage}>
                    <Messagebox text={
                      currentAction.characterName && currentAction.text
                        ? `${currentAction.characterName}: ${currentAction.text}`
                        : currentAction.text || "Выберите вариант:"
                    } />
                  </div>
                  <div className={styles.choiceOptions}>
                    {currentAction.options.map((option, index) => (
                      <Button
                        key={`options-${index}`}
                        text={option}
                        onClick={() => handleChoiceSelect(option)}
                        className={styles.choiceButton}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Button action */}
            {currentAction.type === "button" && currentAction.button && (
              <div className={styles.actionButtonContainer}>
                <Button
                  text={currentAction.button.text}
                  onClick={() => handleActionButtonClick(currentAction)}
                  className={styles.actionButton}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
