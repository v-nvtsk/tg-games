import { Scene } from "phaser";
import { getAssetsPath } from "../../../utils/get-assets-path";

export class Boot extends Scene
{
  constructor ()
  {
    super("Boot");
  }

  preload ()
  {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image("menu/background", getAssetsPath("bg.png"));
    this.load.image("global/map", getAssetsPath("map.png"));
  }

  create ()
  {
    this.scene.start("Preloader");
  }
}
