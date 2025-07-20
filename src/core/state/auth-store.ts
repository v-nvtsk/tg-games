import { create } from "zustand";
import WebApp from "@twa-dev/sdk";
import { type UserInfoDto, apiClient } from "$/api";
import { logAppError } from "@utils/log-app-error";

interface AuthState {
  token: string | null;
  user: UserInfoDto | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  setToken: (token: string) => void;
  setUser: (user: UserInfoDto) => void;
  setSessionId: (sessionId: string) => void;
  authenticateUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user") || "null") as UserInfoDto | null,
  sessionId: localStorage.getItem("sessionId") || null,
  isAuthenticated: false,
  isVerifying: false,

  setToken: (token) => {
    set({ token,
      isAuthenticated: !!token });
    localStorage.setItem("token", token);
  },
  setUser: (user) => {
    set({ user });
    localStorage.setItem("user", JSON.stringify(user));
  },
  setSessionId: (sessionId) => {
    set({ sessionId });
    localStorage.setItem("sessionId", sessionId);
  },

  authenticateUser: async () => {
    if (!WebApp.initData) {
      console.error("Telegram initData not available");
      return;
    }

    if (get().isVerifying) return;

    set({ isVerifying: true });

    try {
      const authResponse = await apiClient.auth.authControllerLogin({
        initData: WebApp.initData,
      });

      const { accessToken, user, sessionId } = authResponse.data;

      get().setToken(accessToken);
      get().setUser(user);
      get().setSessionId(sessionId);

      try {
        const details: Record<string, string> = {
          userAgent: navigator.userAgent,
          telegramVersion: WebApp.version,
        };

        await apiClient.activityLogs.activityLogControllerCreate({
          userId: user.id,
          action: "user_authenticated",
          details: details,
          sessionId: sessionId,
        });
        console.log("Logged user agent and Telegram version on authentication.");
      } catch (logError: unknown) {
        logAppError("Authentication Logging", logError);
        set({ isVerifying: false });
      }

    } catch (error: unknown) {
      logAppError("Authentication", error);
      get().logout();
      throw error;
    } finally {
      set({ isVerifying: false });
    }
  },

  logout: () => {
    set({ token: null,
      user: null,
      sessionId: null,
      isAuthenticated: false });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
  },
}));
