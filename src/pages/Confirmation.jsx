import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { useBookingStore } from '@/store/bookingStore';
import { api } from '@/services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function Confirmation() {
  const navigate = useNavigate();
  const {
    selectedService,
    selectedDate,
    selectedTime,
    additionalServices,
    notes,
    clientName,
    clientPhone,
    clientEmail,
    acceptsPolicy,
    acceptsReminders,
    setAcceptsPolicy,
    setAcceptsReminders,
    confirmBooking,
  } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirigir si no hay datos completos
  useEffect(() => {
    if (!selectedService || !selectedDate || !selectedTime || !clientName || !clientPhone || !clientEmail) {
      navigate('/services');
    }
  }, [selectedService, selectedDate, selectedTime, clientName, clientPhone, clientEmail, navigate]);

  const bookingData = {
    selectedService,
    additionalServices,
    selectedDate,
    selectedTime,
    clientName,
    clientPhone,
    clientEmail,
    notes,
  };

  const handleConfirm = async () => {
    // Validar checkboxes
    if (!acceptsPolicy) {
      setError('Debes aceptar la política de protección de datos para continuar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Preparar datos para el backend
      const appointmentData = {
        clientName,
        clientPhone,
        clientEmail,
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
        appointmentTime: selectedTime,
        serviceName: selectedService.name,
        serviceId: selectedService.id,
        durationMinutes: selectedService.duration_minutes,
        notes: notes || '',
        additionalServices: additionalServices.map(s => ({
          id: s.id,
          name: s.name,
          duration_minutes: s.duration_minutes,
          price: s.price,
        })),
        acceptsReminders,
      };

      // Llamar al backend
      await api.createAppointment('bella-estetica-demo', appointmentData);

      // Si todo salió bien, ir a página de éxito
      confirmBooking();
      navigate('/success');
    } catch (error) {
      console.error('Error creando cita:', error);
      
      if (error.response?.status === 409) {
        setError('Este horario ya no está disponible. Por favor, elige otro horario.');
      } else {
        setError('Hubo un error al procesar tu reserva. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const canConfirm = acceptsPolicy && !loading;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Intro section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            Confirma tu reserva
          </h2>
          <p className="text-text-secondary">
            Revisa los detalles antes de confirmar
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <BookingSummary booking={bookingData} />
        </div>

        {/* Checkboxes */}
        <div className="bg-surface rounded-card border border-border p-6 mb-6 space-y-4">
          {/* Policy checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="policy"
              checked={acceptsPolicy}
              onCheckedChange={setAcceptsPolicy}
            />
            <label
              htmlFor="policy"
              className="text-sm text-text-secondary leading-relaxed cursor-pointer select-none"
            >
              He leído y acepto la{' '}
              <a href="#" className="text-accent hover:underline font-medium">
                política de protección de datos
              </a>
              {' '}*
            </label>
          </div>

          {/* Reminders checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="reminders"
              checked={acceptsReminders}
              onCheckedChange={setAcceptsReminders}
            />
            <label
              htmlFor="reminders"
              className="text-sm text-text-secondary leading-relaxed cursor-pointer select-none"
            >
              Acepto recibir recordatorios y comunicaciones sobre mi cita
            </label>
          </div>
        </div>

        {/* Legal footer */}
        <div className="bg-gray-50 rounded-card border border-border p-4 mb-6">
          <p className="text-xs text-text-secondary leading-relaxed">
            Al confirmar tu reserva, aceptas que tus datos personales sean utilizados únicamente para la gestión de tu cita. 
            Tus datos serán tratados de acuerdo con nuestra política de privacidad y no serán compartidos con terceros. 
            Puedes ejercer tus derechos de acceso, rectificación y supresión en cualquier momento contactándonos.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3 sticky bottom-6">
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full shadow-lg"
            size="lg"
          >
            {loading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Confirmando...
              </>
            ) : (
              'Confirmar Reserva'
            )}
          </Button>

          <Button
            onClick={() => navigate('/client-details')}
            variant="ghost"
            className="w-full"
            disabled={loading}
          >
            Volver a editar
          </Button>
        </div>
      </div>
    </div>
  );
};