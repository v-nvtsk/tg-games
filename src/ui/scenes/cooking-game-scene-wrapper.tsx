import React from "react";
import { CookingGame } from "$features/cooking-game";

export const CookingGameSceneWrapper: React.FC = () => {
  return (
    <div style={{ position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10 }}>
      <CookingGame />
    </div>
  );
};
