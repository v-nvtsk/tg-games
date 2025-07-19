import { useEffect } from "react";
import { useAuthStore } from "../../state";

export const useAuth = () => {
  const { isAuthenticated, token, authenticateUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      void authenticateUser();
    }
  }, [isAuthenticated, authenticateUser]);

  return token;
};
