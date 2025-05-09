import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { APP_NETWORK } from '@/types/common';
var storage:Storage;

if (typeof window !== 'undefined') {
  storage = localStorage;
}

const KEY_PREFIX = `SobyWC--${APP_NETWORK}`;

function getItemFromLocalStorage<T>(_key: string): T | null {
  const key = `${KEY_PREFIX}_${_key}`;
  try {
    const value = storage?.getItem(key);
    if (value) return JSON.parse(value) as T | null;
  } catch (error) {
  }
  return null;
}

function setItemToLocalStorage<T>(_key: string, value: T) {
  const key = `${KEY_PREFIX}_${_key}`;
  try {
    if (value) {
      storage?.setItem(key, JSON.stringify(value));
    } else {
      storage?.removeItem(key);
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setInnerState] = useState<T>(() => {
      const value = getItemFromLocalStorage<T>(key);
      if (!value) {
        setItemToLocalStorage(key, initialValue);
      }
      return value as T;
    });

  const setState = useCallback(
    (newValue: T) => {
      setItemToLocalStorage(key, newValue);
      setInnerState(newValue);
    },
    [key],
  );

  return [state, setState as Dispatch<SetStateAction<T>>];
}
