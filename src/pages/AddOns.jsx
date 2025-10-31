import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { AdditionalServiceCard } from '@/components/booking/AdditionalServiceCard';
import { useBookingStore } from '@/store/bookingStore';
import { Plus, FileText } from 'lucide-react';

// Mock de servicios - reutilizamos los mismos del Paso 1
const MOCK_SERVICES = [
  {
    id: '1',
    name: 'Corte de Cabello',
    description: 'Corte personalizado con lavado y secado incluido',
    duration_minutes: 45,
    price: 35,
    emoji: '✂️',
  },
  {
    id: '2',
    name: 'Tinte Completo',
    description: 'Coloración completa con productos de alta calidad',
    duration_minutes: 90,
    price: 65,
    emoji: '🎨',
  },
  {
    id: '3',
    name: 'Manicura y Pedicura',
    description: 'Cuidado completo de manos y pies',
    duration_minutes: 60,
    price: 45,
    emoji: '💅',
  },
  {
    id: '4',
    name: 'Tratamiento Facial',
    description: 'Limpieza profunda e hidratación facial',
    duration_minutes: 60,
    price: 55,
    emoji: '✨',
  },
  {
    id: '5',
    name: 'Masaje Relajante',
    description: 'Masaje terapéutico de cuerpo completo',
    duration_minutes: 60,
    price: 50,
    emoji: '💆',
  },
  {
    id: '6',
    name: 'Depilación Láser',
    description: 'Sesión de depilación láser en zona a elegir',
    duration_minutes: 30,
    price: 40,
    emoji: '⚡',
  },
];

export function AddOns() {
  const navigate = useNavigate();
  const { 
    selectedService, 
    selectedDate, 
    selectedTime,
    additionalServices,
    notes,
    addAdditionalService,
    removeAdditionalService,
    setNotes,
    proceedToClientDetails 
  } = useBookingStore();

  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);

  // Redirigir si no hay servicio o fecha/hora seleccionados
  useEffect(() => {
    if (!selectedService || !selectedDate || !selectedTime) {
      navigate('/services');
    }
  }, [selectedService, selectedDate, selectedTime, navigate]);

  // Filtrar servicios ya seleccionados
  const availableServices = MOCK_SERVICES.filter(
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
    proceedToClientDetails();
    navigate('/client-details');
  };

  const handleSkip = () => {
    setNotes('');
    proceedToClientDetails();
    navigate('/client-details');
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Intro section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light rounded-full mb-4">
            <Plus className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            ¿Deseas agregar algo más?
          </h2>
          <p className="text-text-secondary">
            Puedes añadir servicios adicionales o dejar notas para el profesional
          </p>
        </div>

        {/* Additional services section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Servicios Adicionales
          </h3>

          {/* Show added services */}
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

          {/* Add service button */}
          {!showServiceSelector ? (
            <Button
              variant="outline"
              onClick={() => setShowServiceSelector(true)}
              className="w-full"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar otro servicio
            </Button>
          ) : (
            <div className="space-y-4 page-transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-text-primary">
                  Selecciona un servicio adicional
                </h4>
                <button
                  onClick={() => setShowServiceSelector(false)}
                  className="text-sm text-text-secondary hover:text-text-primary"
                >
                  Cancelar
                </button>
              </div>

              {availableServices.length > 0 ? (
                <div className="space-y-3">
                  {availableServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={false}
                      onSelect={handleAddService}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-surface rounded-card border border-border">
                  <p className="text-text-secondary">
                    No hay más servicios disponibles para agregar
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-text-secondary" />
            <h3 className="text-lg font-semibold text-text-primary">
              Notas para el Profesional
            </h3>
            <span className="text-sm text-text-secondary">(Opcional)</span>
          </div>

          <Textarea
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Ejemplo: Prefiero que el masaje sea más suave en la zona lumbar, tengo sensibilidad ahí..."
            rows={4}
          />
          <p className="mt-2 text-xs text-text-secondary">
            Aquí puedes indicar preferencias, alergias, o cualquier información relevante
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 sticky bottom-6">
          <Button
            onClick={handleContinue}
            className="w-full shadow-lg"
            size="lg"
          >
            Continuar
          </Button>
          
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full"
          >
            Saltar este paso
          </Button>
        </div>
      </div>
    </div>
  );
};