import { useDish, useSelectedFood, useScore, useFoodGame } from "../../hooks";
import { FoodTransporter } from "../food-transporter";
import { Pan } from "../pan";
import { Score } from "../score";

export function GameContent() {
  const dish = useDish();
  const selectedFood = useSelectedFood();
  const { score, highScore } = useScore();
  const { game, gameState } = useFoodGame();

  const handleAddToPan = (item: string) => {
    game.addToPan(item);
  };

  const handleRemoveFromPan = (item: string) => {
    game.removeFromPan(item);
  };

  return (
    <div className="foodGame">
      <h2>Собери: {dish.name}</h2>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Score score={score} highScore={highScore} />
      </div>
      <Pan list={selectedFood} onRemove={handleRemoveFromPan} />
      <FoodTransporter list={gameState.foodTransporter} onClick={handleAddToPan} />
    </div>
  );
}
