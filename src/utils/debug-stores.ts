import { 
  useSceneStore, 
  usePlayerState, 
  useAuthStore, 
  useStoryStore,
  useMoveSceneStore,
  useSettingsStore
} from "@core/state";

/**
 * Утилита для отладки Zustand-сторов через консоль браузера
 * 
 * Использование:
 * 1. В консоли браузера доступны:
 *    - window.__STORES__ - все сторы
 *    - window.__getState__ - получить текущее состояние стора
 *    - window.__setState__ - изменить состояние стора
 *    - window.__resetState__ - сбросить состояние игрока
 * 
 * Примеры:
 * - window.__getState__('scene') - получить состояние сцены
 * - window.__setState__('player', { energy: 100 }) - установить энергию игрока
 * - window.__resetState__() - сбросить прогресс игрока
 */

interface StoreRegistry {
  scene: typeof useSceneStore;
  player: typeof usePlayerState;
  auth: typeof useAuthStore;
  story: typeof useStoryStore;
  move: typeof useMoveSceneStore;
  settings: typeof useSettingsStore;
  [key: string]: any;
}

const stores: StoreRegistry = {
  scene: useSceneStore,
  player: usePlayerState,
  auth: useAuthStore,
  story: useStoryStore,
  move: useMoveSceneStore,
  settings: useSettingsStore,
};

// Получить состояние стора
const getState = (storeName: keyof StoreRegistry) => {
  if (!stores[storeName]) {
    console.error(`Стор "${storeName}" не найден. Доступные сторы:`, Object.keys(stores));
    return null;
  }
  return stores[storeName].getState();
};

// Изменить состояние стора
const setState = (storeName: keyof StoreRegistry, newState: Record<string, any>) => {
  if (!stores[storeName]) {
    console.error(`Стор "${storeName}" не найден. Доступные сторы:`, Object.keys(stores));
    return;
  }
  
  try {
    stores[storeName].setState(newState);
    console.log(`✅ Состояние "${storeName}" обновлено:`, newState);
    console.log(`📊 Текущее состояние:`, getState(storeName));
  } catch (error) {
    console.error(`❌ Ошибка при обновлении состояния "${storeName}":`, error);
  }
};

// Сбросить состояние игрока
const resetState = async () => {
  try {
    await stores.player.getState().resetProgress();
    console.log('✅ Прогресс игрока сброшен');
    console.log('📊 Текущее состояние:', getState('player'));
  } catch (error) {
    console.error('❌ Ошибка при сбросе прогресса:', error);
  }
};

// Вызов методов стора
const callStoreMethod = (
  storeName: keyof StoreRegistry, 
  methodName: string, 
  ...args: any[]
) => {
  if (!stores[storeName]) {
    console.error(`Стор "${storeName}" не найден. Доступные сторы:`, Object.keys(stores));
    return;
  }
  
  const store = stores[storeName].getState();
  
  if (!store[methodName] || typeof store[methodName] !== 'function') {
    console.error(`Метод "${methodName}" не найден в сторе "${storeName}". Доступные методы:`, 
      Object.keys(store).filter(key => typeof store[key] === 'function'));
    return;
  }
  
  try {
    const result = store[methodName](...args);
    console.log(`✅ Метод "${methodName}" стора "${storeName}" вызван с аргументами:`, args);
    return result;
  } catch (error) {
    console.error(`❌ Ошибка при вызове метода "${methodName}" стора "${storeName}":`, error);
  }
};

// Экспортируем функции в глобальное пространство имен
declare global {
  interface Window {
    __STORES__: StoreRegistry;
    __getState__: typeof getState;
    __setState__: typeof setState;
    __resetState__: typeof resetState;
    __callStoreMethod__: typeof callStoreMethod;
  }
}

export const initDebugStores = () => {
  
    window.__STORES__ = stores;
    window.__getState__ = getState;
    window.__setState__ = setState;
    window.__resetState__ = resetState;
    window.__callStoreMethod__ = callStoreMethod;
    
    console.log('🛠️ Инструменты отладки сторов инициализированы');
    console.log('📚 Доступные сторы:', Object.keys(stores));
    console.log('📖 Документация по использованию:');
    console.log('  • window.__getState__(storeName) - получить состояние стора');
    console.log('  • window.__setState__(storeName, newState) - изменить состояние стора');
    console.log('  • window.__resetState__() - сбросить прогресс игрока');
    console.log('  • window.__callStoreMethod__(storeName, methodName, ...args) - вызвать метод стора');
    console.log('  • window.__STORES__ - доступ ко всем сторам');
  
}