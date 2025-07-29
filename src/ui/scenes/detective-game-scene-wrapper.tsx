import React, { useEffect } from "react";
import { useSceneStore } from "@core/state/scene-store";
import { GameScene } from "@core/types/common-types";
import { DetectiveGame } from "@features/detective-game";

export const DetectiveGameSceneWrapper: React.FC = () => {
  useEffect(() => {
    void useSceneStore.getState().setScene(GameScene.DetectiveGame, {});
  }, []);

  return <DetectiveGame />;
};
