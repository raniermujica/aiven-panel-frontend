import { Clock, Euro, X } from 'lucide-react';
import { cn } from '/utils.js';

export function AdditionalServiceCard({ service, onRemove }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-accent-light/50 border border-accent/20 rounded-card">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-text-primary">{service.name}</h4>
          {service.emoji && (
            <span className="text-xl">{service.emoji}</span>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{service.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Euro className="w-3.5 h-3.5" />
            <span className="font-medium">{service.price}</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onRemove}
        className="p-1.5 hover:bg-red-100 rounded-button transition-colors group"
        aria-label="Eliminar servicio"
      >
        <X className="w-5 h-5 text-text-secondary group-hover:text-red-600" />
      </button>
    </div>
  );
};