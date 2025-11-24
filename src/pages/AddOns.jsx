import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '../components/ui/TextArea';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { AdditionalServiceCard } from '@/components/booking/AdditionalServiceCard';
import { useBookingStore } from '@/store/bookingStore';
import { api } from '@/services/api';
import { FileText, AlertCircle, ArrowLeft } from 'lucide-react';

export function AddOns() {
  const navigate = useNavigate();
  const { 
    selectedService, 
    additionalServices,
    notes,
    addAdditionalService,
    removeAdditionalService,
    setNotes,
    businessSlug,
    isRestaurant
  } = useBookingStore();

  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedService) {
      navigate(`/${businessSlug}/services`);
    }
    
    if (isRestaurant) {
      navigate(`/${businessSlug}/date-time`);
    }
  }, [selectedService, businessSlug, isRestaurant, navigate]);

  useEffect(() => {
    if (showServiceSelector && services.length === 0) {
      loadServices();
    }
  }, [showServiceSelector]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getServices(businessSlug);
      setServices(data.services || []);
    } catch (err) {
      console.error('Error cargando servicios:', err);
      setError('No se pudieron cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  const availableServices = services.filter(
    service => 
      service.id !== selectedService?.id && 
      !additionalServices.some(s => s.id === service.id)
  );

  const handleAddService = (service) => {
    addAdditionalService(service);
    setShowServiceSelector(false);
  };

  const handleRemoveService = (serviceId) => {
    removeAdditionalService(serviceId);
  };

  const handleContinue = () => {
    setNotes(localNotes);
    navigate(`/${businessSlug}/date-time`);
  };

  const handleSkip = () => {
    setNotes('');
    navigate(`/${businessSlug}/date-time`);
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <button
          type="button"
          onClick={() => navigate(`/${businessSlug}/services`)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a servicios</span>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            ¿Deseas agregar algo más?
          </h2>
          <p className="text-text-secondary">
            Puedes añadir servicios adicionales o dejar notas para el profesional
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Servicios Adicionales
          </h3>

          {additionalServices.length > 0 && (
            <div className="space-y-3 mb-4">
              {additionalServices.map((service) => (
                <AdditionalServiceCard
                  key={service.id}
                  service={service}
                  onRemove={() => handleRemoveService(service.id)}
                />
              ))}
            </div>
          )}

          {!showServiceSelector ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowServiceSelector(true)}
              className="w-full"
              size="lg"
            >
              Agregar otro servicio
            </Button>
          ) : (
            <div className="space-y-4 page-transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-text-primary">
                  Selecciona un servicio adicional
                </h4>
                <button
                  type="button"
                  onClick={() => setShowServiceSelector(false)}
                  className="text-sm text-text-secondary hover:text-text-primary"
                >
                  Cancelar
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-text-secondary">Cargando servicios...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              ) : availableServices.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={false}
                      onSelect={() => handleAddService(service)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">
                    No hay más servicios disponibles para agregar
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-text-primary">
              Notas adicionales
            </h3>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            ¿Tienes alguna preferencia o solicitud especial?
          </p>
          <Textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Ejemplo: Prefiero un profesional con experiencia en..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={handleContinue}
            className="w-full shadow-lg"
            size="lg"
          >
            Continuar
          </Button>

          <Button
            type="button"
            onClick={handleSkip}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Saltar este paso
          </Button>
        </div>
      </div>
    </div>
  );
};