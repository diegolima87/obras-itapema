-- Correção de obras com coordenadas aproximadas incorretamente marcadas como 'nominatim'
-- Este script identifica e corrige obras que têm coordenadas do centro da cidade
-- mas foram marcadas incorretamente como obtidas via Nominatim

-- Tabela temporária com coordenadas conhecidas de centros de cidades
CREATE TEMP TABLE city_center_coords AS
SELECT 'Campinas' as cidade, 'SP' as uf, -22.90563910 as lat, -47.05956400 as lng
UNION ALL SELECT 'Florianópolis', 'SC', -27.5954, -48.5480
UNION ALL SELECT 'São Paulo', 'SP', -23.5505, -46.6333
UNION ALL SELECT 'Rio de Janeiro', 'RJ', -22.9068, -43.1729
UNION ALL SELECT 'Belo Horizonte', 'MG', -19.9167, -43.9345
UNION ALL SELECT 'Brasília', 'DF', -15.7939, -47.8828
UNION ALL SELECT 'Curitiba', 'PR', -25.4284, -49.2733
UNION ALL SELECT 'Porto Alegre', 'RS', -30.0346, -51.2177
UNION ALL SELECT 'Salvador', 'BA', -12.9714, -38.5014
UNION ALL SELECT 'Fortaleza', 'CE', -3.7172, -38.5434
UNION ALL SELECT 'Recife', 'PE', -8.0476, -34.8770
UNION ALL SELECT 'Manaus', 'AM', -3.1190, -60.0217;

-- Atualizar obras que têm coordenadas exatas de centro de cidade
-- mas estão marcadas como 'nominatim' (devem ser 'cidade_aproximada')
UPDATE obras o
SET coordenadas_fonte = 'cidade_aproximada'
FROM city_center_coords cc
WHERE o.cidade = cc.cidade 
  AND o.uf = cc.uf
  AND ABS(o.latitude - cc.lat) < 0.0001
  AND ABS(o.longitude - cc.lng) < 0.0001
  AND o.coordenadas_fonte = 'nominatim';

-- Corrigir a obra "Teste" especificamente
UPDATE obras 
SET coordenadas_fonte = 'cidade_aproximada'
WHERE id = '1e1a149c-48d3-47f4-a6c9-8b775c94af92' 
  AND coordenadas_fonte = 'nominatim'
  AND ABS(latitude - (-22.90563910)) < 0.0001
  AND ABS(longitude - (-47.05956400)) < 0.0001;

-- Log das mudanças (para auditoria)
DO $$
DECLARE
  obras_corrigidas INTEGER;
BEGIN
  SELECT COUNT(*) INTO obras_corrigidas
  FROM obras o
  INNER JOIN city_center_coords cc ON (
    o.cidade = cc.cidade 
    AND o.uf = cc.uf
    AND ABS(o.latitude - cc.lat) < 0.0001
    AND ABS(o.longitude - cc.lng) < 0.0001
  )
  WHERE o.coordenadas_fonte = 'cidade_aproximada';
  
  RAISE NOTICE 'Total de obras corrigidas para coordenadas_fonte = cidade_aproximada: %', obras_corrigidas;
END $$;