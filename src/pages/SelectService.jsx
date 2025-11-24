import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { api } from '@/services/api';
import { Sparkles, AlertCircle, Calendar } from 'lucide-react';

export function SelectService() {
  const navigate = useNavigate();
  const { selectedService, setService, businessSlug } = useBookingStore();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSelected, setLocalSelected] = useState(selectedService);

  useEffect(() => {
    if (businessSlug) { 
    loadServices();
    }
  }, [businessSlug]);

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
    console.log('🔍 handleContinue called');
    console.log('🔍 localSelected:', localSelected);
    if (localSelected) {
      setService(localSelected);
      console.log('🔍 Navigating to /add-ons');
      navigate(`/${businessSlug}/add-ons`);
    } else {
      console.log('❌ No service selected');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  // Error state
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

  // Empty state
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
        {/* Intro section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light rounded-full mb-4">
            <Calendar className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            ¿Qué servicio deseas reservar?
          </h2>
          <p className="text-text-secondary">
            Selecciona el servicio que mejor se adapte a tus necesidades
          </p>
        </div>

        {/* Services list */}
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

        {/* Continue button */}
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
    // </div>
  );
};