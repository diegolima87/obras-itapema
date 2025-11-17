import { useEffect, useRef, useState } from "react";
import { MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MiniMapPreviewProps {
  latitude?: number;
  longitude?: number;
  source?: 'google' | 'nominatim' | 'cidade_aproximada' | 'manual' | 'desconhecida';
  endereco?: string;
}

export function MiniMapPreview({ 
  latitude, 
  longitude, 
  source = 'desconhecida',
  endereco 
}: MiniMapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setMapError(true);
      return;
    }

    // Carregar Google Maps Script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || !latitude || !longitude) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: source === 'cidade_aproximada' ? 12 : 16,
        disableDefaultUI: true,
        gestureHandling: 'none',
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
      });

      new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: source === 'cidade_aproximada' ? '#eab308' : '#22c55e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8,
        },
      });
    }
  }, [latitude, longitude, source]);

  if (!latitude || !longitude) {
    return (
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="h-4 w-4" />
          <span>Preencha o endereço para visualizar no mapa</span>
        </div>
      </Card>
    );
  }

  if (mapError) {
    return (
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Configure o Google Maps API para visualizar o mapa</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-[200px] bg-muted/30"
      />
      <div className="p-3 bg-background border-t">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              {endereco || `${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`}
            </span>
          </div>
          
          {source === 'cidade_aproximada' ? (
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 flex-shrink-0">
              <AlertCircle className="h-3 w-3 mr-1" />
              Aproximado
            </Badge>
          ) : source === 'google' || source === 'manual' ? (
            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 flex-shrink-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Preciso
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex-shrink-0">
              {source}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
