import clsx from "clsx";
import styles from "./recipe-card.module.css";

interface Ingredient {
  imageSrc: string;
  count: number;
  color: string;
}

interface RecipeCardProps {
  title: string;
  ingredients: Ingredient[];
  isAvailable: boolean;
  onCook: () => void;
  className?: string;
}

export const RecipeCard = ({ 
  title, 
  ingredients, 
  isAvailable, 
  onCook, 
  className 
}: RecipeCardProps) => {
  const handleCook = (event: React.MouseEvent) => {
    event.preventDefault();
    if (isAvailable) {
      onCook();
    }
  };

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{title}</h3>
        
        <div className={styles.dishIcon}>
          <div className={styles.dishVisual}>
            <div className={styles.dishBase}></div>
            <div className={styles.dishGarnish}></div>
            <div className={styles.dishAccent}></div>
          </div>
        </div>
        
        <p className={styles.ingredientsLabel}>Ингредиенты:</p>
        
        <div className={styles.ingredientsList}>
          {ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientItem}>
              <div 
                className={styles.ingredientIcon}
                style={{ backgroundColor: ingredient.color }}
              >
                <img 
                  src={ingredient.imageSrc} 
                  alt="ingredient" 
                  className={styles.ingredientImage}
                />
              </div>
              <span className={styles.ingredientCount}>x{ingredient.count}</span>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleCook}
          className={clsx(
            styles.cookButton,
            isAvailable ? styles.available : styles.unavailable
          )}
          disabled={!isAvailable}
        >
          ГОТОВИТЬ
        </button>
      </div>
    </div>
  );
}; 