export const ROUTES = {
  HOME: "/",
  GAMES: "/games",
  GAME_2048: "/games/2048",
  GAME_FOOD: "/games/food",
  // TODO: remove
  PHASER_TEMP: "/games/phaser",

} as const;

export type RouteKeys = keyof typeof ROUTES;

export type RouteValues = typeof ROUTES[RouteKeys];

export type Routes = Record<RouteKeys, RouteValues>;
