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

export type BubbleType = "speech" | "thought";

interface ThoughtBubbleProps {
  message: string;
  onClose?: () => void;
  options?: { text: string;
    value: string }[];
  onOptionSelected?: (value: string) => void;
  className?: string;
  position?: ThoughtBubblePosition;
  characterName?: string;
  bubbleType?: BubbleType;
}

const bubbleVariants = {
  initial: { opacity: 0,
    scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3,
      ease: "easeOut" as Easing },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2,
      ease: "easeIn" as Easing },
  },
};

export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
  message,
  className,
  characterName = "Алексей",
  bubbleType = "speech",
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
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        ref={bubbleRef}
        className={clsx(
          styles.bubbleContainer,
          className,
        )}
        variants={bubbleVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className={styles.bubbleWrapper}>
          <svg 
            className={styles.svgBackground} 
            viewBox="0 0 2539 1084" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2372.38 1083.83H154.248C69.2166 1083.83 0 1014.66 0 929.628V418.205C0 333.173 69.1755 263.998 154.248 263.998H2372.42C2457.46 263.998 2526.67 333.173 2526.67 418.205V929.628C2526.67 1014.66 2457.5 1083.83 2372.42 1083.83H2372.38ZM154.248 309.143C94.1099 309.143 45.1859 358.067 45.1859 418.164V929.586C45.1859 989.725 94.1099 1038.61 154.248 1038.61H2372.42C2432.56 1038.61 2481.49 989.684 2481.49 929.586V418.164C2481.49 358.026 2432.56 309.143 2372.42 309.143H154.248Z" fill="#665B3C"/>
            <path d="M2384.71 1071.51H166.572C81.5408 1071.51 12.3242 1002.34 12.3242 917.303V405.881C12.3242 320.849 81.4997 251.674 166.572 251.674H2384.75C2469.78 251.674 2539 320.849 2539 405.881V917.303C2539 1002.34 2469.82 1071.51 2384.75 1071.51H2384.71ZM166.572 296.819C106.434 296.819 57.5101 345.743 57.5101 405.84V917.262C57.5101 977.401 106.434 1026.28 166.572 1026.28H2384.75C2444.89 1026.28 2493.81 977.359 2493.81 917.262V405.84C2493.81 345.701 2444.89 296.819 2384.75 296.819H166.572Z" fill="#AE966C"/>
            <path d="M2372.38 1083.83H154.248C69.2166 1083.83 0 1014.66 0 929.628V418.205C0 333.173 69.1755 263.998 154.248 263.998H2372.42C2457.46 263.998 2526.67 333.173 2526.67 418.205V929.628C2526.67 1014.66 2457.5 1083.83 2372.42 1083.83H2372.38ZM154.248 309.143C94.1099 309.143 45.1859 358.067 45.1859 418.164V929.586C45.1859 989.725 94.1099 1038.61 154.248 1038.61H2372.42C2432.56 1038.61 2481.49 989.684 2481.49 929.586V418.164C2481.49 358.026 2432.56 309.143 2372.42 309.143H154.248Z" fill="#665B3C"/>
            <path d="M0.291016 938.952V409.168L15.6953 675.97L0.291016 938.952Z" fill="#AE966C"/>
            <path d="M2481.45 418.16V929.583L2500.38 778.456L2481.45 418.16Z" fill="#AE966C"/>
            <path d="M2372.39 1038.65H166.576L2105.09 1053.27L2372.39 1038.65Z" fill="#C1AF91"/>
            <path d="M154.254 263.961H2372.39L2102.26 281.501L154.254 263.961Z" fill="#C1AF91"/>
            <path d="M2372.39 286.548H1339.52L1652.82 0.5625L1099.99 286.548H154.249C81.5408 286.548 22.5938 345.495 22.5938 418.204V929.626C22.5938 1002.33 81.5408 1061.28 154.249 1061.28H2372.43C2445.13 1061.28 2504.08 1002.33 2504.08 929.626V418.204C2504.08 345.495 2445.13 286.548 2372.43 286.548H2372.39Z" fill="url(#paint0_linear_248_288)"/>
            <path d="M1652.82 0.5625L1110.96 283.098H1066.68L1652.82 0.5625Z" fill="#665B3C"/>
            <path d="M1652.82 0.5625L1346.29 282.605H1383.06L1652.82 0.5625Z" fill="#665B3C"/>
            <path d="M1652.82 0.5625L1121.06 263.955L1087.09 263.298L1067.66 261.737L1652.82 0.5625Z" fill="#AE966C"/>
            <path d="M154.254 1061.24L2311.92 1073.2L2390.05 1061.24H154.254Z" fill="#AE966C"/>
            <defs>
              <linearGradient id="paint0_linear_248_288" x1="2348.97" y1="94.5902" x2="258.834" y2="1209.86" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C8BFA2"/>
                <stop offset="1" stopColor="#B2A787"/>
              </linearGradient>
            </defs>
          </svg>
          
          <div className={styles.content}>
            <p className={clsx(styles.messageText, {
              [styles.thoughtText]: bubbleType === "thought"
            })}>{message}</p>
          </div>

          {characterName && (
            <div className={styles.nameTag}>
              <svg 
                className={styles.nameTagSvg} 
                viewBox="0 0 821 243" 
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M784.43 6H36.3979C19.6097 6 6 19.6095 6 36.3978V206.666C6 223.455 19.6097 237.064 36.3979 237.064H784.43C801.219 237.064 814.828 223.455 814.828 206.666V36.3978C814.828 19.6095 801.219 6 784.43 6Z" fill="#665B3C" stroke="#AE966C" strokeWidth="11.6662" strokeMiterlimit="10"/>
              </svg>
              <span className={styles.characterName}>{characterName}</span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
