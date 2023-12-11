export const addToLocalStorage = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  export const fetchFromLocalStorage = <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };
  
  export const removeFromLocalStorage = (key: string): void => {
    localStorage.removeItem(key);
  };
  
  export const clearLocalStorage = (): void => {
    localStorage.clear();
  };
  