import { ActivityLogsApi, AuthApi, Configuration, GameStateApi } from "./generated";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const config = new Configuration({
  basePath: API_BASE_URL,
  accessToken: () => {
    // Получи токен из localStorage или Zustand
    return localStorage.getItem("token") || "";
  },
});

const authApi = new AuthApi(config);

const activityLogsApi = new ActivityLogsApi(config);

const gameStateApi = new GameStateApi(config);

// export const apiClient = {
//   auth: {
//     login: async () => {
//       const response = await authApi.authControllerLogin({ initData: WebApp.initData });
//       return response;
//     },
//   },
// };

export const apiClient = {
  auth: authApi,
  activityLogs: activityLogsApi,
  gameState: gameStateApi,
};
