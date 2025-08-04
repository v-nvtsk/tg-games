import { useState } from "react";
import clsx from "clsx";
import { RecipeCard } from "./recipe-card";
import { RecipeNavigation } from "./recipe-navigation";
import styles from "./recipe-selector.module.css";

interface Ingredient {
  imageSrc: string;
  count: number;
  color: string;
}

interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  isAvailable: boolean;
}

interface RecipeSelectorProps {
  recipes: Recipe[];
  onRecipeSelect: (recipeId: string) => void;
  className?: string;
}

const RECIPES_PER_PAGE = 4;

export const RecipeSelector = ({ 
  recipes, 
  onRecipeSelect, 
  className 
}: RecipeSelectorProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);
  const startIndex = currentPage * RECIPES_PER_PAGE;
  const endIndex = startIndex + RECIPES_PER_PAGE;
  const currentRecipes = recipes.slice(startIndex, endIndex);
  
  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };
  
  const handleRecipeCook = (recipeId: string) => {
    onRecipeSelect(recipeId);
  };
  
  return (
    <div className={clsx(styles.container, className)}>
      {/* Декоративные элементы фона */}
      <div className={styles.backgroundDecorations}>
        
      </div>
      
      {/* Основной контент */}
      <div className={styles.content}>
        {/* Сетка рецептов */}
        <div className={styles.recipesGrid}>
          {currentRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              title={recipe.title}
              ingredients={recipe.ingredients}
              isAvailable={recipe.isAvailable}
              onCook={() => handleRecipeCook(recipe.id)}
            />
          ))}
        </div>
        
        {/* Навигация */}
        {totalPages > 1 && (
          <RecipeNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={currentPage > 0}
            hasNext={currentPage < totalPages - 1}
          />
        )}
      </div>
    </div>
  );
}; 