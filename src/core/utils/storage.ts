export const saveValue = (key: string, value: any) => window.localStorage.setItem(key, value);
export const getValue = (key: string ) : string | null => window.localStorage.getItem(key);
export const clearValue = (key: string) => window.localStorage.removeItem(key);
export const isContainKey = (key: string) => window.localStorage.getItem(key) !== null;
export const clearAll = () => window.localStorage.clear();