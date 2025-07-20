import { useAuthStore } from "../core/state";
import { logAppError } from "../utils/log-app-error";
import { apiClient } from "./api-client";

/**
 * Отправляет лог активности на сервер.
 * @param action Действие, которое произошло (например, "scene_enter", "city_selected").
 * @param details Дополнительные детали в виде объекта.
 * @param sceneName Имя сцены, из которой происходит логирование (для контекста).
 */
export async function logActivity(action: string, details: Record<string, unknown> = {}, sceneName = "Unknown"): Promise<void> {
  const { user, sessionId } = useAuthStore.getState();

  if (user?.id && sessionId) {
    try {
      await apiClient.activityLogs.activityLogControllerCreate({
        userId: user.id,
        action: action,
        details: {
          ...details,
          scene: sceneName,
        },
        sessionId: sessionId,
      });
      console.log(`[Activity Logged - ${sceneName}]: ${action}`, details);
    } catch (error: unknown) {
      logAppError(`Activity Logging (${sceneName})`, error);
    }
  } else {
    console.warn(`[Activity Log - ${sceneName}]: Cannot log "${action}". User ID or Session ID is missing.`);
  }
}
