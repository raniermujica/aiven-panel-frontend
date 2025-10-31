import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './src/components/booking/Header';
import { SelectService } from './src/pages/SelectService';
import { SelectDateTime } from './src/pages/SelectDateTime';
import { AddOns } from './src/pages/AddOns';
import { ClientDetails } from './src/pages/ClientDetails';
import { Confirmation } from './src/pages/Confirmation';
// import { Success } from './pages/Success';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />

        <Routes>
          <Route path="/" element={<Navigate to="/services" replace />} />
          <Route path="/services" element={<SelectService />} />
          <Route path="/date-time" element={<SelectDateTime />} />
          <Route path="/add-ons" element={<AddOns />} />
          <Route path="/client-details" element={<ClientDetails />} />
          <Route path="/confirmation" element={<Confirmation />} />
          {/* <Route path="/success" element={<Success />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
