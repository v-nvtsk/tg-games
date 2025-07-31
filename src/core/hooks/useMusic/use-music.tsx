import { useEffect } from "react";
import { getAssetsPathByType } from "../../../utils";

interface HookProps{
  filename: string,
  scene: string
}

export const useMusic = ({ filename, scene }: HookProps) => {

  useEffect(() => {
    const audio = new Audio(getAssetsPathByType({
      type: "sounds",
      scene,
      filename }));
    audio.volume = 0.1;
    audio.loop = true;
    void audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [filename, scene]);

};

