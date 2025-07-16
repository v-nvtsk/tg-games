import { Scene } from "phaser";
import { getAssetsPath } from "../../../utils/get-assets-path";
import { setBackground } from "../../../utils/set-background";

export class Preloader extends Scene{
  constructor (){
    super("Preloader");
  }

  init (){
    //  We loaded this image in our Boot Scene, so we can display it here
    setBackground(this, "menu/background", true);

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {

      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + (460 * progress);

    });
  }

  preload (){
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath(getAssetsPath());

    this.load.image("menu/background", getAssetsPath("bg.png"));
  }

  create (){
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("Intro");
  }

  public resizeGame(gameSize: { width: number; height: number }) {
    const { width, height } = gameSize;

    // Центрируем фон
    this.add.image(width / 2, height / 2, "menu/background");

    // Если есть текст или формы — пересчитывайте позиции
  }
}
