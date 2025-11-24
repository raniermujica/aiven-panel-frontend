import { useBookingStore } from '@/store/bookingStore';
import { Sparkles } from 'lucide-react';

export function Header() {
  const { businessData } = useBookingStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
        {/* Logo y nombre centrados */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center">
            {/* <Sparkles className="w-6 h-6 text-accent" /> */}
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary">
            {businessData?.name || 'Cargando...'}
          </h1>
        </div>
      </div>
    </header>
  );
};