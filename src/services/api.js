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
  async checkAvailability(businessSlug, date, serviceId, durationMinutes, partySize = null) {
    try {
      const payload = {
        date,
        serviceId,
        durationMinutes
      };

      // ✅ Solo incluir partySize si existe (restaurantes)
      if (partySize !== null && partySize !== undefined) {
        payload.partySize = partySize;
      }

      console.log('📤 checkAvailability payload:', payload);

      const response = await this.client.post(
        `/api/public/${businessSlug}/check-availability`,
        payload
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
      console.log('📤 Datos recibidos en API:', appointmentData);

      const payload = {
        clientName: appointmentData.clientName,        
        clientPhone: appointmentData.clientPhone,      
        clientEmail: appointmentData.clientEmail,      
        serviceId: appointmentData.serviceId,
        serviceName: appointmentData.serviceName,  
        durationMinutes: appointmentData.durationMinutes, 
        scheduledDate: appointmentData.scheduledDate,  
        appointmentTime: appointmentData.appointmentTime, 
        services: appointmentData.services || [],      
        notes: appointmentData.notes || '',
        partySize: appointmentData.partySize || 1,
      };

      console.log('📤 Payload enviado:', payload);

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