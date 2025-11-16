import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Obtener servicios del negocio 
  async getServices(businessSlug) {
    try {
      const response = await this.client.get(`/api/public/${businessSlug}/services`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo servicios:', error);
      throw error;
    }
  }

  // Obtener información del negocio
async getBusinessInfo(businessSlug) {
  try {
    const response = await this.client.get(`/api/public/${businessSlug}/info`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo info del negocio:', error);
    throw error;
  }
}

  // Verificar disponibilidad de horarios 
  async checkAvailability(businessSlug, date, serviceId, durationMinutes) {
    try {
      const response = await this.client.post(
        `/api/public/${businessSlug}/check-availability`,
        {
          date,
          serviceId,
          durationMinutes,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      throw error;
    }
  }

  // Crear cita 
  async createAppointment(businessSlug, appointmentData) {
 try {
    // Preparar el payload con el formato correcto
    const payload = {
      clientName: appointmentData.customerName,
      clientPhone: appointmentData.customerPhone,
      clientEmail: appointmentData.customerEmail,
      serviceId: appointmentData.serviceId,
      serviceName: appointmentData.serviceName,  
      durationMinutes: appointmentData.durationMinutes, 
      scheduledDate: `${appointmentData.date}T${appointmentData.time}:00`,
      appointmentTime: `${appointmentData.date}T${appointmentData.time}:00`,
      services: appointmentData.additionalServices || [], 
      notes: appointmentData.notes || '',
    };

    const response = await this.client.post(
      `/api/public/${businessSlug}/appointments`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error creando cita:', error);
    throw error;
  }
  }
}

export const api = new APIService();