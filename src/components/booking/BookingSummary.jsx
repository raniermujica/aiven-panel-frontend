import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User, Mail, Phone, Scissors, FileText, Euro } from 'lucide-react';

export function BookingSummary({ booking }) {
  const {
    selectedService,
    additionalServices = [],
    selectedDate,
    selectedTime,
    clientName,
    clientPhone,
    clientEmail,
    notes,
  } = booking;

  // Calcular total
  const mainServicePrice = parseFloat(selectedService?.price || 0);
  const additionalServicesPrice = additionalServices.reduce(
    (sum, service) => sum + parseFloat(service.price || 0),
    0
  );
  const totalPrice = mainServicePrice + additionalServicesPrice;

  // Calcular duración total
  const mainServiceDuration = parseInt(selectedService?.duration_minutes || 0);
  const additionalServicesDuration = additionalServices.reduce(
    (sum, service) => sum + parseInt(service.duration_minutes || 0),
    0
  );
  const totalDuration = mainServiceDuration + additionalServicesDuration;

  return (
    <div className="space-y-6">
      {/* Fecha y hora */}
      <div className="bg-surface rounded-card border border-border p-5">
        <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Fecha y Hora
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-text-primary">
              {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-text-primary">{selectedTime}</span>
          </div>
        </div>
      </div>

      {/* Servicios */}
      <div className="bg-surface rounded-card border border-border p-5">
        <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Scissors className="w-5 h-5 text-accent" />
          Servicios
        </h3>
        <div className="space-y-3">
          {/* Servicio principal */}
          <div className="flex items-start justify-between pb-3 border-b border-border">
            <div className="flex-1">
              <p className="font-medium text-text-primary">{selectedService?.name}</p>
              <p className="text-sm text-text-secondary mt-1">
                {selectedService?.duration_minutes} minutos
              </p>
            </div>
            <p className="font-semibold text-text-primary">€{selectedService?.price}</p>
          </div>

          {/* Servicios adicionales */}
          {additionalServices.map((service) => (
            <div key={service.id} className="flex items-start justify-between pb-3 border-b border-border">
              <div className="flex-1">
                <p className="font-medium text-text-primary">{service.name}</p>
                <p className="text-sm text-text-secondary mt-1">
                  {service.duration_minutes} minutos
                </p>
              </div>
              <p className="font-semibold text-text-primary">€{service.price}</p>
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-semibold text-text-primary">Total</p>
              <p className="text-sm text-text-secondary">
                Duración total: {totalDuration} minutos
              </p>
            </div>
            <p className="text-xl font-bold text-accent">€{totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tus datos */}
      <div className="bg-surface rounded-card border border-border p-5">
        <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Tus Datos
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-text-secondary">
            <User className="w-4 h-4" />
            <span className="text-text-primary">{clientName}</span>
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <Phone className="w-4 h-4" />
            <span className="text-text-primary">{clientPhone}</span>
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <Mail className="w-4 h-4" />
            <span className="text-text-primary">{clientEmail}</span>
          </div>
        </div>
      </div>

      {/* Notas */}
      {notes && (
        <div className="bg-surface rounded-card border border-border p-5">
          <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Notas para el Profesional
          </h3>
          <p className="text-sm text-text-secondary italic">{notes}</p>
        </div>
      )}
    </div>
  );
};