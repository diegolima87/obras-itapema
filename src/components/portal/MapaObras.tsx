import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusColors, statusLabels } from "@/lib/mockData";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapaObrasProps {
  obras: Array<{
    id: string;
    nome: string;
    status: string;
    latitude?: number;
    longitude?: number;
    valor_total: number;
    percentual_executado: number;
  }>;
}

export function MapaObras({ obras }: MapaObrasProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  // Filter obras with valid location
  const obrasComLocalizacao = obras.filter(
    (o) => o && typeof o.latitude === 'number' && typeof o.longitude === 'number'
  );

  useEffect(() => {
    if (!mapContainer.current || obrasComLocalizacao.length === 0) return;

    // Calculate center
    const lat = obrasComLocalizacao.reduce((sum, o) => sum + (o.latitude || 0), 0) / obrasComLocalizacao.length;
    const lng = obrasComLocalizacao.reduce((sum, o) => sum + (o.longitude || 0), 0) / obrasComLocalizacao.length;

    if (!isFinite(lat) || !isFinite(lng)) return;

    // Initialize map only once
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current).setView([lat, lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    // Add markers
    obrasComLocalizacao.forEach((obra) => {
      if (!mapInstance.current) return;

      const marker = L.marker([obra.latitude!, obra.longitude!]).addTo(mapInstance.current);

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem;">${obra.nome}</h3>
          <div style="margin-bottom: 0.5rem;">
            <span style="display: inline-block; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; background: ${statusColors[obra.status as keyof typeof statusColors]?.includes('green') ? '#22c55e' : statusColors[obra.status as keyof typeof statusColors]?.includes('yellow') ? '#eab308' : statusColors[obra.status as keyof typeof statusColors]?.includes('blue') ? '#3b82f6' : '#6b7280'}; color: white;">
              ${statusLabels[obra.status as keyof typeof statusLabels]}
            </span>
          </div>
          <p style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">
            Progresso: ${obra.percentual_executado}%
          </p>
          <p style="font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem;">
            ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(obra.valor_total)}
          </p>
          <a href="/obra/${obra.id}" style="display: inline-block; padding: 0.375rem 0.75rem; background: #0ea5e9; color: white; border-radius: 0.375rem; text-decoration: none; font-size: 0.875rem; width: 100%; text-align: center; margin-top: 0.5rem;">
            Ver Detalhes
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [obrasComLocalizacao]);

  if (obrasComLocalizacao.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Localização das Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma obra com localização disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localização das Obras</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="h-[500px] w-full rounded-b-lg" />
      </CardContent>
    </Card>
  );
}
