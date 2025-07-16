// === src/ui/components/GoButton.tsx ===
import React from "react";
import styles from "./style.module.css";

interface GoButtonProps {
  onClick: () => void;
  text?: string;
}

export const GoButton: React.FC<GoButtonProps> = ({ onClick, text = "Идти" }) => {
  return (
    <button className={styles.goButton} onClick={onClick}>
      <span className={styles.buttonText}>{text}</span>
      <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
      </svg>
    </button>
  );
};
