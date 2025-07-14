import WebApp from "@twa-dev/sdk";

// Тип для данных пользователя (только те поля, что точно есть)
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export const useTelegramUser = (): TelegramUser | null => {
  const initData = WebApp.initDataUnsafe;

  if (!initData || !initData.user) {
    return null;
  }

  const { id, first_name, last_name, username } = initData.user;

  return {
    id,
    first_name,
    last_name,
    username,
  };
};
