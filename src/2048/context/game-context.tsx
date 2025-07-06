import { createContext } from "react";
import type { GameInterface } from "../provider/game-provider";

export const GameContext = createContext<GameInterface | undefined>(undefined);
