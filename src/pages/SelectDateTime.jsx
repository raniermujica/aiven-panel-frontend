import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { TimeSlot } from '@/components/booking/TimeSlot';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, Clock } from 'lucide-react';

// Mock de horarios disponibles - luego vendrá del backend
const MOCK_MORNING_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
const MOCK_AFTERNOON_SLOTS = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];

export function SelectDateTime() {
  const navigate = useNavigate();
  const { selectedService, selectedDate, selectedTime, setDateTime } = useBookingStore();
  
  const [localDate, setLocalDate] = useState(selectedDate || null);
  const [localTime, setLocalTime] = useState(selectedTime || null);
  const [availableSlots, setAvailableSlots] = useState({
    morning: MOCK_MORNING_SLOTS,
    afternoon: MOCK_AFTERNOON_SLOTS,
  });
  const [loading, setLoading] = useState(false);

  // Redirigir si no hay servicio seleccionado
  useEffect(() => {
    if (!selectedService) {
      navigate('/services');
    }
  }, [selectedService, navigate]);

  // Cuando se selecciona una fecha, cargar horarios disponibles
  useEffect(() => {
    if (localDate) {
      loadAvailableSlots(localDate);
    }
  }, [localDate]);

  const loadAvailableSlots = async (date) => {
    setLoading(true);
    try {
      // TODO: Llamar al backend para obtener horarios reales
      // const response = await api.checkAvailability(
      //   'bella-estetica-demo',
      //   format(date, 'yyyy-MM-dd'),
      //   selectedService.id,
      //   selectedService.duration_minutes
      // );
      
      // Por ahora usamos mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular carga
      
      // Simular algunos horarios ocupados
      const occupiedSlots = ['10:00', '17:00', '18:30'];
      setAvailableSlots({
        morning: MOCK_MORNING_SLOTS.filter(slot => !occupiedSlots.includes(slot)),
        afternoon: MOCK_AFTERNOON_SLOTS.filter(slot => !occupiedSlots.includes(slot)),
      });
    } catch (error) {
      console.error('Error cargando horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setLocalDate(date);
    setLocalTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setLocalTime(time);
  };

  const handleContinue = () => {
    if (localDate && localTime) {
      setDateTime(localDate, localTime);
      navigate('/add-ons');
    }
  };

  // Deshabilitar fechas pasadas
  const disabledDays = {
    before: startOfDay(new Date()),
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Intro section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light rounded-full mb-4">
            <CalendarDays className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            ¿Cuándo te gustaría tu cita?
          </h2>
          <p className="text-text-secondary">
            Selecciona el día y horario que mejor te convenga
          </p>
        </div>

        {/* Selected service recap */}
        <div className="mb-6 p-4 bg-accent-light/50 border border-accent/20 rounded-card">
          <p className="text-sm text-text-secondary mb-1">Servicio seleccionado:</p>
          <p className="font-semibold text-text-primary">{selectedService?.name}</p>
          <p className="text-sm text-text-secondary mt-1">
            Duración: {selectedService?.duration_minutes} minutos
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-surface rounded-card border border-border shadow-sm mb-6">
          <Calendar
            selected={localDate}
            onSelect={handleDateSelect}
            disabled={disabledDays}
          />
        </div>

        {/* Time slots */}
        {localDate && (
          <div className="space-y-6 mb-8 page-transition">
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Horarios disponibles para el{' '}
                <span className="font-semibold text-text-primary">
                  {format(localDate, "EEEE, d 'de' MMMM", { locale: es })}
                </span>
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <p className="mt-4 text-text-secondary">Cargando horarios disponibles...</p>
              </div>
            ) : (
              <>
                {/* Morning slots */}
                {availableSlots.morning.length > 0 && (
                  <div className="bg-surface rounded-card border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-text-secondary" />
                      <h3 className="font-semibold text-text-primary">Turno Mañana</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.morning.map((time) => (
                        <TimeSlot
                          key={time}
                          time={time}
                          available={true}
                          selected={localTime === time}
                          onSelect={handleTimeSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Afternoon slots */}
                {availableSlots.afternoon.length > 0 && (
                  <div className="bg-surface rounded-card border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-text-secondary" />
                      <h3 className="font-semibold text-text-primary">Turno Tarde</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.afternoon.map((time) => (
                        <TimeSlot
                          key={time}
                          time={time}
                          available={true}
                          selected={localTime === time}
                          onSelect={handleTimeSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {availableSlots.morning.length === 0 && availableSlots.afternoon.length === 0 && (
                  <div className="text-center py-12 bg-surface rounded-card border border-border">
                    <p className="text-text-secondary">
                      No hay horarios disponibles para este día.
                    </p>
                    <p className="text-sm text-text-secondary mt-2">
                      Por favor, selecciona otra fecha.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Continue button */}
        {localDate && localTime && (
          <div className="sticky bottom-6 page-transition">
            <Button
              onClick={handleContinue}
              className="w-full shadow-lg"
              size="lg"
            >
              Continuar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};