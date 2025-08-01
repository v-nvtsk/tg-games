import React, { createContext, use } from "react";
import styles from "./style.module.css";

interface Position {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

type StackSide = "left" | "right";

interface PanelStackProps {
  position?: Position;
  gap?: string;
  direction?: "vertical" | "horizontal";
  side?: StackSide; // ✅ добавили
  children: React.ReactNode;
}

const SideContext = createContext<StackSide>("right");

export const usePanelSide = () => use(SideContext);

export const PanelStack: React.FC<PanelStackProps> = ({
  position,
  gap = "12px",
  direction = "vertical",
  side = "right", // ✅ по умолчанию — справа
  children,
}) => {
  return (
    <SideContext value={side}>
      <div
        className={`${styles.stack} ${styles[side]} ${direction === "horizontal" ? styles.horizontal : ""}`}
        style={{ ...position,
          gap }}
      >
        {children}
      </div>
    </SideContext>
  );
};
