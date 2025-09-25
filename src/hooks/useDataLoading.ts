'use client';

import { useState, useEffect } from 'react';

interface UseDataLoadingOptions {
  delay?: number;
  enableLoading?: boolean;
}

export function useDataLoading<T>(
  data: T,
  options: UseDataLoadingOptions = {}
) {
  const { delay = 1000, enableLoading = true } = options;
  const [isLoading, setIsLoading] = useState(enableLoading);

  useEffect(() => {
    if (!enableLoading) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, enableLoading]);

  return {
    data: isLoading ? null : data,
    isLoading
  };
}
