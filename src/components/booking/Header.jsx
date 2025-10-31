import { Info, ArrowLeft } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const STEP_LABELS = {
  1: 'Seleccionar Servicio',
  2: 'Fecha y Hora',
  3: 'Servicios Adicionales',
  4: 'Tus Datos',
  5: 'Confirmar Reserva',
  6: 'Confirmación',
};

export function Header() {
  const { currentStep, business, goBack } = useBookingStore();
  
  const showBackButton = currentStep > 1 && currentStep < 6;
  const totalSteps = 5; // No contamos el paso 6 (éxito)
  const progressPercentage = currentStep === 6 ? 100 : (currentStep / totalSteps) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
      <div className="max-w-2xl mx-auto px-6 py-4">
        {/* Top row: Back button + Business name + Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={goBack}
                className="p-2 hover:bg-gray-100 rounded-button transition-colors"
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-text-secondary" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-text-primary">
              {business?.name || 'Bella Estética'}
            </h1>
          </div>
          
          <button
            className="p-2 hover:bg-gray-100 rounded-button transition-colors"
            aria-label="Información"
          >
            <Info className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Progress indicator */}
        {currentStep < 6 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                {STEP_LABELS[currentStep]}
              </span>
              <span className="text-text-secondary font-medium">
                Paso {currentStep} de {totalSteps}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
