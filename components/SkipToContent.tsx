"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function SkipToContent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <a
      href="#main-content"
      id="skip-to-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black",
        "focus:border focus:border-blue-600 focus:outline-none focus:shadow-lg",
        "focus:left-4 focus:top-4 focus:rounded-md"
      )}
    >
      Skip to content
    </a>
  );
}