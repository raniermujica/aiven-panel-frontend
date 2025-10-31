import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { cn } from '/utils';

export function Calendar({ selected, onSelect, disabled, className, ...props }) {
  return (
    <div className={cn("p-4", className)}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        locale={es}
        showOutsideDays={false}
        className="w-full"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center mb-4",
          caption_label: "text-base font-semibold text-text-primary",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
            "inline-flex items-center justify-center rounded-button",
            "hover:bg-gray-100 transition-colors"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
          head_row: "flex w-full",
          head_cell: "text-text-secondary rounded-button w-full font-normal text-sm flex-1",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm flex-1",
            "focus-within:relative focus-within:z-20"
          ),
          day: cn(
            "h-10 w-full p-0 font-normal rounded-button",
            "hover:bg-accent-light hover:text-accent transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-accent"
          ),
          day_selected: "bg-accent text-white hover:bg-accent hover:text-white font-semibold",
          day_today: "bg-gray-100 text-accent font-semibold",
          day_outside: "text-text-secondary opacity-50",
          day_disabled: "text-text-secondary opacity-30 cursor-not-allowed",
          day_hidden: "invisible",
        }}
        {...props}
      />
    </div>
  );
}