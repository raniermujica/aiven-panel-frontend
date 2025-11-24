import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-20 h-20 mx-auto text-destructive mb-6" />
        <h1 className="text-3xl font-bold mb-4">Negocio no encontrado</h1>
        <p className="text-muted-foreground mb-8">
          El enlace que intentas acceder no existe o ha sido deshabilitado.
        </p>
        {/* <Button onClick={() => window.location.href = 'https://agentpaul.es'}>
          Ir a AgentPaul
        </Button> */}
      </div>
    </div>
  );
};