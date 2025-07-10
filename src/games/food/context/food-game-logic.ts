interface Dish {
  name: string;
  food: string[];
  score: number;
}

export interface FoodGameState {
  highScore: number;
  score: number;
  level: number;
  over: boolean;
  won: boolean;
  selectedFood: string[];
  foodTransporter: string[];
  dish: Dish;
  dishIndex: number;
}

const json = {
  food: ["Капуста", "Картофель", "Помидор", "Морковь", "Огурцы", "Лук", "Свекла"],
  dishes: [
    {
      name: "Борщ",
      food: ["Капуста", "Картофель", "Помидор", "Морковь", "Огурцы"],
      score: 10,
    },
    {
      name: "Винегрет",
      food: ["Свекла", "Картофель", "Морковь", "Огурцы", "Лук"],
      score: 15,
    },
  ],
};

const defaultState: FoodGameState = {
  highScore: 0,
  score: 0,
  level: 1,
  over: false,
  won: false,
  selectedFood: [],
  foodTransporter: [],
  dish: json.dishes[0],
  dishIndex: 0,
};

export class FoodGameLogic {
  gameState = { ...defaultState };

  private listeners: ((state: FoodGameState) => void)[] = [];

  constructor() {
    this.rollTransporter();
  }

  rollTransporter() {
    const availableFoods = json.food;
    const newTransporter = [];

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * availableFoods.length);
      newTransporter.push(availableFoods[randomIndex]);
    }

    this.gameState.foodTransporter = newTransporter;
    this.notifyListeners();
  }

  addToPan(item: string) {
    if (!this.gameState.selectedFood.includes(item)) {
      this.gameState = {
        ...this.gameState,
        selectedFood: [...this.gameState.selectedFood, item],
      };
      this.checkWin();
      this.notifyListeners();
    }
  }
  removeFromPan(item: string) {
    this.gameState = {
      ...this.gameState,
      selectedFood: this.gameState.selectedFood.filter((f) => f !== item),
    };
    this.checkWin();
    this.notifyListeners();
  }

  checkWin() {
    const needed = [...this.gameState.dish.food].sort();
    const collected = [...this.gameState.selectedFood].sort();

    const isWon = needed.every((item, index) => item === collected[index]);

    if (isWon) {
      this.gameState.score += this.gameState.dish.score;
      this.gameState.level += 1;
      this.gameState.dishIndex = (this.gameState.dishIndex + 1) % json.dishes.length;
      this.gameState.dish = json.dishes[this.gameState.dishIndex];
      this.gameState.selectedFood = [];
      this.rollTransporter();
    }

    this.notifyListeners();
  }

  restart() {
    this.gameState = { ...defaultState };
    this.rollTransporter();
    this.notifyListeners();
  }

  subscribe(callback: (state: FoodGameState) => void) {
    this.listeners.push(callback);
  }

  unsubscribe(callback: (state: FoodGameState) => void) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.gameState));
  }
}
