import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/bookingStore';
import { Sparkles } from 'lucide-react';

// Mock de servicios - luego se obtendrán del backend
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

export function SelectService() {
  const navigate = useNavigate();
  const { selectedService, setSelectedService } = useBookingStore();
  const [localSelected, setLocalSelected] = useState(selectedService);

  const handleSelectService = (service) => {
    setLocalSelected(service);
  };

  const handleContinue = () => {
    if (localSelected) {
      setSelectedService(localSelected);
      navigate('/date-time');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Intro section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            ¿Qué servicio deseas reservar?
          </h2>
          <p className="text-text-secondary">
            Selecciona el servicio que mejor se adapte a tus necesidades
          </p>
        </div>

        {/* Services grid */}
        <div className="space-y-4 mb-8">
          {MOCK_SERVICES.map((service) => (
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
    </div>
  );
}
