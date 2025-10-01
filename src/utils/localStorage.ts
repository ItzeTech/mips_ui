export const loadState = <T>(key: string): T | undefined => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) return undefined;

    try {
      return JSON.parse(serializedState) as T;
    } catch {
      // Fallback for raw strings like "dark" or "light"
      return serializedState as unknown as T;
    }
  } catch (error) {
    console.error("Could not load state from localStorage", error);
    return undefined;
  }
};

export const saveState = <T>(key: string, state: T): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Could not save state to localStorage", error);
  }
};

export const removeState = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Could not remove state from localStorage", error);
  }
};
