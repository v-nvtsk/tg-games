import { RecipeSelector } from "./recipe-selector";

// Тестовые данные рецептов
const sampleRecipes = [
  {
    id: "1",
    title: "Борщ",
    ingredients: [
      { emoji: "🥒", count: 1, color: "#4CAF50" },
      { emoji: "🍅", count: 5, color: "#F44336" },
      { emoji: "🧄", count: 4, color: "#9C27B0" }
    ],
    isAvailable: true
  },
  {
    id: "2", 
    title: "Суп",
    ingredients: [
      { emoji: "🥕", count: 3, color: "#FF9800" },
      { emoji: "🥔", count: 2, color: "#8D6E63" },
      { emoji: "🧅", count: 1, color: "#FFEB3B" }
    ],
    isAvailable: true
  },
  {
    id: "3",
    title: "Салат",
    ingredients: [
      { emoji: "🥬", count: 2, color: "#4CAF50" },
      { emoji: "🥑", count: 1, color: "#8BC34A" },
      { emoji: "🍋", count: 1, color: "#FFC107" }
    ],
    isAvailable: false
  },
  {
    id: "4",
    title: "Паста",
    ingredients: [
      { emoji: "🍝", count: 1, color: "#FFEB3B" },
      { emoji: "🧀", count: 2, color: "#FFC107" },
      { emoji: "🍅", count: 3, color: "#F44336" }
    ],
    isAvailable: true
  },
  {
    id: "5",
    title: "Пицца",
    ingredients: [
      { emoji: "🍕", count: 1, color: "#FF9800" },
      { emoji: "🧀", count: 4, color: "#FFC107" },
      { emoji: "🍄", count: 2, color: "#8D6E63" }
    ],
    isAvailable: true
  },
  {
    id: "6",
    title: "Бургер",
    ingredients: [
      { emoji: "🍔", count: 1, color: "#8D6E63" },
      { emoji: "🥬", count: 1, color: "#4CAF50" },
      { emoji: "🧀", count: 1, color: "#FFC107" }
    ],
    isAvailable: false
  }
];

export const RecipeSelectorExample = () => {
  const handleRecipeSelect = (recipeId: string) => {
    console.log("Выбран рецепт:", recipeId);
    // Здесь можно добавить логику перехода к приготовлению блюда
  };

  return (
    <RecipeSelector
      recipes={sampleRecipes}
      onRecipeSelect={handleRecipeSelect}
    />
  );
}; 