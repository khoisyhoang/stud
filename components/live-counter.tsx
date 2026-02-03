'use client';

import { useEffect, useState } from 'react';
import { getMockLiveCount } from '@/lib/mock-data';
import { Flame } from 'lucide-react';

export function LiveCounter() {
  const [count, setCount] = useState(1234);

  useEffect(() => {
    // Simulate real-time updates - replace with WebSocket/API later
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 backdrop-blur-sm">
      <div className="relative">
        <Flame className="h-5 w-5 text-orange-500" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-orange-500/20 blur-md" />
      </div>
      <span className="text-lg font-semibold tabular-nums tracking-tight">
        {count.toLocaleString()}
      </span>
      <span className="text-sm text-muted-foreground">people studying right now</span>
    </div>
  );
}
