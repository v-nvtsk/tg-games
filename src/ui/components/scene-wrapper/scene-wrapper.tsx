import React from "react";
import { CloseIcon } from "@ui/icons/close-icon";

interface SceneWrapperProps {
  title: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
  closeLabel?: string;
  styles?: CSSModuleClasses;
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  title,
  description,
  onClose,
  children,
  closeLabel = "Закрыть",
  styles,
}) => {
  return (
    <div className={styles?.sceneWrapper || ""}>
      <div className={styles?.infoBox || ""}>
        <button
          className={styles?.closeButton || ""}
          onClick={onClose}
          aria-label={closeLabel}
        >
          <CloseIcon />
        </button>

        <h2 className={styles?.title || ""}>{title}</h2>
        {description && <p className={styles?.description || ""}>{description}</p>}

        {children}
      </div>
    </div>
  );
};
