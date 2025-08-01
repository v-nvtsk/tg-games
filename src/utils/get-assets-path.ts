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
    carrot: getAssetsPathByType({ type: "images",
      scene: "cooking",
      filename: "ingredients/carrot.png" }), // "assets/images/scenes/cooking/ingredients/carrot.png",
    tomato: getAssetsPathByType({ type: "images",
      scene: "cooking",
      filename: "ingredients/tomato.png" }),
    cucumber: getAssetsPathByType({ type: "images",
      scene: "cooking",
      filename: "ingredients/cucumber.png" }),
    pepper: getAssetsPathByType({ type: "images",
      scene: "cooking",
      filename: "ingredients/pepper.png" }),
    mushroom: getAssetsPathByType({ type: "images",
      scene: "cooking",
      filename: "ingredients/mushroom.png" }),
    potato: getAssetsPathByType({ type: "images",
      scene: "cooking",
      filename: "ingredients/potato.png" }),
    onion: getAssetsPathByType({ type: "images",
      scene: "cooking",
      filename: "ingredients/onion.png" }),
    garlic: getAssetsPathByType({ type: "images",
      scene: "cooking",
      filename: "ingredients/garlic.png" }),
  };

  return imageMap[type] || imageMap.carrot; // fallback на морковь
};
