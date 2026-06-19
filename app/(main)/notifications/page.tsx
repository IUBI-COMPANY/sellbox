import { BellOff } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 animate-fade-in">
      <div className="flex flex-col items-center gap-6 text-center max-w-sm">
        <div className="w-20 h-20 rounded-3xl bg-card border border-border flex items-center justify-center">
          <BellOff className="w-8 h-8 text-muted" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            No tienes notificaciones nuevas
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Cuando recibas likes, comentarios o nuevos seguidores, aparecerán
            aquí.
          </p>
        </div>
      </div>
    </div>
  );
}
