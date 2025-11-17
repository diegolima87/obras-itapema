import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, AlertCircle, Loader2, MapPin } from "lucide-react";
import { useObra, useAtualizarObra } from "@/hooks/useObras";
import { useEngenheiros } from "@/hooks/useEngenheiros";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tiposObra } from "@/lib/constants";
import { toast } from "sonner";

export default function EditarObra() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: obra, isLoading, error } = useObra(id);
  const { data: engenheiros } = useEngenheiros();
  const atualizarObra = useAtualizarObra();
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipo_obra: "",
    status: "",
    unidade_gestora: "",
    cep: "",
    endereco: "",
    bairro: "",
    cidade: "",
    uf: "",
    latitude: "",
    longitude: "",
    valor_total: 0,
    percentual_executado: 0,
    data_inicio: "",
    data_fim_prevista: "",
    engenheiro_fiscal_id: "",
    publico_portal: false,
  });

  useEffect(() => {
    if (obra) {
      setFormData({
        nome: obra.nome || "",
        descricao: obra.descricao || "",
        tipo_obra: obra.tipo_obra || "",
        status: obra.status || "",
        unidade_gestora: obra.unidade_gestora || "",
        cep: "",
        endereco: obra.endereco || "",
        bairro: (obra as any).bairro || "",
        cidade: (obra as any).cidade || "",
        uf: (obra as any).uf || "",
        latitude: obra.latitude?.toString() || "",
        longitude: obra.longitude?.toString() || "",
        valor_total: obra.valor_total || 0,
        percentual_executado: obra.percentual_executado || 0,
        data_inicio: obra.data_inicio || "",
        data_fim_prevista: obra.data_fim_prevista || "",
        engenheiro_fiscal_id: obra.engenheiro_fiscal_id || "",
        publico_portal: obra.publico_portal || false,
      });
    }
  }, [obra]);

  const tryNominatimGeocoding = async (endereco: string) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1&countrycodes=br`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SistemaGestaoObras/1.0'
        }
      });
      
      const data = await response.json();
      
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar coordenadas via Nominatim:", error);
      return null;
    }
  };

  const handleGeocodeAddress = async (customAddress?: string) => {
    const endereco = customAddress || formData.endereco;
    
    if (!endereco || endereco.trim().length < 5) {
      toast.error("Informe um endereço válido antes de buscar coordenadas");
      return;
    }
    
    setIsGeocoding(true);
    
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      // Tentar Google Maps primeiro se a chave existir
      if (apiKey) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            endereco
          )}&key=${apiKey}`
        );
        
        const data = await response.json();
        
        if (data.status === "OK" && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setFormData((prev) => ({
            ...prev,
            latitude: location.lat.toString(),
            longitude: location.lng.toString(),
          }));
          toast.success("Coordenadas encontradas com sucesso!");
          return;
        } else if (data.status !== "REQUEST_DENIED") {
          console.log("Google Maps não retornou resultados, tentando Nominatim...");
        }
      }
      
      // Usar Nominatim como fallback
      const nominatimResult = await tryNominatimGeocoding(endereco);
      
      if (nominatimResult) {
        setFormData((prev) => ({
          ...prev,
          latitude: nominatimResult.lat.toString(),
          longitude: nominatimResult.lng.toString(),
        }));
        toast.success("Coordenadas encontradas com sucesso via OpenStreetMap!");
      } else {
        toast.error("Não foi possível encontrar as coordenadas para este endereço");
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      toast.error("Erro ao buscar coordenadas. Tente novamente.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleFetchCep = async () => {
    const cep = formData.cep;
    
    if (!cep || cep.trim().length < 8) {
      toast.error("Informe um CEP válido (8 dígitos)");
      return;
    }
    
    setIsFetchingCep(true);
    
    try {
      const cepLimpo = cep.replace(/\D/g, "");
      
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      
      if (!response.ok) {
        toast.error("Erro ao buscar CEP. Tente novamente.");
        return;
      }
      
      const data = await response.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado. Verifique e tente novamente.");
        return;
      }
      
      // Preencher campos do formulário
      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
      
      // Tentar buscar coordenadas com o endereço completo
      const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
      await handleGeocodeAddress(enderecoCompleto);
      
      toast.success("Endereço encontrado com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Erro ao buscar CEP. Verifique sua conexão.");
    } finally {
      setIsFetchingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    await atualizarObra.mutateAsync({
      id,
      nome: formData.nome,
      descricao: formData.descricao,
      tipo_obra: formData.tipo_obra,
      status: formData.status,
      unidade_gestora: formData.unidade_gestora,
      endereco: formData.endereco,
      bairro: formData.bairro,
      cidade: formData.cidade,
      uf: formData.uf,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      valor_total: formData.valor_total,
      percentual_executado: formData.percentual_executado,
      data_inicio: formData.data_inicio,
      data_fim_prevista: formData.data_fim_prevista,
      engenheiro_fiscal_id: formData.engenheiro_fiscal_id || null,
      publico_portal: formData.publico_portal,
    } as any);
    
    navigate(`/obras/${id}`);
  };

  if (error) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar obra: {error.message}
          </AlertDescription>
        </Alert>
        <div className="text-center py-12">
          <Link to="/obras">
            <Button className="mt-4">Voltar para Obras</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!obra) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Obra não encontrada</h2>
          <Link to="/obras">
            <Button className="mt-4">Voltar para Obras</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/obras/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Editar Obra</h1>
            <p className="text-muted-foreground">Atualize as informações da obra</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados da Obra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nome">Nome da Obra *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_obra">Tipo de Obra *</Label>
                  <Select
                    value={formData.tipo_obra}
                    onValueChange={(value) => setFormData({ ...formData, tipo_obra: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposObra.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planejada">Planejada</SelectItem>
                      <SelectItem value="andamento">Em Andamento</SelectItem>
                      <SelectItem value="paralisada">Paralisada</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidade_gestora">Unidade Gestora *</Label>
                  <Input
                    id="unidade_gestora"
                    value={formData.unidade_gestora}
                    onChange={(e) => setFormData({ ...formData, unidade_gestora: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engenheiro_fiscal_id">Engenheiro Fiscal</Label>
                  <Select
                    value={formData.engenheiro_fiscal_id}
                    onValueChange={(value) => setFormData({ ...formData, engenheiro_fiscal_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o engenheiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {engenheiros?.map((eng) => (
                        <SelectItem key={eng.id} value={eng.id}>
                          {eng.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Localização</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cep"
                          placeholder="00000-000"
                          value={formData.cep}
                          onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleFetchCep}
                          disabled={isFetchingCep}
                        >
                          {isFetchingCep ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Buscar"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    maxLength={2}
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <div className="flex gap-2">
                    <Input
                      id="latitude"
                      type="number"
                      step="0.0000001"
                      placeholder="Ex: -27.5954"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleGeocodeAddress()}
                      disabled={isGeocoding}
                      title="Buscar coordenadas automaticamente"
                    >
                      {isGeocoding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0000001"
                    placeholder="Ex: -48.5480"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_total">Valor Total (R$) *</Label>
                  <Input
                    id="valor_total"
                    type="number"
                    step="0.01"
                    value={formData.valor_total}
                    onChange={(e) => setFormData({ ...formData, valor_total: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentual_executado">Percentual Executado (%)</Label>
                  <Input
                    id="percentual_executado"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentual_executado}
                    onChange={(e) => setFormData({ ...formData, percentual_executado: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_inicio">Data de Início</Label>
                  <Input
                    id="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_fim_prevista">Data de Término Prevista</Label>
                  <Input
                    id="data_fim_prevista"
                    type="date"
                    value={formData.data_fim_prevista}
                    onChange={(e) => setFormData({ ...formData, data_fim_prevista: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="publico_portal"
                    checked={formData.publico_portal}
                    onChange={(e) => setFormData({ ...formData, publico_portal: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="publico_portal">Visível no Portal Público</Label>
                </div>

                <div className="flex gap-2">
                  <Link to={`/obras/${id}`}>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={atualizarObra.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {atualizarObra.isPending ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
