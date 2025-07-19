/**
 * Логирует ошибки приложения с указанием контекста.
 * @param context Строка, указывающая, где произошла ошибка (например, "Authentication", "Scene Change").
 * @param error Объект ошибки, который может быть типа unknown.
 */
export function logAppError(context: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[${context} Error]: ${error.message}`, error);
  } else {
    console.error(`[${context} Error]: An unexpected error occurred.`, error);
  }
}
