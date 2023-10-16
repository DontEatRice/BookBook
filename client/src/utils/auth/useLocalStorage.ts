import { useCallback, useState } from 'react';

export function useLocalStorage() {
  const [value, setValue] = useState<string | null>(null);

  const setItem = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
  }, []);

  const getItem = useCallback((key: string) => {
    const value = localStorage.getItem(key);
    setValue(value);
    return value;
  }, []);

  const removeItem = useCallback((key: string) => {
    localStorage.removeItem(key);
    setValue(null);
  }, []);

  return { value, setItem, getItem, removeItem };
}
