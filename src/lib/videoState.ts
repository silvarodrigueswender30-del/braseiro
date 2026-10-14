import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'videosPausados';
const STORAGE_KEY_ALT = 'braseiro_videos_paused';
const EVENT_NAME = 'videosPausadosChange';

export function getInitialVideosPaused(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = sessionStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY_ALT);
  if (stored !== null) {
    return stored === 'true';
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function setGlobalVideosPaused(paused: boolean) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, String(paused));
  sessionStorage.setItem(STORAGE_KEY_ALT, String(paused));
  window.dispatchEvent(new CustomEvent<boolean>(EVENT_NAME, { detail: paused }));
}

export function useVideosPaused() {
  const [isPaused, setIsPaused] = useState<boolean>(getInitialVideosPaused);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        setIsPaused(e.newValue === 'true');
      }
    };
    const handleCustom = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      setIsPaused(custom.detail);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(EVENT_NAME, handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(EVENT_NAME, handleCustom);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = !isPaused;
    setIsPaused(next);
    setGlobalVideosPaused(next);
  }, [isPaused]);

  return { isPaused, toggle, setPaused: setGlobalVideosPaused };
}
