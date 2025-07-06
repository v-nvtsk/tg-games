// === src/gameContext.ts ===

import { useRef, type PropsWithChildren } from "react";
import { GameContext } from "../context/game-context";

// Константа для размера сетки
const GRID_SIZE = 4;

// Интерфейсы (можно импортировать из logic.ts, если вы хотите их там оставить)
export interface GameInterface {
  state: GameState;
  moveLeft(): void;
  moveRight(): void;
  moveUp(): void;
  moveDown(): void;
  restart(): void;
  spawn(): void;
  subscribe(callback: (state: GameState) => void): void;
  unsubscribe(callback: (state: GameState) => void): void;
}

export interface GameState {
  highScore: number;
  score: number;
  level?: number;
  field: FieldItem[][];
  over: boolean;
  won?: boolean;
}

export interface FieldItem {
  value: number;
  key: string;
}

const defaultState: GameState = {
  highScore: 0,
  score: 0,
  field: [],
  over: false,
  won: false,
};

class Game implements GameInterface {
  state: GameState = { ...defaultState };
  subscribers = new Set<(state: GameState) => void>();
  idKey = 0;

  constructor() {
    this.init(); // Инициализирует состояние из defaultState (highScore: 0)
    // Загружаем highScore из localStorage только после инициализации defaultState
    const storedHighScore = Number(localStorage.getItem("highScore"));
    if (!isNaN(storedHighScore) && storedHighScore > 0) {
      this.state.highScore = storedHighScore; // Устанавливаем загруженное значение
    }
  }

  init() {
    // При рестарте или инициализации сбрасываем счет и поле, но сохраняем лучший результат
    this.state = {
      ...defaultState,
      highScore: this.state.highScore, // Сохраняем текущий highScore
    };
    this.state.field = this.generateField();
  }

  subscribe(callback: (state: GameState) => void) {
    this.subscribers.add(callback);
  }

  unsubscribe(callback: (state: GameState) => void): void {
    this.subscribers.delete(callback);
  }

  on() {
    // Уведомляем всех подписчиков о новом состоянии (создаем новую копию, чтобы React видел изменения)
    this.subscribers.forEach((callback) => callback({ ...this.state, field: this.deepCopyField(this.state.field) }));
  }

  spawn(): void {
    const emptyCells: { row: number; col: number }[] = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (this.state.field[i][j].value === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      this.state.over = true;
    } else {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.state.field[row][col] = { value: Math.floor(Math.random() > 0.5 ? 4 : 2), key: this.generateUniqueKey() }; // Создаем новый объект FieldItem
    }
    this.on();
  }

  // Вспомогательная функция для обработки строк/столбцов
  private processRow(row: FieldItem[]): { newRow: FieldItem[], scoreIncrease: number } { // 'newScore' удален, т.к. не использовался
    const filteredRow = row.filter(({ value }) => value !== 0);
    const mergedRow: FieldItem[] = [];
    let scoreIncrease = 0;
    let j = 0;

    while (j < filteredRow.length) {
      if (j + 1 < filteredRow.length && filteredRow[j].value === filteredRow[j + 1].value) {
        const newValue = filteredRow[j].value * 2;
        mergedRow.push({ value: newValue, key: this.generateUniqueKey() }); // Создаем новый объект для слитой ячейки
        scoreIncrease += newValue;
        j += 2;
      } else {
        mergedRow.push({ ...filteredRow[j] }); // Копируем существующий объект
        j += 1;
      }
    }

    while (mergedRow.length < GRID_SIZE) {
      mergedRow.push({ value: 0, key: this.generateUniqueKey() }); // Добавляем пустые ячейки с новыми ключами
    }
    return { newRow: mergedRow, scoreIncrease };
  }

  moveLeft(): void {
    const originalField = this.deepCopyField(this.state.field);
    let newScore = this.state.score;
    const newField: FieldItem[][] = originalField.map(() => []); // Создаем новую структуру поля

    for (let i = 0; i < GRID_SIZE; i++) {
      const { newRow, scoreIncrease } = this.processRow(originalField[i]); // 'newScore' удален
      newField[i] = newRow;
      newScore += scoreIncrease;
    }

    const changed = !this.areArraysEqual(newField, originalField);
    if (changed) {
      this.state.field = newField;
      this.state.score = newScore;
      this.spawn();
    }
    const shouldNotify = this.checkIsOver() || changed;
    if (shouldNotify) {
      this.on();
    }
  }

  moveRight(): void {
    const originalField = this.deepCopyField(this.state.field);
    let newScore = this.state.score;
    const newField: FieldItem[][] = originalField.map(() => []);

    for (let i = 0; i < GRID_SIZE; i++) {
      const reversedRow = [...originalField[i]].reverse();
      const { newRow, scoreIncrease } = this.processRow(reversedRow); // 'newScore' удален
      newField[i] = newRow.reverse(); // Возвращаем в правильном порядке
      newScore += scoreIncrease;
    }

    const changed = !this.areArraysEqual(newField, originalField);
    if (changed) {
      this.state.field = newField;
      this.state.score = newScore;
      this.spawn();
    }
    const shouldNotify = this.checkIsOver() || changed;
    if (shouldNotify) {
      this.on();
    }
  }

  moveUp(): void {
    const originalField = this.deepCopyField(this.state.field);
    let newScore = this.state.score;
    const transposed = this.transpose(originalField);
    const newTransposed: FieldItem[][] = transposed.map(() => []);

    for (let i = 0; i < GRID_SIZE; i++) {
      const { newRow, scoreIncrease } = this.processRow(transposed[i]); // 'newScore' удален
      newTransposed[i] = newRow;
      newScore += scoreIncrease;
    }

    const newField = this.transpose(newTransposed); // Обратное транспонирование
    const changed = !this.areArraysEqual(newField, originalField);
    if (changed) {
      this.state.field = newField;
      this.state.score = newScore;
      this.spawn();
    }
    const shouldNotify = this.checkIsOver() || changed;
    if (shouldNotify) {
      this.on();
    }
  }

  moveDown(): void {
    const originalField = this.deepCopyField(this.state.field);
    let newScore = this.state.score;
    const transposed = this.transpose(originalField);
    const newTransposed: FieldItem[][] = transposed.map(() => []);

    for (let i = 0; i < GRID_SIZE; i++) {
      const reversedCol = [...transposed[i]].reverse();
      const { newRow, scoreIncrease } = this.processRow(reversedCol); // 'newScore' удален
      newTransposed[i] = newRow.reverse(); // Возвращаем в правильном порядке
      newScore += scoreIncrease;
    }

    const newField = this.transpose(newTransposed);
    const changed = !this.areArraysEqual(newField, originalField);
    if (changed) {
      this.state.field = newField;
      this.state.score = newScore;
      this.spawn();
    }
    const shouldNotify = this.checkIsOver() || changed;
    if (shouldNotify) {
      this.on();
    }
  }

  private checkScore(): void {
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      localStorage.setItem("highScore", String(this.state.highScore)); // Прямой вызов, без Promise
    }
  }

  private checkIsOver(): boolean {
    this.checkScore();

    // Если есть нулевые ячейки — игра не окончена
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (this.state.field[i][j].value === 0) {
          this.state.over = false;
          return this.state.over;
        }
      }
    }

    // Проверяем соседние ячейки на возможность слияния (горизонтально)
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 1; j++) {
        if (this.state.field[i][j].value === this.state.field[i][j + 1].value) {
          this.state.over = false;
          return this.state.over;
        }
      }
    }

    // Проверяем соседние ячейки на возможность слияния (вертикально)
    for (let j = 0; j < GRID_SIZE; j++) {
      for (let i = 0; i < GRID_SIZE - 1; i++) {
        if (this.state.field[i][j].value === this.state.field[i + 1][j].value) {
          this.state.over = false;
          return this.state.over;
        }
      }
    }

    this.state.over = true;
    return this.state.over;
  }

  restart(): void {
    this.init();
    this.spawn();
    this.spawn();
    this.on(); // Уведомляем UI о новом состоянии игры
  }

  private transpose<T>(matrix: T[][]): T[][] {
    if (matrix.length === 0 || matrix[0].length === 0) return [];
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  private generateField(): FieldItem[][] {
    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ value: 0, key: this.generateUniqueKey() })),
    );
  }

  private areArraysEqual(a: FieldItem[][], b: FieldItem[][]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].length !== b[i].length) return false;
      for (let j = 0; j < a[i].length; j++) {
        // Сравниваем только value, ключи могут отличаться, если это новые объекты
        if (a[i][j].value !== b[i][j].value) return false;
      }
    }
    return true;
  }

  private deepCopyField(field: FieldItem[][]): FieldItem[][] {
    return field.map((row) => row.map((item) => ({ ...item })));
  }

  generateUniqueKey(): string {
    this.idKey += 1;
    return String(this.idKey);
  }
}

export const GameProvider = ({ children }: PropsWithChildren) => {
  const gameRef = useRef<GameInterface | null>(null);

  if (!gameRef.current) {
    gameRef.current = new Game();
    // Инициализация игры при первом создании экземпляра
    gameRef.current.spawn();
    gameRef.current.spawn();
  }

  return (
    <GameContext value={gameRef.current}>
      {children}
    </GameContext>
  );
};
