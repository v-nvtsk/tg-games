import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx"; // Для удобного управления классами CSS
import styles from "./style.module.css"; // Импортируем новый CSS-модуль

interface ThoughtBubbleProps {
  message: string;
  onClose?: () => void;
  options?: { text: string;
    value: string }[]; // Добавлено для поддержки опций
  onOptionSelected?: (value: string) => void; // Callback для выбора опции
  className?: string; // Для дополнительных стилей, передаваемых извне (например, позиционирование)
}

/**
 * React-компонент "облако мыслей" в стиле комиксов.
 * Состоит из нескольких овалов и отображает текстовое сообщение.
 * Может также содержать кнопки с опциями.
 */
export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
  message,
  onClose,
  options,
  onOptionSelected,
  className, // Этот className будет использоваться для позиционирования контейнера пузыря
}) => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Фокус на первом элементе, если есть опции или кнопка закрытия
    if (bubbleRef.current) {
      const firstFocusable = bubbleRef.current.querySelector(
        "button, a, input, select, textarea",
      ) as HTMLElement;
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [options]);

  return (
    <AnimatePresence>
      <motion.div
        ref={bubbleRef}
        // Оставляем 'absolute' и горизонтальное центрирование.
        // 'bottom-full' удален, так как он предназначен для позиционирования над элементом.
        // Вертикальное позиционирование теперь полностью контролируется через 'className'.
        className={clsx(
          "absolute left-1/2 -translate-x-1/2", // Базовое позиционирование Tailwind
          styles.bubbleContainer, // Класс из CSS-модуля для общей компоновки контейнера пузыря
          className, // Классы, переданные извне (например, для смещения или другого позиционирования)
        )}
        initial={{ opacity: 0,
          y: 20,
          scale: 0.8 }}
        animate={{ opacity: 1,
          y: 0,
          scale: 1 }}
        exit={{ opacity: 0,
          y: 20,
          scale: 0.8 }}
        transition={{ duration: 0.3,
          ease: "easeOut" }}
      >
        {/* Маленькие овалы, имитирующие "мысль" */}
        <div className={styles.smallOvals}>
          <div className={clsx(styles.oval, styles.ovalSmall)}></div>
          <div className={clsx(styles.oval, styles.ovalMedium)}></div>
          <div className={clsx(styles.oval, styles.ovalLarge)}></div>
        </div>

        {/* Основной овал для текста */}
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
      </motion.div>
    </AnimatePresence>
  );
};
