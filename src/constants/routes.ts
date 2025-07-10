export const ROUTES = {
  HOME: "/",
  GAME_2048: "/game/2048",
  GAME_FOOD: "/game/food",
} as const;

export type RouteKeys = keyof typeof ROUTES;

export type RouteValues = typeof ROUTES[RouteKeys];

export type Routes = Record<RouteKeys, RouteValues>;
