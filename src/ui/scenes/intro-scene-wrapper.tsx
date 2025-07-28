import { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getIntroSlides } from "$features/intro-slides/";
import styles from "./intro-scene-wrapper.module.css";
import { gameFlowManager } from "$/processes";
import { BubbleDialog } from "../../components/bubble-dialog/bubble-dialog";
import { Messagebox } from "../components/messagebox";
import { Button } from "../components/button";

const SLIDE_TIMEOUT = 100;

export const IntroSceneWrapper = () => {
  const slides = useMemo(getIntroSlides, []);
  const [index, setIndex] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [nextLoaded, setNextLoaded] = useState(false);

  // Предзагрузка следующего изображения
  useEffect(() => {
    if (index < slides.length - 1) {
      const img = new Image();
      img.src = slides[index + 1].src;
      img.onload = () => setNextLoaded(true);
    }
  }, [index, slides]);

  const goNext = useCallback(() => {
    if (!canSkip) return;

    // если это не последний слайд, ждём пока предзагрузка завершена
    if (index < slides.length - 1 && !nextLoaded) return;

    setCanSkip(false);
    setNextLoaded(false);

    setIndex((i) => {
      if (i < slides.length - 1) return i + 1;
      gameFlowManager.startGameMap();
      return i;
    });
  }, [canSkip, nextLoaded, slides.length]);

  const slide = slides[index];
  const translateX = -slide.originX * 100;
  const translateY = -slide.originY * 100;

  return (
    <div className={styles.wrapper} onPointerDown={goNext}>
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.key}
          className={styles.slideLayer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={slide.src}
            className={styles.image}
            style={{
              objectPosition: `${slide.originX * 100}% ${slide.originY * 100}%`,
              left: `${slide.positionX * 100}%`,
              top: `${slide.positionY * 100}%`,
              transform: `translate(${translateX}%, ${translateY}%)`,
            }}
            draggable={false}
          />

          {/* Прогрессбар */}
          <motion.div
            className={styles.progress}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: SLIDE_TIMEOUT / 1000 + 2,
              ease: "linear" }}
            onAnimationComplete={() => setCanSkip(true)}
          />

          {/* ✅ возвращаем кнопку с исходным стилем */}
          {canSkip && (
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

      {slide?.message && (
        <div className={styles.messageContainer}>
          <Messagebox text={slide.message} />
        </div>
      )}

      {slide.thoughtBubbleMessage && (
        <BubbleDialog direction="bottomRight" tailPosition={50} character="Алексей" tailLength={40} screenPosition="top">
          {slide.thoughtBubbleMessage.text}
        </BubbleDialog>
      )}

      {index === slides.length - 1 && (
        <Button className={styles.nextBtn} text="К вокзалу" onClick={goNext} />
      )}
    </div>
  );
};
