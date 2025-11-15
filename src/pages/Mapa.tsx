import { useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { statusLabels } from "@/lib/mockData";
import { useObrasComLocalizacao } from "@/hooks/useObras";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Mapa = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const { data: obras, isLoading, error } = useObrasComLocalizacao();

  const contadores = {
    planejada: obras?.filter(o => o.status === 'planejada').length || 0,
    andamento: obras?.filter(o => o.status === 'andamento').length || 0,
    concluida: obras?.filter(o => o.status === 'concluida').length || 0,
    paralisada: obras?.filter(o => o.status === 'paralisada').length || 0,
  };

  useEffect(() => {
    if (!mapContainer.current || map.current || !obras || obras.length === 0) return;
    map.current = L.map(mapContainer.current).setView([-27.5954, -48.548], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.current);

    obras.forEach((obra) => {
      if (!map.current || !obra.latitude || !obra.longitude) return;
      let markerColor = "#3b82f6";
      if (obra.status === "concluida") markerColor = "#22c55e";
      if (obra.status === "paralisada") markerColor = "#ef4444";
      if (obra.status === "planejada") markerColor = "#6b7280";

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([obra.latitude, obra.longitude], { icon: customIcon }).addTo(map.current);
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">${obra.nome}</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${obra.descricao || ''}</p>
          <p style="font-size: 12px;"><strong>Status:</strong> ${statusLabels[obra.status as keyof typeof statusLabels]}</p>
          <p style="font-size: 12px;"><strong>Progresso:</strong> ${obra.percentual_executado}%</p>
          <p style="font-size: 12px;"><strong>Valor:</strong> ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(obra.valor_total)}</p>
          <a href="/obras/${obra.id}" style="color: #3b82f6; font-size: 12px;">Ver detalhes</a>
        </div>
      `);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [obras]);

  if (error) return <MainLayout><Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>Erro: {(error as Error).message}</AlertDescription></Alert></MainLayout>;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mapa de Obras</h1>
          <p className="text-muted-foreground mt-1">Visualização geográfica das obras públicas</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <Card key={i}><CardHeader className="pb-3"><Skeleton className="h-4 w-20" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Planejadas</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-muted" /><span className="text-2xl font-bold">{contadores.planejada}</span></div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Em Andamento</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-500" /><span className="text-2xl font-bold">{contadores.andamento}</span></div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Concluídas</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-green-500" /><span className="text-2xl font-bold">{contadores.concluida}</span></div></CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Paralisadas</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-red-500" /><span className="text-2xl font-bold">{contadores.paralisada}</span></div></CardContent></Card>
          </div>
        )}

        <Card><CardContent className="p-0">{isLoading ? <Skeleton className="h-[600px] w-full rounded-b-lg" /> : obras && obras.length > 0 ? <div ref={mapContainer} className="h-[600px] w-full rounded-b-lg" /> : <div className="h-[600px] w-full rounded-b-lg flex items-center justify-center text-muted-foreground"><div className="text-center"><AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Nenhuma obra com localização disponível</p></div></div>}</CardContent></Card>

        {!isLoading && obras && obras.length > 0 && (
          <Card><CardHeader><CardTitle className="text-sm">Legenda</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-4 sm:grid-cols-4"><div className="flex items-center gap-2"><div className="h-4 w-4 rounded-full bg-muted border-2 border-white" /><span className="text-sm">Planejadas</span></div><div className="flex items-center gap-2"><div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white" /><span className="text-sm">Em Andamento</span></div><div className="flex items-center gap-2"><div className="h-4 w-4 rounded-full bg-green-500 border-2 border-white" /><span className="text-sm">Concluídas</span></div><div className="flex items-center gap-2"><div className="h-4 w-4 rounded-full bg-red-500 border-2 border-white" /><span className="text-sm">Paralisadas</span></div></div></CardContent></Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Mapa;
