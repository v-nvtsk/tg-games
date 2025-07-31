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
    carrot: "assets/images/scenes/cooking/ingredients/carrot.png",
    tomato: "assets/images/scenes/cooking/ingredients/tomato.png",
    cucumber: "assets/images/scenes/cooking/ingredients/cucumber.png",
    pepper: "assets/images/scenes/cooking/ingredients/pepper.png",
    mushroom: "assets/images/scenes/cooking/ingredients/mushroom.png",
    potato: "assets/images/scenes/cooking/ingredients/potato.png",
    onion: "assets/images/scenes/cooking/ingredients/onion.png",
    garlic: "assets/images/scenes/cooking/ingredients/garlic.png",
  };

  return imageMap[type] || imageMap.carrot; // fallback на морковь
};
