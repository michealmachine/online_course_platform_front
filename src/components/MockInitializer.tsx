'use client';

import { useEffect } from 'react';

export function MockInitializer() {
  useEffect(() => {
    const init = async () => {
      const { initMocks } = await import('@/lib/mock');
      await initMocks();
    };

    init().catch(console.error);
  }, []);

  return null;
} 