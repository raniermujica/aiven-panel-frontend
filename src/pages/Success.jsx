import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, Mail, Phone, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentData = location.state?.appointmentData;

  // Redirigir si no hay datos de la cita
  useEffect(() => {
    if (!appointmentData) {
      navigate(`/${businessSlug}/services`);
    }
  }, [appointmentData, businessSlug, navigate]);

  if (!appointmentData) {
    return null;
  }

  // Parsear fecha correctamente
  const appointmentDate = new Date(appointmentData.date || appointmentData.appointment_time);
  const appointmentTime = appointmentData.time || format(appointmentDate, 'HH:mm');

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            ¡Reserva confirmada!
          </h1>
          
          <p className="text-lg text-text-secondary">
            Tu cita ha sido agendada exitosamente
          </p>
        </div>

        {/* Appointment details card */}
        <div className="bg-surface border border-border rounded-card shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Detalles de tu cita
          </h2>

          <div className="space-y-4">
            {/* Servicio */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent-light rounded-button flex items-center justify-center flex-shrink-0">
                <span className="text-xl">✂️</span>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Servicio</p>
                <p className="font-medium text-text-primary">
                  {appointmentData.service_name || 'Servicio reservado'}
                </p>
              </div>
            </div>

            {/* Fecha */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent-light rounded-button flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Fecha</p>
                <p className="font-medium text-text-primary">
                  {format(appointmentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
              </div>
            </div>

            {/* Hora */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent-light rounded-button flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Hora</p>
                <p className="font-medium text-text-primary">{appointmentTime}</p>
              </div>
            </div>

            {/* Duración */}
            {appointmentData.duration_minutes && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent-light rounded-button flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Duración</p>
                  <p className="font-medium text-text-primary">
                    {appointmentData.duration_minutes} minutos
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact info card */}
        <div className="bg-accent-light/30 border border-accent/20 rounded-card p-6 mb-8">
          <h3 className="font-semibold text-text-primary mb-3">
            📧 Confirmación enviada
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Hemos enviado un correo de confirmación a:
          </p>
          
          <div className="space-y-2">
            {appointmentData.customer_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-text-primary font-medium">
                  {appointmentData.customer_email}
                </span>
              </div>
            )}
            
            {appointmentData.customer_phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-text-primary font-medium">
                  {appointmentData.customer_phone}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-card p-4 mb-8">
          <p className="text-sm text-blue-800">
            💡 <strong>Importante:</strong> Si necesitas cancelar o modificar tu cita, 
            por favor contáctanos con al menos 24 horas de anticipación.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/services')}
            className="w-full"
            size="lg"
          >
            Reservar otra cita
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Volver al inicio
          </Button>
        </div>

        {/* Referencia de la cita */}
        {appointmentData.id && (
          <div className="mt-8 text-center">
            <p className="text-xs text-text-secondary">
              Número de referencia: <span className="font-mono font-medium">#{appointmentData.id.split('-')[0]}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};