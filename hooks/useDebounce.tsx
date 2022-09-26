import { useEffect, useState } from "react";

interface Debounce<T> {
  (func : T, delay : number) : (...args: any) => void 
}

export const debounce : Debounce<any> = (func: any, delay: number) => {
  let timeOutId: number;
    return (...args: any) => {
        if (timeOutId) clearTimeout(timeOutId)
        timeOutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}



export function useDebounce(value : any, delay : number) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState<any>(value);
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
  }