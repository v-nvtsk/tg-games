import React from "react";
import styles from "./menu-button.module.css";

interface MenuButtonProps {
  onOpen: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onOpen }) => {
  return (
    <button className={styles.menuBtn} onClick={onOpen}>
      ☰
    </button>
  );
};
