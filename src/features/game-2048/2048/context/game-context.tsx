import { createContext } from "react";
import type { GameInterface } from "../provider/game-provider";

export const Game2048Context = createContext<GameInterface | undefined>(undefined);
