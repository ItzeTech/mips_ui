export const loadState = <T>(key: string): T | undefined => {
    try {
      const serializedState = localStorage.getItem(key);
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
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
  }
  