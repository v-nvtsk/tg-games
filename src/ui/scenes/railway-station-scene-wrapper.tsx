import React from "react";
import { SlidesWrapper } from "./slides-wrapper";
import { railwayStationSlidesConfig } from "$features/slides/configs";
import { useSceneStore } from "@core/state";

export const RailwayStationSceneWrapper = () => {
  const setSlidesConfig = useSceneStore((s) => s.setSlidesConfig);

  // ✅ Устанавливаем конфигурацию для Railway Station сцены
  React.useEffect(() => {
    setSlidesConfig(railwayStationSlidesConfig);

    // ✅ Очистка при размонтировании
    return () => setSlidesConfig(undefined);
  }, [setSlidesConfig]);

  return <SlidesWrapper />;
};
