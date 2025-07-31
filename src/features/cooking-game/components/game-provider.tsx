import React, { createContext, useContext, useReducer } from 'react';

// Типы для игры
export interface VegetablePiece {
  id: string;
  type: 'carrot' | 'tomato' | 'cucumber' | 'pepper' | 'mushroom' | 'potato' | 'onion' | 'garlic';
  shape: number[][];
  color: string;
}

export interface GameState {
  board: (VegetablePiece | null)[][];
  currentPiece: VegetablePiece | null;
  score: number;
  isGameOver: boolean;
  level: number;
}

export interface GameAction {
  type: 'PLACE_PIECE' | 'CLEAR_LINES' | 'NEW_PIECE' | 'GAME_OVER' | 'RESTART' | 'UPDATE_SCORE';
  payload?: any;
}

// Начальное состояние
const initialState: GameState = {
  board: Array(8).fill(null).map(() => Array(8).fill(null)),
  currentPiece: null,
  score: 0,
  isGameOver: false,
  level: 1,
};

// Фигуры овощей
export const vegetableShapes: VegetablePiece[] = [
  {
    id: 'carrot-1',
    type: 'carrot',
    shape: [[1, 1], [1, 0]],
    color: '#FF6B35'
  },
  {
    id: 'carrot-2',
    type: 'carrot',
    shape: [[1, 1, 1], [0, 1, 0]],
    color: '#FF6B35'
  },
  {
    id: 'tomato-1',
    type: 'tomato',
    shape: [[1, 1, 1]],
    color: '#FF4444'
  },
  {
    id: 'tomato-2',
    type: 'tomato',
    shape: [[1, 1], [1, 1]],
    color: '#FF4444'
  },
  {
    id: 'cucumber-1',
    type: 'cucumber',
    shape: [[1], [1], [1]],
    color: '#4CAF50'
  },
  {
    id: 'cucumber-2',
    type: 'cucumber',
    shape: [[1, 1, 1, 1]],
    color: '#4CAF50'
  },
  {
    id: 'pepper-1',
    type: 'pepper',
    shape: [[1, 1], [0, 1]],
    color: '#FF9800'
  },
  {
    id: 'pepper-2',
    type: 'pepper',
    shape: [[1, 0], [1, 1], [1, 0]],
    color: '#FF9800'
  },
  {
    id: 'mushroom-1',
    type: 'mushroom',
    shape: [[1, 1], [1, 1]],
    color: '#8D6E63'
  },
  {
    id: 'mushroom-2',
    type: 'mushroom',
    shape: [[1, 1, 1], [0, 1, 0], [0, 1, 0]],
    color: '#8D6E63'
  },
  {
    id: 'potato-1',
    type: 'potato',
    shape: [[1, 1, 1], [0, 1, 0]],
    color: '#795548'
  },
  {
    id: 'potato-2',
    type: 'potato',
    shape: [[1, 1], [1, 1], [1, 1]],
    color: '#795548'
  },
  // 1 ячейка
  {
    id: 'onion-1',
    type: 'onion',
    shape: [[1]],
    color: '#9C27B0'
  },
  // 2 ячейки по вертикали
  {
    id: 'garlic-1',
    type: 'garlic',
    shape: [[1], [1]],
    color: '#FFEB3B'
  },
  // Зигзаг cucumber
  {
    id: 'zucchini-1',
    type: 'cucumber',
    shape: [[1, 1, 0], [0, 1, 1]],
    color: '#8BC34A'
  },
  {
    id: 'zucchini-2',
    type: 'cucumber',
    shape: [[0, 1, 1], [1, 1, 0]],
    color: '#8BC34A'
  }
];

// Редьюсер
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_PIECE':
      return {
        ...state,
        board: action.payload.board,
        currentPiece: null
      };
    
    case 'NEW_PIECE':
      return {
        ...state,
        currentPiece: action.payload.piece
      };
    
    case 'CLEAR_LINES':
      return {
        ...state,
        board: action.payload.board,
        score: state.score + action.payload.points
      };
    
    case 'UPDATE_SCORE':
      return {
        ...state,
        score: action.payload.score
      };
    
    case 'GAME_OVER':
      return {
        ...state,
        isGameOver: true
      };
    
    case 'RESTART':
      return initialState;
    
    default:
      return state;
  }
}

// Контекст
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

// Хук для использования контекста
export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

// Провайдер
interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
} 