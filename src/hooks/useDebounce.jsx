import { useEffect, useState } from "react";

export default function useDebounce(value, delay, callbackFn) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      if (callbackFn) {
        callbackFn(value);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
