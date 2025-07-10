import { createContext } from "react";
import type { FoodGameLogic } from "./food-game-logic";

export const FoodGameContext = createContext<FoodGameLogic | undefined>(undefined);
