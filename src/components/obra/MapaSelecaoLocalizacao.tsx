import { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

interface MapaSelecaoLocalizacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export function MapaSelecaoLocalizacao({
  open,
  onOpenChange,
  initialLat = -15.7801,
  initialLng = -47.9292,
  onLocationSelect,
}: MapaSelecaoLocalizacaoProps) {
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [searchAddress, setSearchAddress] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedPosition({ lat, lng });
    }
  }, []);

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedPosition({ lat, lng });
    }
  }, []);

  const handleSearchAddress = async () => {
    if (!searchAddress.trim()) {
      toast.error("Digite um endereço para buscar");
      return;
    }

    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchAddress }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          setSelectedPosition({ lat, lng });
          map?.panTo({ lat, lng });
          map?.setZoom(15);
          toast.success("Localização encontrada!");
        } else {
          toast.error("Não foi possível encontrar o endereço");
        }
      });
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      toast.error("Erro ao buscar endereço");
    }
  };

  const handleConfirm = () => {
    onLocationSelect(selectedPosition.lat, selectedPosition.lng);
    onOpenChange(false);
    toast.success("Localização selecionada com sucesso!");
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erro de Configuração</DialogTitle>
            <DialogDescription>
              Google Maps API Key não configurada. Configure VITE_GOOGLE_MAPS_API_KEY no arquivo .env
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Localização no Mapa</DialogTitle>
          <DialogDescription>
            Clique no mapa ou arraste o marcador para definir a localização exata da obra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search-address">Buscar endereço</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="search-address"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="Digite um endereço para buscar"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchAddress()}
                />
                <Button onClick={handleSearchAddress} variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Latitude</Label>
              <Input value={selectedPosition.lat.toFixed(8)} readOnly />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input value={selectedPosition.lng.toFixed(8)} readOnly />
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedPosition}
                zoom={13}
                onLoad={onLoad}
                onClick={handleMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: true,
                }}
              >
                <Marker
                  position={selectedPosition}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                />
              </GoogleMap>
            </LoadScript>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              <MapPin className="mr-2 h-4 w-4" />
              Confirmar Localização
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
