import { useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { statusLabels } from "@/lib/mockData";
import { useObrasComLocalizacao } from "@/hooks/useObras";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: -27.5954,
  lng: -48.548,
};

const Mapa = () => {
  const { data: obras, isLoading, error } = useObrasComLocalizacao();
  const [selectedObra, setSelectedObra] = useState<any>(null);
  const [mapCenter] = useState(defaultCenter);
  const navigate = useNavigate();

  const contadores = {
    planejada: obras?.filter(o => o.status === 'planejada').length || 0,
    andamento: obras?.filter(o => o.status === 'andamento').length || 0,
    concluida: obras?.filter(o => o.status === 'concluida').length || 0,
    paralisada: obras?.filter(o => o.status === 'paralisada').length || 0,
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    if (obras && obras.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      obras.forEach((obra) => {
        if (obra.latitude && obra.longitude) {
          bounds.extend({
            lat: obra.latitude,
            lng: obra.longitude,
          });
        }
      });
      map.fitBounds(bounds);
    }
  }, [obras]);

  const getMarkerIcon = (status: string) => {
    let color = "#3b82f6"; // andamento - blue
    if (status === "concluida") color = "#22c55e"; // green
    if (status === "paralisada") color = "#ef4444"; // red
    if (status === "planejada") color = "#6b7280"; // gray

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 3,
      scale: 10,
    };
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            API Key do Google Maps não configurada. Configure VITE_GOOGLE_MAPS_API_KEY no arquivo .env
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Erro: {(error as Error).message}</AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

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

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <Skeleton className="h-[600px] w-full" />
            ) : obras && obras.length > 0 ? (
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={12}
                  onLoad={onLoad}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                  }}
                >
                  {obras.map((obra) => {
                    if (!obra.latitude || !obra.longitude) return null;
                    return (
                      <Marker
                        key={obra.id}
                        position={{
                          lat: obra.latitude,
                          lng: obra.longitude,
                        }}
                        icon={getMarkerIcon(obra.status)}
                        onClick={() => setSelectedObra(obra)}
                      />
                    );
                  })}

                  {selectedObra && (
                    <InfoWindow
                      position={{
                        lat: selectedObra.latitude,
                        lng: selectedObra.longitude,
                      }}
                      onCloseClick={() => setSelectedObra(null)}
                    >
                      <div className="p-2 min-w-[250px]">
                        <h3 className="font-bold text-lg mb-2">{selectedObra.nome}</h3>
                        {selectedObra.descricao && (
                          <p className="text-sm text-gray-600 mb-2">{selectedObra.descricao}</p>
                        )}
                        <div className="space-y-1 mb-3">
                          <p className="text-sm">
                            <strong>Status:</strong>{" "}
                            {statusLabels[selectedObra.status as keyof typeof statusLabels]}
                          </p>
                          <p className="text-sm">
                            <strong>Progresso:</strong> {selectedObra.percentual_executado}%
                          </p>
                          <p className="text-sm">
                            <strong>Valor:</strong>{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(selectedObra.valor_total || 0)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/obras/${selectedObra.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                Nenhuma obra com localização disponível
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#6b7280] border-2 border-white shadow"></div>
                <span className="text-sm">Planejada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white shadow"></div>
                <span className="text-sm">Em Andamento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white shadow"></div>
                <span className="text-sm">Concluída</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ef4444] border-2 border-white shadow"></div>
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
