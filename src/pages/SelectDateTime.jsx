import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '../components/ui/Calendar';
import { useBookingStore } from '@/store/bookingStore';
import { api } from '@/services/api';
import { CalendarDays, Clock, AlertCircle, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function SelectDateTime() {
  const navigate = useNavigate();
  const { 
    selectedService,
    additionalServices,
    setDateTime, 
    businessSlug,
    isRestaurant,
    partySize
  } = useBookingStore();

  const [localDate, setLocalDate] = useState(null);
  const [localTime, setLocalTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedService) {
      navigate(`/${businessSlug}/services`);
    }
  }, [selectedService, businessSlug, navigate]);

  const totalDuration = selectedService?.duration_minutes + 
    (additionalServices?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0);

  useEffect(() => {
    if (localDate && selectedService) {
      loadAvailableSlots();
    }
  }, [localDate]);

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      setLocalTime(null);

      const dateStr = format(localDate, 'yyyy-MM-dd');
      
      console.log('🔍 Llamando checkAvailability con:', {
        businessSlug,
        date: dateStr,
        serviceId: selectedService.id,
        totalDuration,
        partySize: isRestaurant ? partySize : null
      });

      const data = await api.checkAvailability(
        businessSlug,
        dateStr,
        selectedService.id,
        totalDuration,
        isRestaurant ? partySize : null  // ✅ ENVIAR partySize para restaurantes
      );

      console.log('✅ Slots recibidos:', data.availableSlots?.length || 0);
      setAvailableSlots(data.availableSlots || []);
    } catch (err) {
      console.error('Error cargando horarios:', err);
      setError('No se pudieron cargar los horarios disponibles');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setLocalDate(date);
    setLocalTime(null);
  };

  const handleTimeSelect = (time) => {
    setLocalTime(time);
  };

  const handleContinue = () => {
    if (localDate && localTime) {
      setDateTime(localDate, localTime);
      navigate(`/${businessSlug}/client-details`); 
    }
  };

  const disabledDays = {
    before: startOfDay(new Date()),
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        
        <button
          type="button"
          onClick={() => navigate(`/${businessSlug}/${isRestaurant ? 'services' : 'add-ons'}`)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver</span>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            {isRestaurant ? 'Elige tu horario' : '¿Cuándo te gustaría tu cita?'}
          </h2>
          <p className="text-text-secondary">
            {isRestaurant 
              ? `Reserva para ${partySize} ${partySize === 1 ? 'persona' : 'personas'}` 
              : 'Selecciona el día y horario que mejor te convenga'
            }
          </p>
        </div>

        {!isRestaurant && (
          <div className="mb-6 p-4 bg-accent-light/50 border border-accent/20 rounded-card">
            <p className="text-sm text-text-secondary mb-2">Servicios seleccionados:</p>
            <div className="space-y-1">
              <p className="font-semibold text-text-primary">• {selectedService?.name}</p>
              {additionalServices?.map(service => (
                <p key={service.id} className="font-semibold text-text-primary">
                  • {service.name}
                </p>
              ))}
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Duración total: {totalDuration} minutos
            </p>
          </div>
        )}

        <div className="bg-surface rounded-card border border-border shadow-sm mb-6">
          <Calendar
            mode="single"
            selected={localDate}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            locale={es}
            className="p-4"
          />
        </div>

        {localDate && (
          <div className="space-y-6 mb-8 page-transition">
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                {isRestaurant ? 'Mesas disponibles' : 'Horarios disponibles'} para el{' '}
                <span className="font-semibold text-text-primary">
                  {format(localDate, "EEEE, d 'de' MMMM", { locale: es })}
                </span>
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-text-secondary">
                  {isRestaurant ? 'Verificando disponibilidad de mesas...' : 'Cargando horarios...'}
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <Button variant="outline" onClick={loadAvailableSlots} size="sm">
                  Reintentar
                </Button>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleTimeSelect(slot)}
                    className={`
                      p-3 rounded-button border-2 transition-all text-sm font-medium
                      ${localTime === slot
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-surface text-text-primary hover:border-accent/50 hover:bg-accent-light/30'
                      }
                    `}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                {isRestaurant ? (
                  <UtensilsCrossed className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
                ) : (
                  <Clock className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
                )}
                <p className="font-medium text-text-primary mb-1">
                  {isRestaurant ? 'No hay mesas disponibles' : 'No hay horarios disponibles'}
                </p>
                <p className="text-sm text-text-secondary">
                  {isRestaurant 
                    ? `No tenemos mesas disponibles para ${partySize} ${partySize === 1 ? 'persona' : 'personas'} en esta fecha.`
                    : 'Por favor, selecciona otra fecha.'
                  }
                </p>
                {isRestaurant && (
                  <p className="text-xs text-text-secondary mt-2">
                    Intenta con otra fecha o contáctanos directamente.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

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