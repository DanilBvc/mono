export const saveToLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') localStorage.setItem(key, value);
};
export const getFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') return localStorage.getItem(key);
};
