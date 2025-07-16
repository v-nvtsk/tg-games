// src/app/hooks/use-auth.ts
import { useEffect, useState } from "react";
import { authenticate } from "@/api";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = async () => {
      try {
        const { access_token } = await authenticate();
        setToken(access_token);
      } catch (error) {
        console.error("Authentication error:", error);
        // Дополнительная обработка ошибок
      }
    };

    void auth();
  }, []);

  return token;
};
