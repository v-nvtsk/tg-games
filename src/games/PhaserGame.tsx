import { useEffect, useLayoutEffect, useRef } from "react";
import StartGame from "./game/main";
import { EventBus } from "./game/EventBus";
import { handleResize } from "../utils/handle-resize";

export interface IRefPhaserGame{
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}
interface IProps{
  currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const PhaserGame = function PhaserGame({ ref, currentActiveScene }: IProps & { ref?: React.RefObject<IRefPhaserGame | null> }) {
  const game = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const resizeHandler = () => {
      if (game.current && !document.activeElement?.tagName.includes("INPUT")) {
        handleResize(game.current);
      }
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // useLayoutEffect(() => {
  //   const resizeHandler = () => {
  //     game.current?.scale.resize(window.innerWidth, window.innerHeight);
  //   };
  //   window.addEventListener("resize", resizeHandler);
  // }, []);

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = StartGame("game-container");
      if (ref !== null && ref !== undefined && typeof ref === "function") {
        (ref as (args: IRefPhaserGame) => void)({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }
    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null)
        {
          game.current = null;
        }
      }
    };
  }, [ref]);

  useEffect(() => {
    EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
      if (currentActiveScene && typeof currentActiveScene === "function") {
        currentActiveScene(scene_instance);
      }
      if (typeof ref === "function") {
        (ref as (args: IRefPhaserGame) => void)({ game: game.current, scene: scene_instance });
      } else if (ref) {
        ref.current = { game: game.current, scene: scene_instance };
      }

    });
    return () => {
      EventBus.removeListener("current-scene-ready");
    };
  }, [currentActiveScene, ref]);

  // useEffect(() => {
  //   const resizeHandler = () => {
  //     if (game.current) {
  //       const width = window.innerWidth;
  //       const height = window.innerHeight;
  //       game.current.scale.resize(width, height);
  //       game.current.canvas.width = width;
  //       game.current.canvas.height = height;
  //       game.current.scale.refresh();
  //       game.current.canvas.style.width = width + "px";
  //       game.current.canvas.style.height = height + "px";
  //     }
  //   };
  //   window.addEventListener("resize", resizeHandler);

  //   return () => {
  //     window.removeEventListener("resize", resizeHandler);
  //   };
  // });

  return (
    <div id="game-container"></div>
  );
};
