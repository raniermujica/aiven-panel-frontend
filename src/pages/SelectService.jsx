import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { api } from '@/services/api';
import { AlertCircle, Calendar, Users } from 'lucide-react';

export function SelectService() {
  const navigate = useNavigate();
  const { 
    selectedService, 
    setService, 
    businessSlug, 
    businessData, 
    isRestaurant,
    partySize,
    setPartySize 
  } = useBookingStore();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSelected, setLocalSelected] = useState(selectedService);
  const [localPartySize, setLocalPartySize] = useState(partySize);

  // ✅ CORRECCIÓN: Esperar a que businessData esté cargado
  useEffect(() => {
    if (!businessData) {
      // Aún no tenemos datos del negocio, seguir esperando
      return;
    }

    if (isRestaurant) {
      // Si es restaurante, no cargar servicios
      setLoading(false);
    } else if (businessSlug) {
      // Si es beauty, cargar servicios
      loadServices();
    }
  }, [businessSlug, isRestaurant, businessData]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getServices(businessSlug);
      setServices(data.services || []);
    } catch (err) {
      console.error('Error cargando servicios:', err);
      setError('No se pudieron cargar los servicios. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectService = (service) => {
    setLocalSelected(service);
  };

  const handleContinue = () => {
    if (isRestaurant) {
      const dummyService = {
        id: null,
        name: 'Reserva de Mesa',
        duration_minutes: 90,
        price: 0
      };
      setService(dummyService);
      setPartySize(localPartySize);
      navigate(`/${businessSlug}/date-time`);
    } else {
      if (localSelected) {
        setService(localSelected);
        navigate(`/${businessSlug}/add-ons`);
      }
    }
  };

  // ✅ CORRECCIÓN: Mostrar loading mientras cargamos businessData
  if (!businessData || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Cargando...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // VISTA PARA RESTAURANTES
  // ========================================
  if (isRestaurant) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
              Reserva tu mesa
            </h2>
            <p className="text-text-secondary">
              Selecciona el número de personas
            </p>
          </div>

          <div className="bg-surface border border-border rounded-card shadow-sm p-6 mb-8">
            <label className="block text-sm font-medium text-text-primary mb-3">
              ¿Cuántas personas?
            </label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setLocalPartySize(Math.max(1, localPartySize - 1))}
                disabled={localPartySize <= 1}
              >
                -
              </Button>
              
              <div className="flex items-center gap-2 flex-1 justify-center">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-3xl font-semibold text-text-primary">
                  {localPartySize}
                </span>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setLocalPartySize(Math.min(20, localPartySize + 1))}
                disabled={localPartySize >= 20}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-text-secondary text-center mt-3">
              Grupos de más de 20 personas, por favor llámanos
            </p>
          </div>

          {businessData?.description && (
            <div className="bg-accent-light/30 border border-accent/20 rounded-card p-4 mb-8">
              <p className="text-sm text-text-secondary">
                {businessData.description}
              </p>
            </div>
          )}

          <div className="sticky bottom-6">
            <Button
              onClick={handleContinue}
              className="w-full shadow-lg"
              size="lg"
            >
              Continuar a fecha y hora
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // VISTA PARA BEAUTY/OTROS NICHOS
  // ========================================
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-32">
        <div className="text-center max-w-md mx-auto px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Error al cargar servicios
          </h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={loadServices}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-32">
        <div className="text-center max-w-md mx-auto px-6">
          <Calendar className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No hay servicios disponibles
          </h2>
          <p className="text-text-secondary">
            Por favor, contacta con el negocio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            ¿Qué servicio deseas reservar?
          </h2>
          <p className="text-text-secondary">
            Selecciona el servicio que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={localSelected?.id === service.id}
              onSelect={handleSelectService}
            />
          ))}
        </div>

        <div className="sticky bottom-6">
          <Button
            onClick={handleContinue}
            disabled={!localSelected}
            className="w-full shadow-lg"
            size="lg"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};