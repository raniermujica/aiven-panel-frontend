import { Clock, Euro } from 'lucide-react';
import { cn } from '/utils.js'

export function ServiceCard({ service, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className={cn(
        "w-full p-6 rounded-card border-2 text-left transition-all duration-200",
        "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        selected
          ? "border-accent bg-accent-light"
          : "border-border bg-surface hover:border-accent/30"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {service.name}
          </h3>

          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{service.duration_minutes} min</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Euro className="w-4 h-4" />
              <span className="font-medium">{service.price}</span>
            </div>
          </div>

          {service.description && (
            <p className="mt-3 text-sm text-text-secondary line-clamp-2">
              {service.description}
            </p>
          )}
        </div>

        {service.emoji && (
          <div className="ml-4 text-3xl">
            {service.emoji}
          </div>
        )}
      </div>

      {selected && (
        <div className="mt-3 pt-3 border-t border-accent/20">
          <span className="text-sm font-medium text-accent">
            ✓ Servicio seleccionado
          </span>
        </div>
      )}
    </button>
  );
};