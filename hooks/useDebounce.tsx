import { useEffect, useRef } from "react";

const useDebounce = (callback: (text: string) => void, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Cleanup on unmount
      }
    };
  }, []);

  const debouncedCallback = (text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear the previous timeout
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      callback(text);
    }, delay);
  };

  return debouncedCallback;
};

export default useDebounce;