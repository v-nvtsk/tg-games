import React from "react";
import { gameFlowManager, type FoodGameLevelData } from "../../processes/game-flow/game-flow-manager";
import { useSceneState } from "../../core/state/scene-store";

// Удаляем пустой интерфейс, если props не передаются
// interface FoodGameSceneWrapperProps {}

export const FoodGameSceneWrapper: React.FC = () => {
  const sceneData = useSceneState((state) => state.sceneData);
  // Приводим к конкретному типу FoodGameLevelData, так как знаем, что это FoodGame
  const foodGameLevelData = sceneData as FoodGameLevelData | undefined;

  const handleGoToMap = () => {
    gameFlowManager.startGameMap();
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <div className="absolute top-4 left-4 bg-yellow-800 bg-opacity-75 p-4 rounded-lg text-white pointer-events-auto">
        <h2 className="text-xl font-bold">Food Game</h2>
        <p className="text-md">Уровень: {foodGameLevelData?.levelId || "Загрузка..."}</p>
      </div>

      <div className="absolute top-4 right-4 pointer-events-auto">
        <button
          onClick={handleGoToMap}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-md transition-colors"
        >
          Вернуться на карту (UI)
        </button>
      </div>
    </div>
  );
};
