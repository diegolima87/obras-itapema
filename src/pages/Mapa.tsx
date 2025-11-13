import { useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockObras, statusColors, statusLabels } from "@/lib/mockData";

// Fix for default marker icon
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

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on Santa Catarina
    map.current = L.map(mapContainer.current).setView([-27.5954, -48.548], 12);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    // Add markers for each obra
    mockObras.forEach((obra) => {
      if (!map.current) return;

      // Define marker color based on status
      let markerColor = "#3b82f6"; // blue for default
      if (obra.status === "concluida") markerColor = "#22c55e"; // green
      if (obra.status === "andamento") markerColor = "#3b82f6"; // blue
      if (obra.status === "paralisada") markerColor = "#ef4444"; // red
      if (obra.status === "planejada") markerColor = "#6b7280"; // gray

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([obra.latitude, obra.longitude], {
        icon: customIcon,
      }).addTo(map.current);

      // Add popup
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">${obra.nome}</h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">${obra.descricao}</p>
          <p style="font-size: 12px; margin-bottom: 4px;"><strong>Status:</strong> ${statusLabels[obra.status as keyof typeof statusLabels]}</p>
          <p style="font-size: 12px; margin-bottom: 4px;"><strong>Progresso:</strong> ${obra.percentual_executado}%</p>
          <p style="font-size: 12px; margin-bottom: 8px;"><strong>Valor:</strong> ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(obra.valor_total)}</p>
          <a href="/obras" style="color: #3b82f6; font-size: 12px; text-decoration: underline;">Ver detalhes</a>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mapa de Obras</h1>
          <p className="text-muted-foreground mt-1">
            Visualização geográfica das obras públicas
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Planejadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted" />
                <span className="text-2xl font-bold">
                  {mockObras.filter((o) => o.status === "planejada").length}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-2xl font-bold">
                  {mockObras.filter((o) => o.status === "andamento").length}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-2xl font-bold">
                  {mockObras.filter((o) => o.status === "concluida").length}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Paralisadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-2xl font-bold">
                  {mockObras.filter((o) => o.status === "paralisada").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div ref={mapContainer} className="h-[500px] sm:h-[600px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-muted border-2 border-white shadow" />
                <span className="text-sm">Planejada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-primary border-2 border-white shadow" />
                <span className="text-sm">Em Andamento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-success border-2 border-white shadow" />
                <span className="text-sm">Concluída</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-destructive border-2 border-white shadow" />
                <span className="text-sm">Paralisada</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Mapa;
