export const handleResize = (game: Phaser.Game | null) => {
  if (!game) return;

  game.scale.resize(window.innerWidth, window.innerHeight);

  game.scene.scenes.forEach((scene: Phaser.Scene & { resizeGame?: (args: { width: number;
    height: number }) => void }) => {
    scene.scale.canvas.width = window.innerWidth;
    scene.scale.canvas.height = window.innerHeight;

    if ("resizeGame" in scene && typeof scene["resizeGame"] === "function") {
      scene["resizeGame"]({ width: window.innerWidth,
        height: window.innerHeight });
    }

    game.scale.resize(window.innerWidth, window.innerHeight);
    scene.scale.setGameSize(window.innerWidth, window.innerHeight);
  });

  const container = document.getElementById("game-container");
  if (container) {
    container.style.width = `${window.innerWidth}px`;
    container.style.height = `${window.innerHeight}px`;
  }
};
