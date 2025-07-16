import WebApp from "@twa-dev/sdk";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface AuthResponse {
  access_token: string;
}

interface HighScoreResponse {
  highScore: number;
}

export interface FoodGameSaveState {
  character: {
    type: "boy" | "girl";
    hunger: number;
    happiness: number;
  };
  currentRegion: number;
  inventory: {
    id: string;
    name: string;
    happinessValue: number;
  }[];
  regions: {
    id: number;
    name: string;
    requiredHappiness: number;
  }[];
  score: number;
  highScore: number;
}

export const authenticate = async (): Promise<AuthResponse> => {
  if (!WebApp.initData) {
    throw new Error("Telegram initData not available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: WebApp.initData }),
  });

  if (!response.ok) {
    const errorData = await response.json() as { message: string };
    throw new Error(errorData.message || "Authentication failed");
  }

  return response.json() as Promise<AuthResponse>;
};

// Обновляем функции
export const get2048HighScore = async (token: string): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/game2048/high-score`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return 0;

  const data = (await response.json()) as HighScoreResponse;
  return data.highScore;
};

export const update2048HighScore = async (token: string, score: number): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/game2048/high-score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ score }),
  });

  const data = (await response.json()) as HighScoreResponse;
  return data.highScore;
};

export const getFoodGameState = async (token: string): Promise<FoodGameSaveState | null> => {
  const response = await fetch(`${API_BASE_URL}/food-game`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.ok ? response.json() as unknown as FoodGameSaveState : null;
};

export const saveFoodGameState = async (token: string, state: FoodGameSaveState): Promise<FoodGameSaveState> => { const response = await fetch(`${API_BASE_URL}/food-game`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(state),
});

return response.json() as unknown as FoodGameSaveState;
};
