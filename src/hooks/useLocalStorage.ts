import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// Anniversary-specific state interface
export interface AnniversaryState {
  openedLetters: boolean[];
  lastLetterIndex: number;
  audioMuted: boolean;
  audioVolume: number;
  hasCompletedVows: boolean;
  unlockedPhotoCount: number;
  heartbeatMode: boolean;
  hasSeenMontage: boolean;
}

export const INITIAL_ANNIVERSARY_STATE: AnniversaryState = {
  openedLetters: [false, false, false, false, false],
  lastLetterIndex: -1,
  audioMuted: false,
  audioVolume: 0.5,
  hasCompletedVows: false,
  unlockedPhotoCount: 0,
  heartbeatMode: true, // Default ON
  hasSeenMontage: false,
};

export function useAnniversaryState() {
  const [state, setState] = useLocalStorage<AnniversaryState>('anniversary-state', INITIAL_ANNIVERSARY_STATE);

  const openLetter = useCallback((index: number) => {
    setState(prev => {
      // Check if this letter was already opened
      if (prev.openedLetters[index]) {
        return prev; // No change needed
      }

      // Calculate new unlocked photo count (2 per newly opened letter)
      const newUnlockedCount = Math.min(prev.unlockedPhotoCount + 2, 10);

      return {
        ...prev,
        openedLetters: prev.openedLetters.map((opened, i) => i === index ? true : opened),
        lastLetterIndex: index,
        unlockedPhotoCount: newUnlockedCount,
      };
    });
  }, [setState]);

  const setAudioSettings = useCallback((muted: boolean, volume: number) => {
    setState(prev => ({
      ...prev,
      audioMuted: muted,
      audioVolume: volume,
    }));
  }, [setState]);

  const completeVows = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasCompletedVows: true,
    }));
  }, [setState]);

  const setHeartbeatMode = useCallback((enabled: boolean) => {
    setState(prev => ({
      ...prev,
      heartbeatMode: enabled,
    }));
  }, [setState]);

  const setHasSeenMontage = useCallback((seen: boolean) => {
    setState(prev => ({
      ...prev,
      hasSeenMontage: seen,
    }));
  }, [setState]);

  const resetState = useCallback(() => {
    setState(INITIAL_ANNIVERSARY_STATE);
  }, [setState]);

  const allLettersOpened = state.openedLetters.every(Boolean);
  const openedLetterCount = state.openedLetters.filter(Boolean).length;

  return {
    state,
    openLetter,
    setAudioSettings,
    completeVows,
    setHeartbeatMode,
    setHasSeenMontage,
    resetState,
    allLettersOpened,
    openedLetterCount,
  };
}
