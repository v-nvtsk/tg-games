import { useEffect } from "react";
import { authenticate } from "$/api";
import { useAuthStore } from "@core/state/auth-store";

export const useAuth = () => {
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    const auth = async () => {
      try {
        const { access_token } = await authenticate();
        setToken(access_token);
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

    if (!token) {
      void auth();
    }
  }, [token, setToken]);

  return token;
};
