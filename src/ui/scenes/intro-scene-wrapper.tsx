import React from "react";
import { SlidesWrapper } from "./slides-wrapper";
import { introSlidesConfig } from "$features/slides/configs";
import { useSceneStore } from "@core/state";

export const IntroSceneWrapper = () => {
  const setSlidesConfig = useSceneStore((s) => s.setSlidesConfig);

  // ✅ Устанавливаем конфигурацию для Intro сцены
  React.useEffect(() => {
    setSlidesConfig(introSlidesConfig);
    
    // ✅ Очистка при размонтировании
    return () => setSlidesConfig(undefined);
  }, [setSlidesConfig]);

  return <SlidesWrapper />;
}; 