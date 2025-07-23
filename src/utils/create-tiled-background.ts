import type { Scene } from "phaser";

export function createTiledBackground(scene: Scene, key: string): Phaser.GameObjects.TileSprite {
  const width = scene.scale.width;
  const height = scene.scale.height;

  const originalTexture = scene.textures.get(key);
  const sourceImage = originalTexture.getSourceImage() as HTMLImageElement;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = sourceImage.width * (height / sourceImage.height);
  tempCanvas.height = height;

  const ctx = tempCanvas.getContext("2d");
  ctx?.drawImage(sourceImage, 0, 0, tempCanvas.width, tempCanvas.height);

  if (scene.textures.exists("tiled-bg")) {
    scene.textures.remove("tiled-bg");
  }
  scene.textures.addCanvas("tiled-bg", tempCanvas);

  return scene.add.tileSprite(0, 0, width, height, "tiled-bg")
    .setOrigin(0, 0)
    .setScrollFactor(0);
}
