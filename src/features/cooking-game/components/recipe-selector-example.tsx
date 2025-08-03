import { RecipeSelector } from "./recipe-selector";

// Функция для получения пути к изображению ингредиента
const getIngredientImage = (ingredientName: string): string => {
  const ingredientMap: { [key: string]: string } = {
    // Мясные продукты
    'говядина': '/src/assets/images/scenes/cooking/ingredients/beef.png',
    'говяжья вырезка': '/src/assets/images/scenes/cooking/ingredients/beef.png',
    'говяжий фарш': '/src/assets/images/scenes/cooking/ingredients/ground_meat.png',
    'куриное филе': '/src/assets/images/scenes/cooking/ingredients/chicken.png',
    'свиная шея': '/src/assets/images/scenes/cooking/ingredients/meat.png',
    'баранина': '/src/assets/images/scenes/cooking/ingredients/mutton.png',
    'филе щуки/судака': '/src/assets/images/scenes/cooking/ingredients/fish.png',
    'варёная колбаса': '/src/assets/images/scenes/cooking/ingredients/sausage.png',
    'копчёности': '/src/assets/images/scenes/cooking/ingredients/salami.png',
    
    // Овощи
    'картофель': '/src/assets/images/scenes/cooking/ingredients/potato.png',
    'картофельное пюре': '/src/assets/images/scenes/cooking/ingredients/potato_puree.png',
    'морковь': '/src/assets/images/scenes/cooking/ingredients/carrot.png',
    'лук': '/src/assets/images/scenes/cooking/ingredients/onion.png',
    'зелёный лук': '/src/assets/images/scenes/cooking/ingredients/onions.png',
    'огурцы': '/src/assets/images/scenes/cooking/ingredients/cucumber.png',
    'солёные огурцы': '/src/assets/images/scenes/cooking/ingredients/pickled_cucumber.png',
    'томат': '/src/assets/images/scenes/cooking/ingredients/tomato.png',
    'помидоры': '/src/assets/images/scenes/cooking/ingredients/tomato.png',
    'свёкла': '/src/assets/images/scenes/cooking/ingredients/radish_.png',
    'болгарский перец': '/src/assets/images/scenes/cooking/ingredients/pepper.png',
    'яблоко': '/src/assets/images/scenes/cooking/ingredients/apple.png',
    
    // Крупы и мука
    'мука': '/src/assets/images/scenes/cooking/ingredients/sugar.png', // используем сахар как муку
    'рис': '/src/assets/images/scenes/cooking/ingredients/rice.png',
    'белый хлеб': '/src/assets/images/scenes/cooking/ingredients/white_bread.png',
    'дрожжевое тесто': '/src/assets/images/scenes/cooking/ingredients/yeast_dough.png',
    'пресное тесто': '/src/assets/images/scenes/cooking/ingredients/white_bread.png',
    'сдобное тесто': '/src/assets/images/scenes/cooking/ingredients/sweet_dough.png',
    
    // Молочные продукты
    'молоко': '/src/assets/images/scenes/cooking/ingredients/milk.png',
    'кефир': '/src/assets/images/scenes/cooking/ingredients/kefir.png',
    'сметана': '/src/assets/images/scenes/cooking/ingredients/sour_cream.png',
    'сливки/сметана': '/src/assets/images/scenes/cooking/ingredients/cream.png',
    'творог корт': '/src/assets/images/scenes/cooking/ingredients/cottage_cheese.png',
    'сливочное масло': '/src/assets/images/scenes/cooking/ingredients/butter.png',
    'топлёное масло': '/src/assets/images/scenes/cooking/ingredients/melted_butter.png',
    'растительное масло': '/src/assets/images/scenes/cooking/ingredients/oil.png',
    
    // Другие ингредиенты
    'яйцо': '/src/assets/images/scenes/cooking/ingredients/egg.png',
    'яйца': '/src/assets/images/scenes/cooking/ingredients/egg.png',
    'майонез': '/src/assets/images/scenes/cooking/ingredients/mayonnaise.png',
    'горчица': '/src/assets/images/scenes/cooking/ingredients/mustard.png',
    'уксус/лимон': '/src/assets/images/scenes/cooking/ingredients/vinegar.png',
    'лимон': '/src/assets/images/scenes/cooking/ingredients/lemon.png',
    'чеснок': '/src/assets/images/scenes/cooking/ingredients/garlic.png',
    'специи': '/src/assets/images/scenes/cooking/ingredients/spices.png',
    'лавр': '/src/assets/images/scenes/cooking/ingredients/bay_leaf.png',
    'лавровый лист': '/src/assets/images/scenes/cooking/ingredients/bay_leaf.png',
    'специи/лавр': '/src/assets/images/scenes/cooking/ingredients/bay_leaf.png',
    'зелень': '/src/assets/images/scenes/cooking/ingredients/green.png',
    'маслины': '/src/assets/images/scenes/cooking/ingredients/olives.png',
    'изюм': '/src/assets/images/scenes/cooking/ingredients/raisin.png',
    'мёд': '/src/assets/images/scenes/cooking/ingredients/sugar.png', // используем сахар как мёд
    'сахар': '/src/assets/images/scenes/cooking/ingredients/sugar.png',
    'томатная паста': '/src/assets/images/scenes/cooking/ingredients/tomato.png',
    'квашеная капуста': '/src/assets/images/scenes/cooking/ingredients/sauerkraut.png',
    'кислая капуста': '/src/assets/images/scenes/cooking/ingredients/sauerkraut.png',
    'тушёная капуста': '/src/assets/images/scenes/cooking/ingredients/sauerkraut.png',
    'грибы': '/src/assets/images/scenes/cooking/ingredients/mushroom.png',
    'бульон': '/src/assets/images/scenes/cooking/ingredients/soup.png',
    'мускатный орех': '/src/assets/images/scenes/cooking/ingredients/nutmeg.png',
    'мята': '/src/assets/images/scenes/cooking/ingredients/mint.png',
    'соль': '/src/assets/images/scenes/cooking/ingredients/salt.png'
  };
  
  return ingredientMap[ingredientName] || '/src/assets/images/scenes/cooking/ingredients/sugar.png';
};

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