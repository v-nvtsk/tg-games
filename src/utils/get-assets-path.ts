export const getAssetsPath = (filename?: string) => {
  const basePath = `${import.meta.env.BASE_URL}assets/`;

  return filename ? `${basePath}${filename}` : basePath;
};

export function getAssetsPathByType({
  type,
  filename,
  scene,
}: {
  type: "images" | "sounds" | "json" | "tiled" | "fonts";
  filename: string;
  scene?: string;
}) {
  const scenePath = scene ? `scenes/${scene}/` : "";

  return `${getAssetsPath()}${type}/${scenePath}/${filename}`;
}

// Функция для получения пути к изображению овоща
export const getVegetableImagePath = (type: string): string => {
  const imageMap: Record<string, string> = {
    carrot: "/src/assets/images/scenes/cooking/ingredients/carrot.png",
    tomato: "/src/assets/images/scenes/cooking/ingredients/tomato.png",
    cucumber: "/src/assets/images/scenes/cooking/ingredients/cucumber.png",
    pepper: "/src/assets/images/scenes/cooking/ingredients/pepper.png",
    mushroom: "/src/assets/images/scenes/cooking/ingredients/mushroom.png",
    potato: "/src/assets/images/scenes/cooking/ingredients/potato.png",
    onion: "/src/assets/images/scenes/cooking/ingredients/onion.png",
    garlic: "/src/assets/images/scenes/cooking/ingredients/garlic.png",
  };

  return imageMap[type] || imageMap.carrot; // fallback на морковь
};
