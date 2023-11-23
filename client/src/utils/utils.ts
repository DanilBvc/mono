export const saveToLocalStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') localStorage.setItem(key, value);
};
export const getFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') return localStorage.getItem(key);
};

export const getRoomExpireTime = (time: Date) => {
  const date = new Date(time);
  date.setMinutes(date.getMinutes() + 45);
  return date.toISOString().split('T')[1].split('.')[0];
};
