-- Adicionar coluna para rastrear a origem das coordenadas
ALTER TABLE obras 
ADD COLUMN coordenadas_fonte VARCHAR(20) DEFAULT 'desconhecida';

-- Valores possíveis: 'google', 'nominatim', 'cidade_aproximada', 'manual', 'desconhecida'
COMMENT ON COLUMN obras.coordenadas_fonte IS 'Origem das coordenadas: google, nominatim, cidade_aproximada, manual, desconhecida';