import { CloseIcon } from "@ui/icons/close-icon";
import defaultStyles from "./default-scene-wrapper.module.css";
import type { FC } from "react";

interface SceneWrapperStyles {
  sceneWrapper?: string;
  infoBox?: string;
  closeButton?: string;
  title?: string;
  description?: string;
}

interface SceneWrapperProps {
  title: string;
  description?: string;
  onClose: () => void;
  children?: React.ReactNode;
  closeLabel?: string;
  styles?: SceneWrapperStyles;
}

export const SceneWrapper: FC<SceneWrapperProps> = ({
  title,
  description,
  onClose,
  children,
  closeLabel = "Закрыть",
  styles = null,
}) => {
  if (!styles)styles = {};

  return (
    <div className={`${defaultStyles.sceneWrapper} ${styles.sceneWrapper || ""}`}>
      <div className={`${defaultStyles.infoBox} ${styles.infoBox || ""}`}>
        <button
          className={`${defaultStyles.closeButton} ${styles.closeButton || ""}`}
          onClick={onClose}
          aria-label={closeLabel}
        >
          <CloseIcon />
        </button>

        <h2 className={`${defaultStyles.title} ${styles.title || ""}`}>{title}</h2>
        {description && (
          <p className={`${defaultStyles.description} ${styles.description || ""}`}>
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};
