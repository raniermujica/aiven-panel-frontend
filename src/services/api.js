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
      const response = await this.client.get('/api/services', {
        headers: {
          'x-business-slug': businessSlug,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo servicios:', error);
      throw error;
    }
  }

  // Verificar disponibilidad de horarios
  async checkAvailability(businessSlug, date, serviceId, durationMinutes) {
    try {
      const response = await this.client.post(
        '/api/appointments/check-availability',
        {
          date,
          serviceId,
          durationMinutes,
        },
        {
          headers: {
            'x-business-slug': businessSlug,
          },
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
      const response = await this.client.post(
        '/api/appointments',
        appointmentData,
        {
          headers: {
            'x-business-slug': businessSlug,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creando cita:', error);
      throw error;
    }
  }
}

export const api = new APIService();