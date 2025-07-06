import { useCallback, useMemo, useRef } from "react";

import styles from "./field.module.css";
import { AnimatePresence, motion } from "motion/react";
import { type FieldItem } from "../../provider/game-provider";
import { useField } from "../../hooks";
import { useGameInput } from "../../hooks/use-game-input";

export function Field() {
  const field = useField();
  const fieldRef = useRef<HTMLDivElement>(null);

  useGameInput(fieldRef);

  const itemStyleMap: Record<number, string> = useMemo(() => ({
    2: styles.item2,
    4: styles.item4,
    8: styles.item8,
    16: styles.item16,
    32: styles.item32,
    64: styles.item64,
    128: styles.item128,
    256: styles.item256,
    512: styles.item512,
    1024: styles.item1024,
    2048: styles.item2048,
  }), []);

  const getItemStyle = useCallback((val: number) => {
    return itemStyleMap[val] || styles.item;
  }, [itemStyleMap]);

  return (
    <div className={styles.field} ref={fieldRef}>
      <AnimatePresence mode="popLayout">
        {field?.map((row: FieldItem[]) =>
          row.map(({ value, key }: FieldItem) => (
            <motion.div
              key={key}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 20,
                duration: 0.4,
              }}
              className={[styles.item, getItemStyle(value)].join(" ")}
            >
              {value || ""}
            </motion.div>
          )),
        )}
      </AnimatePresence>
    </div>
  );
}
