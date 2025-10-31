import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { CheckCircle2, Calendar, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Success() {
  const navigate = useNavigate();
  const {
    selectedService,
    selectedDate,
    selectedTime,
    clientName,
    clientEmail,
    resetBooking,
  } = useBookingStore();

  // Redirigir si se accede directamente sin haber completado el flujo
  useEffect(() => {
    if (!selectedService || !selectedDate) {
      navigate('/services');
    }
  }, [selectedService, selectedDate, navigate]);

  const handleNewBooking = () => {
    resetBooking();
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Success animation */}
        <div className="text-center mb-8 page-transition">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            ¡Reserva Confirmada!
          </h1>
          
          <p className="text-lg text-text-secondary max-w-md mx-auto">
            Hemos enviado todos los detalles de tu cita a tu dirección de correo electrónico
          </p>
        </div>

        {/* Quick summary card */}
        <div className="bg-surface rounded-card border border-border shadow-sm p-6 mb-6">
          <div className="space-y-4">
            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent-light rounded-button">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">Servicio</p>
                <p className="font-semibold text-text-primary">{selectedService?.name}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent-light rounded-button">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">Fecha y Hora</p>
                <p className="font-semibold text-text-primary">
                  {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })} - {selectedTime}
                </p>
              </div>
            </div>

            {/* Client */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent-light rounded-button">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">Confirmación enviada a</p>
                <p className="font-semibold text-text-primary">{clientName}</p>
                <p className="text-sm text-text-secondary">{clientEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info boxes */}
        <div className="space-y-4 mb-8">
          {/* Email info */}
          <div className="bg-blue-50 border border-blue-200 rounded-card p-4 flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Revisa tu email</p>
              <p className="text-sm text-blue-800">
                Te hemos enviado un correo con todos los detalles de tu cita y las instrucciones para llegar.
              </p>
            </div>
          </div>

          {/* Reminder info */}
          <div className="bg-accent-light/50 border border-accent/20 rounded-card p-4 flex items-start gap-3">
            <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-text-primary mb-1">Te enviaremos un recordatorio</p>
              <p className="text-sm text-text-secondary">
                Recibirás un mensaje 24 horas antes de tu cita para que no se te olvide.
              </p>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="bg-surface rounded-card border border-border p-6 mb-8">
          <h3 className="font-semibold text-text-primary mb-3">Información Importante</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Por favor, llega 5 minutos antes de tu cita</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Si necesitas cancelar o reprogramar, hazlo con al menos 24 horas de anticipación</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Puedes contactarnos en cualquier momento si tienes preguntas</span>
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleNewBooking}
            className="w-full shadow-lg"
            size="lg"
          >
            Hacer otra reserva
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="ghost"
            className="w-full"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};