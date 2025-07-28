// react-app-env.d.ts
import "react";

declare module "react" {
  type CSSProperties = Record<`--${string}`, string | number>;
}
