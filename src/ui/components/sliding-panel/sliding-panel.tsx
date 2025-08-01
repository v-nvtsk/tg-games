import { useState, useRef, useEffect } from "react";
import styles from "./style.module.css";

interface Props {
  buttonText: string;
  buttonAction: () => void;
  infoText: string;
  iconSrc: string;
  side?: "left" | "right";
}

export const SlidingPanel = ({
  buttonAction,
  buttonText,
  infoText,
  iconSrc,
  side = "right",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    buttonAction();
    setIsOpen(false);
  };

  return (
    <div
      ref={panelRef}
      className={`${styles.panel} ${styles[side]} ${isOpen ? styles.open : ""}`}
      onClick={togglePanel}
    >
      <img src={iconSrc} className={styles.icon} />
      <div className={styles.content}>
        <span className={styles.text}>{infoText}</span>
        <button
          className={styles.button}
          onClick={handleButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
