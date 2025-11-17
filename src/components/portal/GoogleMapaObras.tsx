import { useCallback, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusColors, statusLabels } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

interface Obra {
  id: string;
  nome: string;
  status: string;
  latitude: number;
  longitude: number;
  valor_total: number;
  percentual_executado: number;
  endereco?: string;
  bairro?: string;
  cidade?: string;
}

interface GoogleMapaObrasProps {
  obras: Obra[];
}

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: -23.5505,
  lng: -46.6333,
};

// Helper function to create marker icon URL
const getMarkerIcon = (status: string) => {
  const color = statusColors[status as keyof typeof statusColors]?.includes('green') 
    ? '22c55e' 
    : statusColors[status as keyof typeof statusColors]?.includes('yellow') 
    ? 'eab308' 
    : statusColors[status as keyof typeof statusColors]?.includes('blue') 
    ? '3b82f6' 
    : '6b7280';
  
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#${color}" stroke="white" stroke-width="2"/>
    </svg>`
  )}`;
};

export function GoogleMapaObras({ obras }: GoogleMapaObrasProps) {
  const navigate = useNavigate();
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Calcular centro do mapa baseado nas obras
  const center = obras.length > 0 
    ? {
        lat: obras.reduce((sum, o) => sum + o.latitude, 0) / obras.length,
        lng: obras.reduce((sum, o) => sum + o.longitude, 0) / obras.length,
      }
    : defaultCenter;

  const onLoad = useCallback((map: google.maps.Map) => {
    if (obras.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      obras.forEach(obra => {
        bounds.extend({ lat: obra.latitude, lng: obra.longitude });
      });
      map.fitBounds(bounds);
    }
  }, [obras]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Google Maps API key não configurada. Configure a chave VITE_GOOGLE_MAPS_API_KEY para visualizar o mapa.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (obras.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma obra com localização disponível para os filtros selecionados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Obras ({obras.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            onLoad={onLoad}
            options={{
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
          >
            {obras.map((obra) => (
              <Marker
                key={obra.id}
                position={{ lat: obra.latitude, lng: obra.longitude }}
                onClick={() => setSelectedObra(obra)}
                icon={getMarkerIcon(obra.status)}
              />
            ))}

            {selectedObra && (
              <InfoWindow
                position={{ lat: selectedObra.latitude, lng: selectedObra.longitude }}
                onCloseClick={() => setSelectedObra(null)}
              >
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-semibold text-sm mb-2">{selectedObra.nome}</h3>
                  <div className="space-y-1 mb-3">
                    <Badge 
                      variant="secondary"
                      className="text-xs"
                    >
                      {statusLabels[selectedObra.status as keyof typeof statusLabels]}
                    </Badge>
                    {selectedObra.endereco && (
                      <p className="text-xs text-muted-foreground">
                        📍 {selectedObra.endereco}
                      </p>
                    )}
                    {selectedObra.bairro && (
                      <p className="text-xs text-muted-foreground">
                        🏘️ {selectedObra.bairro} {selectedObra.cidade && `- ${selectedObra.cidade}`}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Progresso: {selectedObra.percentual_executado}%
                    </p>
                    <p className="text-xs font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(selectedObra.valor_total)}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => navigate(`/obra/${selectedObra.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </CardContent>
    </Card>
  );
}
