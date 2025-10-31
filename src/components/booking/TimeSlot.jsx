import { cn } from '/utils.js';
import { Clock } from 'lucide-react';

export function TimeSlot({ time, available = true, selected, onSelect }) {
  return (
    <button
      onClick={() => available && onSelect(time)}
      disabled={!available}
      className={cn(
        "px-4 py-3 rounded-button border-2 transition-all duration-200",
        "flex items-center justify-center gap-2",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        available && !selected && "border-border bg-surface hover:border-accent/50 hover:bg-accent-light/50",
        available && selected && "border-accent bg-accent-light text-accent font-semibold",
        available && "hover:scale-105 active:scale-95"
      )}
    >
      <Clock className="w-4 h-4" />
      <span className="text-sm">{time}</span>
      {selected && <span className="ml-1">✓</span>}
    </button>
  );
};