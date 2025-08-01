import Phaser from "phaser";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#f9f6f2",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0,
        y: 0 },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
};
