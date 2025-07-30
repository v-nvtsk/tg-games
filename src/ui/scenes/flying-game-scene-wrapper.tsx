// src/ui/scenes/FlyingGameSceneWrapper.tsx

import React, { useEffect } from "react";
import { useSceneStore } from "../../core/state/scene-store";
import { GameScene } from "@core/types/common-types";

export const FlyingGameSceneWrapper: React.FC = () => {
  useEffect(() => {
    void useSceneStore.getState().setScene(GameScene.FlyingGame, {});
  }, []);

  return null;
};
