export interface Character {
  type: "boy" | "girl";
  hunger: number; // 0-100
  happiness: number; // 0-100
}

export interface Region {
  id: number;
  name: string;
  requiredHappiness: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  happinessValue: number;
}

export interface FoodGameState {
  character: Character;
  currentRegion: number;
  regions: Region[];
  inventory: InventoryItem[];
  maxInventorySize: number;

  currentQuestion: number; // текущий вопрос
  quizStarted: boolean; // викторина начата

  score: number;
  highScore: number;

  dish: string;
}

// === ./src/games/food/context/food-game-logic.ts ===
// Добавим в начало файла
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
}

export type RegionQuiz = Record<number, QuizQuestion[]>;

// Добавим после regions
export const regionQuizzes: RegionQuiz = {
  0: [ // Москва
    {
      id: 1,
      question: "Сколько башен у Московского Кремля?",
      options: ["20", "15", "10", "25"],
      correctOption: 0,
    },
    {
      id: 2,
      question: "Какая площадь является самой большой в Москве?",
      options: ["Красная", "Пушкинская", "Манежная", "Тверская"],
      correctOption: 0,
    },
  ],
  1: [ // Санкт-Петербург
    {
      id: 1,
      question: "Сколько мостов в Санкт-Петербурге?",
      options: ["Более 300", "Около 100", "Около 200", "Более 400"],
      correctOption: 0,
    },
    {
      id: 2,
      question: "Как называется главный музей Санкт-Петербурга?",
      options: ["Русский музей", "Эрмитаж", "Кунсткамера", "Петропавловская крепость"],
      correctOption: 1,
    },
  ],
  // TODO: Добавьте вопросы для других регионов
};

const regions: Region[] = [
  { id: 0, name: "Москва", requiredHappiness: 40 },
  { id: 1, name: "Санкт-Петербург", requiredHappiness: 60 },
  { id: 2, name: "Урал", requiredHappiness: 75 },
  { id: 3, name: "Сибирь", requiredHappiness: 90 },
  { id: 4, name: "Дальний Восток", requiredHappiness: 100 },
  { id: 5, name: "Татарстан", requiredHappiness: 0 }, // Бонусный регион
];

const defaultState: FoodGameState = {
  character: { type: "boy", hunger: 70, happiness: 30 },
  currentRegion: 0,
  regions: regions,
  inventory: [],
  maxInventorySize: 5,
  currentQuestion: 0,
  quizStarted: false,
  score: 0,
  highScore: 0,
  dish: "",
};

const foodItems: InventoryItem[] = [
  { id: "apple", name: "Яблоко", happinessValue: 5 },
  { id: "bread", name: "Хлеб", happinessValue: 8 },
  { id: "soup", name: "Суп", happinessValue: 15 },
  { id: "cake", name: "Торт", happinessValue: 20 },
];

export class FoodGameLogic {
  gameState = { ...defaultState };
  private listeners: ((state: FoodGameState) => void)[] = [];
  private hungerTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.startHungerTimer();
    const storedHighScore = Number(localStorage.getItem("foodHighScore"));
    if (!isNaN(storedHighScore)) {
      this.gameState.highScore = storedHighScore;
    }
  }

  private startHungerTimer() {
    this.hungerTimer = setInterval(() => {
      this.updateHunger(this.gameState.character.hunger - 2);

      // Если голод ниже 30, уменьшаем счастье
      if (this.gameState.character.hunger < 30) {
        this.updateHappiness(this.gameState.character.happiness - 1);
      }
    }, 60000); // Каждую минуту
  }

  // Изменить персонажа
  selectCharacter(type: "boy" | "girl") {
    this.gameState.character.type = type;
    this.notifyListeners();
  }

  // Изменить уровень голода
  updateHunger(value: number) {
    this.gameState.character.hunger = Math.max(0, Math.min(100, value));
    this.notifyListeners();
  }

  // Изменить уровень счастья
  updateHappiness(value: number) {
    this.gameState.character.happiness = Math.max(0, Math.min(100, value));
    this.notifyListeners();
  }

  // Добавить предмет в инвентарь
  addToInventory(item: InventoryItem) {
    if (this.gameState.inventory.length < this.gameState.maxInventorySize) {
      this.gameState.inventory = [...this.gameState.inventory, item];
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Удалить предмет из инвентаря
  removeFromInventory(itemId: string) {
    this.gameState.inventory = this.gameState.inventory.filter((item) => item.id !== itemId);
    this.notifyListeners();
  }

  // Использовать предмет (еда)
  useItem(itemId: string) {
    const item = this.gameState.inventory.find((i) => i.id === itemId);
    if (item) {
      this.updateHappiness(this.gameState.character.happiness + item.happinessValue);
      this.updateHunger(this.gameState.character.hunger + 10);
      this.removeFromInventory(itemId);
    }
  }

  // Перейти в следующий регион
  nextRegion() {
    const current = this.gameState.regions[this.gameState.currentRegion];
    if (this.gameState.character.happiness >= current.requiredHappiness) {
      this.gameState.currentRegion = Math.min(
        this.gameState.currentRegion + 1,
        this.gameState.regions.length - 1,
      );
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Сбросить игру
  restart() {
    if (this.hungerTimer) {
      clearInterval(this.hungerTimer);
    }
    this.gameState = { ...defaultState };
    this.startHungerTimer();
    this.notifyListeners();
    this.gameState.score = 0;
  }

  subscribe(callback: (state: FoodGameState) => void) {
    this.listeners.push(callback);
  }

  unsubscribe(callback: (state: FoodGameState) => void) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback({ ...this.gameState }));
  }

  generateFoodItem(): InventoryItem {
    const randomIndex = Math.floor(Math.random() * foodItems.length);
    return { ...foodItems[randomIndex] };
  }

  startQuiz() {
    this.gameState.quizStarted = true;
    this.gameState.currentQuestion = 0;
    this.notifyListeners();
  }

  answerQuestion(selectedOption: number) {
    const currentRegion = this.gameState.currentRegion;
    const questions = regionQuizzes[currentRegion];
    const currentQuestion = questions[this.gameState.currentQuestion];

    if (selectedOption === currentQuestion.correctOption) {
      // Правильный ответ
      this.updateScore(this.gameState.score + 10); // +10 очков за правильный ответ
      this.updateHappiness(this.gameState.character.happiness + 15);

      // Переходим к следующему вопросу
      if (this.gameState.currentQuestion < questions.length - 1) {
        this.gameState.currentQuestion += 1;
      } else {
        // Викторина завершена
        this.gameState.quizStarted = false;
      }
    } else {
      // Неправильный ответ
      this.updateHappiness(this.gameState.character.happiness - 5);
    }

    this.notifyListeners();
  }

  endQuiz() {
    this.gameState.quizStarted = false;
    this.notifyListeners();
  }

  private updateScore(value: number) {
    this.gameState.score = value;
    if (value > this.gameState.highScore) {
      this.gameState.highScore = value;
      localStorage.setItem("foodHighScore", String(value));
    }
    this.notifyListeners();
  }
}
