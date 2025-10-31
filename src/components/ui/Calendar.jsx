import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { cn } from '/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar({ selected, onSelect, disabled, className, ...props }) {
  return (
    <div className={cn("p-4", className)}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        locale={es}
        showOutsideDays={true}
        fixedWeeks
        className="w-full"
        components={{
          Chevron: ({ orientation }) => {
            const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
            return <Icon className="h-5 w-5" />;
          },
        }}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          month_caption: "flex justify-center pt-1 relative items-center mb-4",
          caption_label: "text-base font-semibold text-text-primary",
          nav: "flex items-center",
          nav_button_previous: cn(
            "absolute left-1",
            "h-9 w-9 bg-transparent p-0 ",
            "inline-flex items-center justify-center rounded-button",
            "transition-colors"
          ),
          nav_button_next: cn(
            "absolute right-1",
            "h-9 w-9 bg-transparent p-0 ",
            "inline-flex items-center justify-center rounded-button",
            "transition-colors"
          ),
          month_grid: "w-full border-collapse mt-4",
          weekdays: "flex justify-center",
          weekday: "text-text-secondary w-12 font-medium text-sm text-center",
          week: "flex w-full justify-center",
          day: "relative p-0 text-center",
          day_button: cn(
            "h-10 w-10 p-0 font-semibold rounded-button mx-auto flex items-center justify-center",
            "hover:bg-accent-light hover:text-accent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent",
            "text-text-primary"
          ),
          selected: "bg-accent text-white hover:bg-accent hover:text-white font-bold",
          today: "bg-gray-100 text-accent font-bold border-2 border-accent",
          outside: "text-text-secondary opacity-40",
          disabled: "text-text-secondary opacity-20 cursor-not-allowed hover:bg-transparent",
          hidden: "invisible",
        }}
        {...props}
      />
    </div>
  );
};