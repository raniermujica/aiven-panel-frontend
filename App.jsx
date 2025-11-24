import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/booking/Header';
import { SelectService } from '@/pages/SelectService';
import { SelectDateTime } from '@/pages/SelectDateTime';
import { AddOns } from '@/pages/AddOns';
import { ClientDetails } from '@/pages/ClientDetails';
import { Success } from '@/pages/Success';
import { NotFound } from '@/pages/NotFound';
import { useBookingStore } from '@/store/bookingStore';
import { api } from '@/services/api';

function BookingApp() {
  const { slug } = useParams();
  const { setBusinessSlug, setBusinessData } = useBookingStore();

  useEffect(() => {
    if (slug) {
      setBusinessSlug(slug);
      loadBusinessData(slug);
    }
  }, [slug]);

  const loadBusinessData = async (businessSlug) => {
  try {
    console.log('📥 Cargando info del negocio:', businessSlug);
    const response = await api.getBusinessInfo(businessSlug);
    console.log('✅ Respuesta de la API:', response);
    console.log('🏢 Business data:', response.business);
    console.log('🍽️ Business type:', response.business?.business_type);
    setBusinessData(response.business);
  } catch (error) {
    console.error('❌ Error cargando datos del negocio:', error);
  }
};

  // const loadBusinessData = async (businessSlug) => {
  //   try {
  //     const response = await api.getBusinessInfo(businessSlug);
  //     setBusinessData(response.business);
  //   } catch (error) {
  //     console.error('Error cargando datos del negocio:', error);
  //   }
  // };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<SelectService />} />
        <Route path="/services" element={<SelectService />} />
        <Route path="/add-ons" element={<AddOns />} />
        <Route path="/date-time" element={<SelectDateTime />} />
        <Route path="/client-details" element={<ClientDetails />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:slug/*" element={<BookingApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;