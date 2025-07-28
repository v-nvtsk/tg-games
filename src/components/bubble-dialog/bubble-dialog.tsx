import type React from "react";
import clsx from "clsx";
import styles from "./style.module.css";

export interface BubbleDialogProps {
  className?: string;
  children: React.ReactNode;
  direction?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  character?: string;
  tailLength?: number;
  tailPosition?: number;
  screenPosition?: "auto" | "top" | "bottom";
}

export const BubbleDialog: React.FC<BubbleDialogProps> = ({
  className,
  children,
  direction = "bottomLeft",
  character,
  tailLength = 20,
  tailPosition = 50,
  screenPosition = "auto",
}) => {
  const tailPos = Math.max(40, Math.min(160, tailPosition * 2));
  const isTop = direction.startsWith("top");
  const isBottom = direction.startsWith("bottom");
  const isLeft = direction.toLowerCase().endsWith("left");
  const isRight = direction.toLowerCase().endsWith("right");
  const totalHeight = 125 + tailLength;

  const finalScreenPosition =
 screenPosition === "auto" ? (isTop ? "bottom" : "top") : screenPosition;

  const wrapperPosition =
 finalScreenPosition === "top" ? styles.wrapperTop : styles.wrapperBottom;

  const generatePath = () => {
    const dx = 0; /* половина ширины горловины */
    const incline = 20; /*  наклон обеих границ */

    const leftMouthX = tailPos + dx + (isLeft ? incline : 0);
    const rightMouthX = tailPos - dx - (isRight ? incline : 0);

    if (isTop) {
      return `
      M20,${tailLength + 10}
      C20,${tailLength} 30,${tailLength - 5} 40,${tailLength - 5}
      L${rightMouthX},${tailLength - 5}
      L${tailPos},0
      L${leftMouthX},${tailLength - 5}
      L160,${tailLength - 5}
      C170,${tailLength - 5} 180,${tailLength} 180,${tailLength + 20}
      L180,${totalHeight - 20}
      C180,${totalHeight - 10} 170,${totalHeight} 160,${totalHeight}
      L40,${totalHeight}
      C30,${totalHeight} 20,${totalHeight - 10} 20,${totalHeight - 20}
      Z`;
    }

    if (isBottom) {

      return `
      M20,20
      C20,10 30,5 40,5
      L160,5
      C170,5 180,10 180,20
      L180,${totalHeight - tailLength - 20}
      C180,${totalHeight - tailLength - 10} 170,${totalHeight - tailLength} 160,${totalHeight - tailLength}
      L${leftMouthX},${totalHeight - tailLength}
      L${tailPos},${totalHeight}
      L${rightMouthX},${totalHeight - tailLength}
      L40,${totalHeight - tailLength}
      C30,${totalHeight - tailLength} 20,${totalHeight - tailLength - 10} 20,${totalHeight - tailLength - 20}
      Z`;
    }

    return "";
  };

  const align = isTop ? "flex-end" : isBottom ? "flex-start" : "center";

  let nameplateVars: Record<string, string> = {};
  if (isTop) {
    nameplateVars = { "--nameplate-top": "0",
      "--nameplate-translate-y": "-50%" };
  } else if (isBottom) {
    nameplateVars = { "--nameplate-bottom": "0",
      "--nameplate-translate-y": "calc(15px - 50%)" };
  }

  if (isLeft) {
    nameplateVars = { ...nameplateVars,
      "--nameplate-right": "0",
      "--nameplate-translate-x": "-100%" };
  } else if (isRight) {
    nameplateVars = { ...nameplateVars,
      "--nameplate-right": "0",
      "--nameplate-translate-x": "-100%" };
  } else {
    nameplateVars = { ...nameplateVars,
      "--nameplate-right": "0",
      "--nameplate-translate-x": "-50%" };
  }

  return (
    <div
      className={clsx(styles.bubbleWrapper, wrapperPosition, className)}
      style={{ height: `${totalHeight}px`,
        ["--bubble-align" as string]: align }}
    >
      <svg className={styles.bubble} viewBox={`0 0 200 ${totalHeight}`} preserveAspectRatio="none">
        <path d={generatePath()} fill="#C8BFA2" stroke="#877254" strokeWidth="2" />
      </svg>

      <div className={styles.content} style={{ ...nameplateVars }} data-character={character}>
        {children}
      </div>
    </div>
  );
};
