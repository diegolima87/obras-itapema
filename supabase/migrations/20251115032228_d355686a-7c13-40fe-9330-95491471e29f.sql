-- Inserir obras de exemplo com coordenadas geográficas
INSERT INTO obras (id, nome, descricao, endereco, latitude, longitude, status, unidade_gestora, valor_total, valor_executado, percentual_executado, data_inicio, data_fim_prevista, tipo_obra, publico_portal)
VALUES
  (
    gen_random_uuid(),
    'Pavimentação da Rua das Flores',
    'Pavimentação asfáltica com drenagem pluvial e sinalização horizontal e vertical',
    'Rua das Flores, 1000 - Centro',
    -27.5954,
    -48.5480,
    'andamento'::status_obra,
    'Secretaria de Obras',
    850000,
    382500,
    45,
    '2024-01-15',
    '2024-12-30',
    'Infraestrutura',
    true
  ),
  (
    gen_random_uuid(),
    'Construção de Creche Municipal',
    'Construção de creche para atendimento de 200 crianças com refeitório, parque e área de lazer',
    'Av. Principal, 2500 - Bairro Novo',
    -27.6000,
    -48.5500,
    'planejada'::status_obra,
    'Secretaria de Educação',
    1200000,
    0,
    0,
    '2024-06-01',
    '2025-12-31',
    'Educação',
    true
  ),
  (
    gen_random_uuid(),
    'Reforma da Praça Central',
    'Revitalização completa com paisagismo, iluminação LED, academia ao ar livre e área de convivência',
    'Praça Central - Centro',
    -27.5920,
    -48.5460,
    'concluida'::status_obra,
    'Secretaria de Urbanismo',
    350000,
    350000,
    100,
    '2023-03-01',
    '2023-11-30',
    'Urbanismo',
    true
  );