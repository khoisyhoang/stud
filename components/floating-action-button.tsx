'use client';

import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  isExpanded?: boolean;
  className?: string;
}

export function FloatingActionButton({ 
  onClick, 
  isExpanded = false,
  className 
}: FloatingActionButtonProps) {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3",
      className
    )}>
      {isExpanded && (
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="rounded-lg border border-border/50 bg-popover/95 p-3 shadow-lg backdrop-blur-sm">
            <p className="text-sm font-medium">Start a new study session</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create and host your own focus session
            </p>
          </div>
        </div>
      )}
      
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg shadow-primary/20 border-0 transition-all duration-200",
          "hover:scale-110 hover:shadow-xl hover:shadow-primary/30",
          "active:scale-95",
          isExpanded && "rotate-45"
        )}
      >
        <Plus className={cn(
          "h-6 w-6 transition-transform duration-200",
          isExpanded && "rotate-45"
        )} />
      </Button>
    </div>
  );
}
