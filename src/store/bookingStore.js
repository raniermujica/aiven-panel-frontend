import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  // Estado del flujo
  currentStep: 1,
  
  // Datos del booking
  business: null,
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  additionalServices: [],
  notes: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  acceptsPolicy: false,
  acceptsReminders: false,

  // Acciones
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setBusiness: (business) => set({ business }),
  
  setSelectedService: (service) => set({ 
    selectedService: service,
    currentStep: 2 
  }),
  
  setDateTime: (date, time) => set({ 
    selectedDate: date,
    selectedTime: time,
    currentStep: 3 
  }),
  
  addAdditionalService: (service) => set((state) => ({
    additionalServices: [...state.additionalServices, service]
  })),
  
  removeAdditionalService: (serviceId) => set((state) => ({
    additionalServices: state.additionalServices.filter(s => s.id !== serviceId)
  })),
  
  setNotes: (notes) => set({ notes }),
  
  proceedToClientDetails: () => set({ currentStep: 4 }),
  
  setClientDetails: (name, phone, email) => set({
    clientName: name,
    clientPhone: phone,
    clientEmail: email,
    currentStep: 5
  }),
  
  setAcceptsPolicy: (value) => set({ acceptsPolicy: value }),
  setAcceptsReminders: (value) => set({ acceptsReminders: value }),
  
  confirmBooking: () => set({ currentStep: 6 }),
  
  // Reset para nueva reserva
  resetBooking: () => set({
    currentStep: 1,
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    additionalServices: [],
    notes: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    acceptsPolicy: false,
    acceptsReminders: false,
  }),
  
  // Navegación
  goBack: () => set((state) => ({ 
    currentStep: Math.max(1, state.currentStep - 1) 
  })),
}));
