import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  // Business data
  businessSlug: import.meta.env.VITE_BUSINESS_SLUG,
  businessData: null, 
  setBusinessSlug: (slug) => set({ businessSlug: slug }),
  setBusinessData: (data) => set({ businessData: data }), 

  // Selected items
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  additionalServices: [],
  notes: '',

  // Client details
  clientName: '',
  clientPhone: '',
  clientEmail: '',

  // Actions
  setService: (service) => set({ selectedService: service }),
  
  setDateTime: (date, time) => set({ 
    selectedDate: date, 
    selectedTime: time 
  }),

  addAdditionalService: (service) =>
    set((state) => ({
      additionalServices: [...state.additionalServices, service],
    })),

  removeAdditionalService: (serviceId) =>
    set((state) => ({
      additionalServices: state.additionalServices.filter(
        (s) => s.id !== serviceId
      ),
    })),

  setNotes: (notes) => set({ notes }),

  setClientDetails: (name, phone, email) =>
    set({
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
    }),

  proceedToClientDetails: () => {}, 
  resetBooking: () =>
    set({
      selectedService: null,
      selectedDate: null,
      selectedTime: null,
      additionalServices: [],
      notes: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
    }),
}));