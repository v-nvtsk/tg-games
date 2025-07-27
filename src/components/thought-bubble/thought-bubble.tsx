import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import styles from "./style.module.css";
import { type Easing } from "framer-motion";

export type ThoughtBubblePosition =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

interface ThoughtBubbleProps {
  message: string;
  onClose?: () => void;
  options?: { text: string;
    value: string }[];
  onOptionSelected?: (value: string) => void;
  className?: string;
  position?: ThoughtBubblePosition; // Добавлен параметр position
}

const ovalVariants = {
  initial: { opacity: 0,
    scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3,
      ease: "easeOut" as Easing }, // Явное указание типа Easing
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.2,
      ease: "easeIn" as Easing }, // Явное указание типа Easing
  },
};

export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
  message,
  onClose,
  options,
  onOptionSelected,
  className,
  position = "topCenter", // Значение по умолчанию
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bubbleRef.current) {
      const firstFocusable = bubbleRef.current.querySelector(
        "button, a, input, select, textarea",
      ) as HTMLElement;
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [options]);

  const isBottom = position.startsWith("bottom"); // Проверяем, находится ли облачко внизу

  return (
    <AnimatePresence>
      <motion.div
        ref={bubbleRef}
        className={clsx(
          styles.bubbleContainer,
          className,
          styles[position],
          { [styles.bottom]: isBottom },
        )}
        initial={{ opacity: 0,
          scale: 0.8 }}
        animate={{ opacity: 1,
          scale: 1 }}
        exit={{ opacity: 0,
          scale: 0.8 }}
        transition={{ duration: 0.3,
          ease: "easeOut" as Easing }}
      >
        {/* <div className={clsx(
          { [styles.bottom]: isBottom })}> */}
        <motion.div
          className={clsx(styles.oval, styles.ovalSmall)}
          variants={ovalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: 0.2,
            ease: "easeOut" as Easing }}
        />
        <motion.div
          className={clsx(styles.oval, styles.ovalMedium)}
          variants={ovalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ delay: 0.1,
            ease: "easeOut" as Easing }}
        />
        <motion.div
          className={clsx(styles.oval, styles.ovalLarge)}
          variants={ovalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />

        <div className={styles.mainBubble}>
          <p className={styles.messageText}>{message}</p>

          {options && options.length > 0 && (
            <div className={styles.optionsContainer}>
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onOptionSelected?.(option.value)}
                  className={styles.optionButton}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Закрыть"
            >
              &times;
            </button>
          )}
        </div>
        {/* </div> */}
      </motion.div>
    </AnimatePresence>
  );
};
