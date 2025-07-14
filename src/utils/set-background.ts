import { Scene } from "phaser";

/**
 * Устанавливает фоновое изображение на всю сцену.
 *
 * @param scene - Phaser.Scene, в которой нужно установить фон
 * @param key - ключ текстуры (например, 'background')
 * @param coverMode - если true, сохраняет пропорции изображения (cover), иначе растягивает под размер экрана
 */
export const setBackground = (scene: Scene, key: string, coverMode = true): Phaser.GameObjects.Image => {
  const bg = scene.add.image(0, 0, key).setOrigin(0, 0);

  const resize = () => {
    if (coverMode) {

      const scale = Math.max(
        scene.scale.width / bg.width,
        scene.scale.height / bg.height,
      );
      bg.setScale(scale);
      bg.setDepth(-1);
    } else {
      // Растягиваем под размер экрана (возможно искажение)
      bg.setDisplaySize(scene.scale.width, scene.scale.height);
    }
  };

  // Подписываемся на событие ресайза
  scene.scale.on("resize", resize);

  // Вызываем один раз при инициализации
  resize();

  return bg;
};
