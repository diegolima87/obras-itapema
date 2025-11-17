/**
 * Serviço de Geocodificação Robusto
 * 
 * Implementa uma estratégia em cascata para busca de coordenadas:
 * 1. Supabase Edge Function (Google Maps server-side)
 * 2. OpenStreetMap Nominatim (múltiplas tentativas)
 * 3. Coordenadas aproximadas da cidade
 */

import { supabase } from "@/integrations/supabase/client";

// Dicionário de coordenadas das principais cidades brasileiras
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Região Sul
  'Florianópolis-SC': { lat: -27.5954, lng: -48.5480 },
  'Joinville-SC': { lat: -26.3045, lng: -48.8487 },
  'Blumenau-SC': { lat: -26.9194, lng: -49.0661 },
  'Curitiba-PR': { lat: -25.4284, lng: -49.2733 },
  'Londrina-PR': { lat: -23.3045, lng: -51.1696 },
  'Porto Alegre-RS': { lat: -30.0346, lng: -51.2177 },
  'Caxias do Sul-RS': { lat: -29.1678, lng: -51.1794 },
  
  // Região Sudeste
  'São Paulo-SP': { lat: -23.5505, lng: -46.6333 },
  'Campinas-SP': { lat: -22.9056, lng: -47.0608 },
  'Santos-SP': { lat: -23.9618, lng: -46.3322 },
  'São José dos Campos-SP': { lat: -23.1791, lng: -45.8872 },
  'Ribeirão Preto-SP': { lat: -21.1704, lng: -47.8103 },
  'Rio de Janeiro-RJ': { lat: -22.9068, lng: -43.1729 },
  'Niterói-RJ': { lat: -22.8833, lng: -43.1036 },
  'Belo Horizonte-MG': { lat: -19.9167, lng: -43.9345 },
  'Uberlândia-MG': { lat: -18.9186, lng: -48.2772 },
  'Vitória-ES': { lat: -20.3155, lng: -40.3128 },
  
  // Região Centro-Oeste
  'Brasília-DF': { lat: -15.7939, lng: -47.8828 },
  'Goiânia-GO': { lat: -16.6869, lng: -49.2648 },
  'Campo Grande-MS': { lat: -20.4697, lng: -54.6201 },
  'Cuiabá-MT': { lat: -15.6014, lng: -56.0979 },
  
  // Região Nordeste
  'Salvador-BA': { lat: -12.9714, lng: -38.5014 },
  'Fortaleza-CE': { lat: -3.7319, lng: -38.5267 },
  'Recife-PE': { lat: -8.0476, lng: -34.8770 },
  'Natal-RN': { lat: -5.7945, lng: -35.2110 },
  'São Luís-MA': { lat: -2.5297, lng: -44.3028 },
  'Maceió-AL': { lat: -9.6658, lng: -35.7353 },
  'Aracaju-SE': { lat: -10.9472, lng: -37.0731 },
  'João Pessoa-PB': { lat: -7.1195, lng: -34.8450 },
  'Teresina-PI': { lat: -5.0892, lng: -42.8019 },
  
  // Região Norte
  'Manaus-AM': { lat: -3.1190, lng: -60.0217 },
  'Belém-PA': { lat: -1.4558, lng: -48.5044 },
  'Porto Velho-RO': { lat: -8.7612, lng: -63.9004 },
  'Rio Branco-AC': { lat: -9.9754, lng: -67.8243 },
  'Macapá-AP': { lat: 0.0355, lng: -51.0704 },
  'Boa Vista-RR': { lat: 2.8235, lng: -60.6758 },
  'Palmas-TO': { lat: -10.1840, lng: -48.3336 },
};

export interface GeocodingResult {
  lat: number;
  lng: number;
  source: 'google' | 'nominatim' | 'cidade_aproximada' | 'google_maps' | 'manual';
  query?: string;
}

/**
 * Tenta geocodificar usando Supabase Edge Function (Google Maps server-side)
 */
async function trySupabaseGeocoding(
  endereco: string,
  bairro?: string,
  cidade?: string,
  uf?: string,
  cep?: string
): Promise<GeocodingResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke('geocode-address', {
      body: { endereco, bairro, cidade, uf, cep }
    });
    
    if (error) {
      console.error('❌ Supabase geocoding error:', error);
      return null;
    }
    
    if (data && data.latitude && data.longitude) {
      console.log('✅ Coordenadas encontradas via Supabase (Google Maps server-side)');
      return {
        lat: data.latitude,
        lng: data.longitude,
        source: 'google',
        query: data.query
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error calling Supabase geocoding function:', error);
    return null;
  }
}

/**
 * Tenta geocodificar usando a API do Google Maps
 */
async function tryGoogleMapsGeocoding(
  endereco: string,
  apiKey: string
): Promise<GeocodingResult | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      endereco
    )}&key=${apiKey}&region=br`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      console.log('✅ Coordenadas encontradas via Google Maps:', location);
      return {
        lat: location.lat,
        lng: location.lng,
        source: 'google',
        query: endereco
      };
    }

    if (data.status === "REQUEST_DENIED") {
      console.warn('⚠️ Google Maps API: Geocoding API não está habilitada ou key inválida');
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar coordenadas via Google Maps:", error);
    return null;
  }
}

/**
 * Tenta geocodificar usando OpenStreetMap Nominatim
 */
async function tryNominatimGeocoding(
  endereco: string
): Promise<GeocodingResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      endereco
    )}&format=json&limit=1&countrycodes=br`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SistemaGestaoObras/1.0',
      },
    });

    const data = await response.json();

    if (data.length > 0) {
      const result = data[0];
      
      // Detectar se é um resultado genérico (apenas cidade)
      const isGenericCity = 
        result.type === 'city' || 
        result.type === 'town' ||
        result.type === 'municipality' ||
        result.type === 'administrative' ||
        !result.address?.road; // Sem nome de rua = coordenadas genéricas
      
      console.log('Nominatim result:', {
        lat: result.lat,
        lon: result.lon,
        displayName: result.display_name,
        type: result.type,
        address: result.address,
        isGenericCity
      });
      
      const source = isGenericCity ? 'cidade_aproximada' : 'nominatim';
      console.log(`✅ Coordenadas encontradas via Nominatim para: "${endereco}" (${source})`);
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        source,
        query: endereco
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar coordenadas via Nominatim:", error);
    return null;
  }
}

/**
 * Tenta geocodificar com múltiplas queries em cascata
 * (do mais específico para o mais genérico)
 */
async function tryNominatimWithMultipleQueries(
  endereco: string,
  bairro?: string,
  cidade?: string,
  uf?: string
): Promise<GeocodingResult | null> {
  const queries: string[] = [];

  // Construir queries em ordem de especificidade
  if (endereco && bairro && cidade && uf) {
    queries.push(`${endereco}, ${bairro}, ${cidade}, ${uf}, Brasil`);
  }
  if (bairro && cidade && uf) {
    queries.push(`${bairro}, ${cidade}, ${uf}, Brasil`);
  }
  if (cidade && uf) {
    queries.push(`${cidade}, ${uf}, Brasil`);
  }
  if (endereco && cidade && uf) {
    queries.push(`${endereco}, ${cidade}, ${uf}, Brasil`);
  }
  
  // Fallback: só endereço
  if (endereco) {
    queries.push(`${endereco}, Brasil`);
  }

  console.log('🔍 Tentando geocodificação com múltiplas queries:', queries);

  // Tentar cada query em ordem
  for (const query of queries) {
    const result = await tryNominatimGeocoding(query);
    if (result) {
      return result;
    }
    // Aguardar um pouco entre requests para respeitar rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return null;
}

/**
 * Retorna coordenadas aproximadas do centro da cidade
 */
function getCityCoordinates(
  cidade?: string,
  uf?: string
): GeocodingResult | null {
  if (!cidade || !uf) return null;

  const key = `${cidade}-${uf}`;
  const coords = CITY_COORDINATES[key];

  if (coords) {
    console.log(`📍 Usando coordenadas aproximadas da cidade: ${key}`);
    return {
      ...coords,
      source: 'cidade_aproximada',
      query: key
    };
  }

  return null;
}

/**
 * Função principal de geocodificação com estratégia robusta em cascata
 */
export async function geocodeAddress(params: {
  endereco: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  googleApiKey?: string;
}): Promise<GeocodingResult | null> {
  const { endereco, bairro, cidade, uf, cep } = params;

  console.log('🗺️ Iniciando geocodificação:', { endereco, bairro, cidade, uf, cep });

  // Estratégia 1: Tentar Supabase Edge Function (Google Maps server-side)
  console.log('🔍 Estratégia 1: Tentando Supabase (Google Maps server-side)...');
  const supabaseResult = await trySupabaseGeocoding(endereco, bairro, cidade, uf, cep);
  if (supabaseResult) {
    return supabaseResult;
  }

  // Estratégia 2: Tentar Nominatim com múltiplas queries
  console.log('🔍 Estratégia 2: Tentando OpenStreetMap Nominatim...');
  const nominatimResult = await tryNominatimWithMultipleQueries(endereco, bairro, cidade, uf);
  if (nominatimResult) {
    return nominatimResult;
  }

  // Estratégia 3: Fallback para coordenadas aproximadas da cidade
  console.log('⚠️ Estratégia 3: Usando coordenadas aproximadas da cidade');
  const cityResult = getCityCoordinates(cidade, uf);
  if (cityResult) {
    console.log('⚠️ Usando coordenadas aproximadas do centro da cidade', cityResult);
    return cityResult;
  }

  console.log('❌ Não foi possível geocodificar o endereço');
  return null;
}

/**
 * Busca informações de endereço via CEP (ViaCEP)
 */
export async function fetchAddressByCep(cep: string): Promise<{
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
} | null> {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      return null;
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      localidade: data.localidade || '',
      uf: data.uf || '',
      ibge: data.ibge || '',
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}
