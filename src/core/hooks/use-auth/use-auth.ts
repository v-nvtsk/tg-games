import { useEffect } from "react";
import { useAuthStore } from "@core/state";
import { useTelegram } from "../use-telegram";

export const useAuth = () => {
  const { webApp: { initData } } = useTelegram();

  const { isAuthenticated, token, authenticateUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && initData) {
      void authenticateUser();
    }
  }, [isAuthenticated, authenticateUser, initData]);

  return token;
};
