import React from "react";
import { gameFlowManager } from "@processes/game-flow/game-flow-manager";
import { useSceneStore } from "@core/state/scene-store";
import type { CookingGameData } from "@core/types/common-types";
import { CookingGame } from "$features/cooking-game";

export const CookingGameSceneWrapper: React.FC = () => {
  const sceneData = useSceneStore((state) => state.sceneData);
  const cookingGameData = sceneData as CookingGameData;

  const handleGoToMap = () => {
    gameFlowManager.startGameMap();
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
      <CookingGame />
      
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <button
          onClick={handleGoToMap}
          style={{ backgroundColor: '#ff0000', color: '#fff', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.5rem', transition: 'background-color 0.3s ease' }}
        >
          Вернуться на карту
        </button>
      </div>
    </div>
  );
}; 