export const useLocalStorage = () => {
  const setItem = (name: string, data: any) => {
    if (typeof data === "string") {
      localStorage.setItem(name, data);
    } else {
      localStorage.setItem(name, JSON.stringify(data));
    }
  };
  const getItem = (name: string) => {
    //@ts-ignore
    return JSON.parse(localStorage.getItem(name));
  };
  const removeItem = (name: string) => {
    localStorage.removeItem(name);
  };
  const clearStorage = () => {
    localStorage.clear();
  };
  return { setItem, getItem, removeItem, clearStorage };
};
