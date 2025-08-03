import { RecipeSelector } from "./recipe-selector";
import { getIngredientImage } from "$/utils";

// Рецепты Москвы и Московской области
const sampleRecipes = [
  {
    id: "1",
    title: "Салат «Столичный»",
    ingredients: [
      { imageSrc: getIngredientImage("куриное филе"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("картофель"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("яйцо"), count: 2, color: "#FFC107" },
      { imageSrc: getIngredientImage("огурцы"), count: 2, color: "#4CAF50" },
      { imageSrc: getIngredientImage("яблоко"), count: 1, color: "#F44336" },
      { imageSrc: getIngredientImage("зелёный лук"), count: 1, color: "#8BC34A" },
      { imageSrc: getIngredientImage("майонез"), count: 2, color: "#FFEB3B" }
    ],
    isAvailable: true
  },
  {
    id: "2", 
    title: "Солянка московская",
    ingredients: [
      { imageSrc: getIngredientImage("говядина"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("копчёности"), count: 2, color: "#FF9800" },
      { imageSrc: getIngredientImage("квашеная капуста"), count: 4, color: "#4CAF50" },
      { imageSrc: getIngredientImage("грибы"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("солёные огурцы"), count: 2, color: "#4CAF50" },
      { imageSrc: getIngredientImage("маслины"), count: 1, color: "#8BC34A" },
      { imageSrc: getIngredientImage("лимон"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("томат"), count: 2, color: "#F44336" },
      { imageSrc: getIngredientImage("лук"), count: 2, color: "#FFEB3B" }
    ],
    isAvailable: true
  },
  {
    id: "3",
    title: "Московский борщ",
    ingredients: [
      { imageSrc: getIngredientImage("говядина"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("свёкла"), count: 2, color: "#9C27B0" },
      { imageSrc: getIngredientImage("кислая капуста"), count: 2, color: "#4CAF50" },
      { imageSrc: getIngredientImage("картофель"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("морковь"), count: 1, color: "#FF9800" },
      { imageSrc: getIngredientImage("лук"), count: 1, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("томат"), count: 1, color: "#F44336" },
      { imageSrc: getIngredientImage("сметана"), count: 1, color: "#FFFFFF" }
    ],
    isAvailable: true
  },
  {
    id: "4",
    title: "Жаркое по-домашнему",
    ingredients: [
      { imageSrc: getIngredientImage("говядина"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("картофель"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("морковь"), count: 1, color: "#FF9800" },
      { imageSrc: getIngredientImage("лук"), count: 1, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("специи/лавр"), count: 1, color: "#4CAF50" },
      { imageSrc: getIngredientImage("растительное масло"), count: 1, color: "#FFC107" }
    ],
    isAvailable: true
  },
  {
    id: "5",
    title: "Окрошка на кефире",
    ingredients: [
      { imageSrc: getIngredientImage("кефир"), count: 6, color: "#FFFFFF" },
      { imageSrc: getIngredientImage("картофель"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("варёная колбаса"), count: 2, color: "#FF9800" },
      { imageSrc: getIngredientImage("яйцо"), count: 2, color: "#FFC107" },
      { imageSrc: getIngredientImage("огурцы"), count: 2, color: "#4CAF50" },
      { imageSrc: getIngredientImage("зелень"), count: 1, color: "#4CAF50" },
      { imageSrc: getIngredientImage("горчица"), count: 1, color: "#FFC107" }
    ],
    isAvailable: true
  },
  {
    id: "6",
    title: "Плюшки московские",
    ingredients: [
      { imageSrc: getIngredientImage("дрожжевое тесто"), count: 3, color: "#8D6E63" },
      { imageSrc: getIngredientImage("сливочное масло"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("сахар"), count: 1, color: "#FF9800" }
    ],
    isAvailable: false
  },
  {
    id: "7",
    title: "Тельное",
    ingredients: [
      { imageSrc: getIngredientImage("филе щуки/судака"), count: 4, color: "#2196F3" },
      { imageSrc: getIngredientImage("белый хлеб"), count: 1, color: "#8D6E63" },
      { imageSrc: getIngredientImage("молоко"), count: 1, color: "#FFFFFF" },
      { imageSrc: getIngredientImage("яйцо"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("сливочное масло"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("специи"), count: 1, color: "#4CAF50" }
    ],
    isAvailable: true
  },
  {
    id: "8",
    title: "Пирожки с капустой",
    ingredients: [
      { imageSrc: getIngredientImage("дрожжевое тесто"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("тушёная капуста"), count: 2, color: "#4CAF50" },
      { imageSrc: getIngredientImage("лук"), count: 1, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("растительное масло"), count: 1, color: "#FFC107" }
    ],
    isAvailable: true
  },
  {
    id: "9",
    title: "Бефстроганов",
    ingredients: [
      { imageSrc: getIngredientImage("говяжья вырезка"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("лук"), count: 2, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("сливки/сметана"), count: 2, color: "#FFFFFF" },
      { imageSrc: getIngredientImage("томатная паста"), count: 1, color: "#F44336" },
      { imageSrc: getIngredientImage("мука"), count: 1, color: "#8D6E63" },
      { imageSrc: getIngredientImage("сливочное масло"), count: 1, color: "#FFC107" }
    ],
    isAvailable: true
  },
  {
    id: "10",
    title: "Буженина",
    ingredients: [
      { imageSrc: getIngredientImage("свиная шея"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("чеснок"), count: 1, color: "#9C27B0" },
      { imageSrc: getIngredientImage("горчица"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("специи"), count: 1, color: "#4CAF50" },
      { imageSrc: getIngredientImage("лавровый лист"), count: 1, color: "#4CAF50" }
    ],
    isAvailable: false
  },
  {
    id: "11",
    title: "Эчпочмак",
    ingredients: [
      { imageSrc: getIngredientImage("пресное тесто"), count: 1, color: "#8D6E63" },
      { imageSrc: getIngredientImage("говядина"), count: 1, color: "#8D6E63" },
      { imageSrc: getIngredientImage("картофель"), count: 2, color: "#8D6E63" }
    ],
    isAvailable: true
  },
  {
    id: "12",
    title: "Чак-чак",
    ingredients: [
      { imageSrc: getIngredientImage("мука"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("яйца"), count: 2, color: "#FFC107" },
      { imageSrc: getIngredientImage("мёд"), count: 1, color: "#FF9800" },
      { imageSrc: getIngredientImage("сахар"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("растительное масло"), count: 1, color: "#FFC107" }
    ],
    isAvailable: true
  },
  {
    id: "13",
    title: "Кыстыбый",
    ingredients: [
      { imageSrc: getIngredientImage("пресное тесто"), count: 1, color: "#8D6E63" },
      { imageSrc: getIngredientImage("картофельное пюре"), count: 1, color: "#8D6E63" }
    ],
    isAvailable: true
  },
  {
    id: "14",
    title: "Перемяч",
    ingredients: [
      { imageSrc: getIngredientImage("дрожжевое тесто"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("говяжий фарш"), count: 1, color: "#8D6E63" },
      { imageSrc: getIngredientImage("лук"), count: 1, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("растительное масло"), count: 1, color: "#FFC107" }
    ],
    isAvailable: true
  },
  {
    id: "15",
    title: "Бэлиш",
    ingredients: [
      { imageSrc: getIngredientImage("пресное тесто"), count: 1, color: "#8D6E63" },
      { imageSrc: getIngredientImage("баранина"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("картофель"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("лук"), count: 1, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("морковь"), count: 1, color: "#FF9800" },
      { imageSrc: getIngredientImage("бульон"), count: 1, color: "#8D6E63" }
    ],
    isAvailable: true
  },
  {
    id: "16",
    title: "Азу по-татарски",
    ingredients: [
      { imageSrc: getIngredientImage("говядина"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("картофель"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("лук"), count: 2, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("солёные огурцы"), count: 2, color: "#4CAF50" },
      { imageSrc: getIngredientImage("томатная паста"), count: 2, color: "#F44336" },
      { imageSrc: getIngredientImage("чеснок"), count: 1, color: "#9C27B0" },
      { imageSrc: getIngredientImage("специи"), count: 1, color: "#4CAF50" }
    ],
    isAvailable: true
  },
  {
    id: "17",
    title: "Шурпа",
    ingredients: [
      { imageSrc: getIngredientImage("баранина"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("картофель"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("морковь"), count: 1, color: "#FF9800" },
      { imageSrc: getIngredientImage("лук"), count: 1, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("помидоры"), count: 1, color: "#F44336" },
      { imageSrc: getIngredientImage("болгарский перец"), count: 1, color: "#4CAF50" },
      { imageSrc: getIngredientImage("чеснок"), count: 1, color: "#9C27B0" },
      { imageSrc: getIngredientImage("зелень"), count: 1, color: "#4CAF50" },
      { imageSrc: getIngredientImage("специи"), count: 1, color: "#4CAF50" }
    ],
    isAvailable: true
  },
  {
    id: "18",
    title: "Губадия",
    ingredients: [
      { imageSrc: getIngredientImage("сдобное тесто"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("рис"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("творог корт"), count: 2, color: "#FFC107" },
      { imageSrc: getIngredientImage("изюм"), count: 2, color: "#9C27B0" },
      { imageSrc: getIngredientImage("баранина"), count: 2, color: "#8D6E63" },
      { imageSrc: getIngredientImage("яйца"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("топлёное масло"), count: 2, color: "#FFC107" },
      { imageSrc: getIngredientImage("сахар"), count: 2, color: "#FFC107" }
    ],
    isAvailable: false
  },
  {
    id: "19",
    title: "Казылык-кебаб",
    ingredients: [
      { imageSrc: getIngredientImage("говяжья вырезка"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("лук"), count: 2, color: "#FFEB3B" },
      { imageSrc: getIngredientImage("уксус/лимон"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("специи"), count: 1, color: "#4CAF50" },
      { imageSrc: getIngredientImage("растительное масло"), count: 1, color: "#FFC107" }
    ],
    isAvailable: true
  },
  {
    id: "20",
    title: "Кош теле (хворост)",
    ingredients: [
      { imageSrc: getIngredientImage("мука"), count: 4, color: "#8D6E63" },
      { imageSrc: getIngredientImage("яйца"), count: 2, color: "#FFC107" },
      { imageSrc: getIngredientImage("сахар"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("сливочное масло"), count: 1, color: "#FFC107" },
      { imageSrc: getIngredientImage("сметана"), count: 1, color: "#FFFFFF" },
      { imageSrc: getIngredientImage("растительное масло"), count: 1, color: "#FFC107" }
    ],
    isAvailable: true
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