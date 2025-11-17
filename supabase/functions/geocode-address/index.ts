import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeocodingResult {
  latitude: number;
  longitude: number;
  source: 'google_maps' | 'nominatim' | 'cidade_aproximada' | 'manual';
  formatted_address?: string;
  query?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endereco, bairro, cidade, uf, cep } = await req.json();
    const apiKey = Deno.env.get('VITE_GOOGLE_MAPS_API_KEY');

    if (!apiKey) {
      console.error('Google Maps API key not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Constrói a query de endereço completo
    const addressParts = [endereco, bairro, cidade, uf, cep].filter(Boolean);
    const fullAddress = addressParts.join(', ');

    console.log('Geocoding address:', fullAddress);

    // Chama a API do Google Maps Geocoding
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('address', fullAddress);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('region', 'br');

    const response = await fetch(url.toString());
    const data = await response.json();

    console.log('Google Maps response status:', data.status);

    if (data.status === 'OK' && data.results?.[0]) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      const geocodingResult: GeocodingResult = {
        latitude: location.lat,
        longitude: location.lng,
        source: 'google_maps',
        formatted_address: result.formatted_address,
        query: fullAddress
      };

      console.log('Geocoding successful:', geocodingResult);

      return new Response(
        JSON.stringify(geocodingResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Se falhar, retorna erro para permitir fallback no cliente
    console.log('Geocoding failed:', data.status, data.error_message);
    return new Response(
      JSON.stringify({ 
        error: 'Geocoding failed', 
        status: data.status,
        message: data.error_message 
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in geocode-address function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
