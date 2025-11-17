import { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { statusColors, statusLabels } from "@/lib/constants";

interface MapaObraIndividualProps {
  obra: {
    id: string;
    nome: string;
    status: string;
    latitude: number;
    longitude: number;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  };
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const getMarkerColor = (status: string) => {
  switch (status) {
    case "concluida":
      return "#22c55e";
    case "andamento":
      return "#eab308";
    case "planejada":
      return "#3b82f6";
    case "paralisada":
      return "#6b7280";
    default:
      return "#3b82f6";
  }
};

export function MapaObraIndividual({ obra }: MapaObraIndividualProps) {
  const [showInfoWindow, setShowInfoWindow] = useState(true);

  const center = {
    lat: obra.latitude,
    lng: obra.longitude,
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const enderecoCompleto = [
    obra.endereco,
    obra.bairro,
    obra.cidade,
    obra.uf,
  ]
    .filter(Boolean)
    .join(", ");

  const abrirNoGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps?q=${obra.latitude},${obra.longitude}`,
      "_blank"
    );
  };

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização da Obra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">
            Google Maps API key não configurada.
          </p>
          {enderecoCompleto && (
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Endereço:</strong> {enderecoCompleto}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Coordenadas:</strong> {obra.latitude}, {obra.longitude}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={abrirNoGoogleMaps}
                className="mt-2"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir no Google Maps
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização da Obra
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={abrirNoGoogleMaps}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir no Google Maps
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={16}
            options={{
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
              zoomControl: true,
            }}
          >
            <Marker
              position={center}
              onClick={() => setShowInfoWindow(!showInfoWindow)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: getMarkerColor(obra.status),
                fillOpacity: 0.9,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />

            {showInfoWindow && (
              <InfoWindow
                position={center}
                onCloseClick={() => setShowInfoWindow(false)}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-2">{obra.nome}</h3>
                  <Badge
                    className={`${statusColors[obra.status as keyof typeof statusColors]} mb-2`}
                  >
                    {statusLabels[obra.status as keyof typeof statusLabels]}
                  </Badge>
                  {enderecoCompleto && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {enderecoCompleto}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {obra.latitude.toFixed(6)}, {obra.longitude.toFixed(6)}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </CardContent>
      {enderecoCompleto && (
        <CardContent className="pt-4">
          <div className="space-y-1">
            <p className="text-sm">
              <strong>Endereço:</strong> {enderecoCompleto}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Coordenadas GPS:</strong> {obra.latitude}, {obra.longitude}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
