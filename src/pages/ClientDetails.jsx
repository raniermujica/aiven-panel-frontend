import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBookingStore } from '@/store/bookingStore';
import { User, Mail, Phone } from 'lucide-react';

export function ClientDetails() {
  const navigate = useNavigate();
  const { 
    selectedService,
    selectedDate,
    selectedTime,
    clientName,
    clientPhone,
    clientEmail,
    setClientDetails 
  } = useBookingStore();

  const [formData, setFormData] = useState({
    name: clientName || '',
    phone: clientPhone || '',
    email: clientEmail || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Redirigir si no hay datos previos
  useEffect(() => {
    if (!selectedService || !selectedDate || !selectedTime) {
      navigate('/services');
    }
  }, [selectedService, selectedDate, selectedTime, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'El teléfono es requerido';
        const phoneRegex = /^[+]?[\d\s()-]{9,}$/;
        if (!phoneRegex.test(value)) return 'Formato de teléfono inválido';
        return '';
      
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Formato de email inválido';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar solo si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {
      name: validateField('name', formData.name),
      phone: validateField('phone', formData.phone),
      email: validateField('email', formData.email),
    };
    
    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true });
    
    // Si hay errores, no continuar
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // Guardar datos y continuar
    setClientDetails(formData.name, formData.phone, formData.email);
    navigate('/confirmation');
  };

  const isFormValid = 
    formData.name.trim() && 
    formData.phone.trim() && 
    formData.email.trim() &&
    !Object.values(errors).some(error => error);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Intro section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light rounded-full mb-4">
            <User className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            Tus datos de contacto
          </h2>
          <p className="text-text-secondary">
            Necesitamos esta información para confirmar tu cita
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-surface rounded-card border border-border p-6 space-y-5">
            {/* Name field */}
            <div>
              <Input
                type="text"
                name="name"
                label="Nombre completo"
                placeholder="Ej: María García López"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name}
                required
              />
            </div>

            {/* Phone field */}
            <div>
              <Input
                type="tel"
                name="phone"
                label="Teléfono"
                placeholder="Ej: +34 612 345 678"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone}
                required
              />
              <p className="mt-1.5 text-xs text-text-secondary">
                Usaremos este número para enviarte recordatorios de tu cita
              </p>
            </div>

            {/* Email field */}
            <div>
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="Ej: maria@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                required
              />
              <p className="mt-1.5 text-xs text-text-secondary">
                Te enviaremos la confirmación a este correo
              </p>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-accent-light/30 border border-accent/20 rounded-card p-4">
            <p className="text-sm text-text-secondary">
              💡 <span className="font-medium text-text-primary">Tu información está segura.</span> Solo la usaremos para gestionar tu cita y enviarte recordatorios.
            </p>
          </div>

          {/* Submit button */}
          <div className="sticky bottom-6">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full shadow-lg"
              size="lg"
            >
              Continuar a confirmación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};