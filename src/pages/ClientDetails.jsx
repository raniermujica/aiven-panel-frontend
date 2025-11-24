import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBookingStore } from '@/store/bookingStore';
import { api } from '@/services/api';
import { User, Mail, Phone, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ClientDetails() {
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
    setClientDetails,
    businessSlug,
    resetBooking
  } = useBookingStore();

  const [formData, setFormData] = useState({
    name: clientName || '',
    phone: clientPhone || '',
    email: clientEmail || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Redirigir si no hay datos previos
  useEffect(() => {
    if (!selectedService || !selectedDate || !selectedTime) {
      navigate(`/${businessSlug}/services`);
    }
  }, [selectedService, selectedDate, businessSlug, selectedTime, navigate]);

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

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      phone: validateField('phone', formData.phone),
      email: validateField('email', formData.email),
    };

    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true });

    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      // Guardar datos del cliente en el store
      setClientDetails(formData.name, formData.phone, formData.email);

      // ✅ CORRECCIÓN: Crear array con TODOS los servicios (principal + adicionales)
      const allServices = [
        {
          id: selectedService.id,
          name: selectedService.name,
          duration_minutes: selectedService.duration_minutes,
          price: selectedService.price || 0
        },
        ...additionalServices.map(s => ({
          id: s.id,
          name: s.name,
          duration_minutes: s.duration_minutes,
          price: s.price || 0
        }))
      ];

      // ✅ Calcular duración total
      const totalDuration = allServices.reduce((sum, s) => sum + s.duration_minutes, 0);

      // Preparar datos de la cita
      const appointmentData = {
        clientName: formData.name,
        clientPhone: formData.phone,
        clientEmail: formData.email,
        serviceId: selectedService.id,
        serviceName: selectedService.name,           
        durationMinutes: totalDuration, // ✅ Duración total
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'), // ✅ Cambiar key
        appointmentTime: selectedTime, // ✅ Cambiar key
        services: allServices, // ✅ Array completo de servicios
        notes: notes || ''
      };

      console.log('📤 Enviando cita:', appointmentData);

      // ✅ Crear la cita ANTES de navegar
      const response = await api.createAppointment(businessSlug, appointmentData);

      console.log('✅ Cita creada:', response);

      // ✅ AHORA SÍ navegar a success
      navigate(`/${businessSlug}/success`, {
        state: {
          appointmentId: response.appointment?.id,
          appointmentData: response.appointment
        }
      });

      // Limpiar el store después de un tiempo
      setTimeout(() => {
        resetBooking();
      }, 1000);

    } catch (error) {
      console.error('❌ Error creando cita:', error);
      setSubmitError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al crear la cita. Por favor, intenta de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    !errors.name &&
    !errors.phone &&
    !errors.email;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">

        {/* Botón Atrás */}
        <button
          type="button"
          onClick={() => navigate(`/${businessSlug}/date-time`)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Volver a horarios</span>
        </button>

        {/* Intro section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-light rounded-full mb-4">
            <User className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-2">
            Tus datos de contacto
          </h2>
          <p className="text-text-secondary">
            Necesitamos tu información para confirmar la cita
          </p>
        </div>

        {/* Resumen de la reserva */}
        <div className="mb-8 p-4 bg-accent-light/50 border border-accent/20 rounded-card">
          <p className="text-sm font-medium text-text-primary mb-2">Resumen de tu reserva:</p>
          <div className="space-y-1 text-sm text-text-secondary">
            <p>📅 {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}</p>
            <p>🕐 {selectedTime}</p>
            <p>✂️ {selectedService?.name}</p>
            {additionalServices.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Servicios adicionales:</p>
                {additionalServices.map(s => (
                  <p key={s.id}>+ {s.name}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error de envío */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-card">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Nombre completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tu nombre"
                className={`pl-10 ${errors.name && touched.name ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Teléfono *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="+34 600 000 000"
                className={`pl-10 ${errors.phone && touched.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="tu@email.com"
                className={`pl-10 ${errors.email && touched.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="sticky bottom-6 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || submitting}
              className="w-full shadow-lg"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creando reserva...
                </>
              ) : (
                'Confirmar reserva'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};