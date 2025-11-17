import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Upload, MapPin, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useEngenheiros } from "@/hooks/useEngenheiros";

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  tipo_obra: z.string().min(1, "Selecione o tipo de obra"),
  unidade_gestora: z.string().min(1, "Selecione a unidade gestora"),
  engenheiro_id: z.string().nullable().optional(),
  valor_total: z.string().min(1, "Informe o valor total"),
  data_inicio: z.string().min(1, "Informe a data de início"),
  data_previsao_termino: z.string().min(1, "Informe a previsão de término"),
  cep: z.string().optional(),
  endereco: z.string().min(5, "Informe o endereço completo"),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export default function NovaObra() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const { data: engenheiros, isLoading: loadingEngenheiros } = useEngenheiros();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tipo_obra: "",
      unidade_gestora: "",
      engenheiro_id: "none",
      valor_total: "",
      data_inicio: "",
      data_previsao_termino: "",
      cep: "",
      endereco: "",
      bairro: "",
      cidade: "",
      uf: "",
      latitude: "",
      longitude: "",
    },
  });

  const handleFetchCep = async () => {
    const cep = form.getValues("cep");
    
    if (!cep || cep.trim().length < 8) {
      toast.error("Informe um CEP válido (8 dígitos)");
      return;
    }
    
    setIsFetchingCep(true);
    
    try {
      const cepLimpo = cep.replace(/\D/g, "");
      
      // Buscar dados do endereço via ViaCEP
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
      form.setValue("endereco", data.logradouro || "");
      form.setValue("bairro", data.bairro || "");
      form.setValue("cidade", data.localidade || "");
      form.setValue("uf", data.uf || "");
      
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
    const endereco = customAddress || form.getValues("endereco");
    
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
          form.setValue("latitude", location.lat.toString());
          form.setValue("longitude", location.lng.toString());
          toast.success("Coordenadas encontradas com sucesso!");
          return;
        } else if (data.status !== "REQUEST_DENIED") {
          // Se não for REQUEST_DENIED, tentar Nominatim como fallback
          console.log("Google Maps não retornou resultados, tentando Nominatim...");
        }
      }
      
      // Usar Nominatim como fallback (se Google Maps falhou ou não está configurado)
      const nominatimResult = await tryNominatimGeocoding(endereco);
      
      if (nominatimResult) {
        form.setValue("latitude", nominatimResult.lat.toString());
        form.setValue("longitude", nominatimResult.lng.toString());
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from("obras")
        .insert({
          nome: values.nome,
          descricao: values.descricao,
          tipo_obra: values.tipo_obra,
          unidade_gestora: values.unidade_gestora,
          engenheiro_fiscal_id: values.engenheiro_id && values.engenheiro_id !== "none" ? values.engenheiro_id : null,
          valor_total: parseFloat(values.valor_total),
          valor_executado: 0,
          percentual_executado: 0,
          data_inicio: values.data_inicio,
          data_fim_prevista: values.data_previsao_termino,
          endereco: values.endereco,
          bairro: values.bairro,
          cidade: values.cidade,
          uf: values.uf,
          latitude: values.latitude ? parseFloat(values.latitude) : null,
          longitude: values.longitude ? parseFloat(values.longitude) : null,
          status: "planejada",
          publico_portal: false, // Por padrão não é público
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Obra criada com sucesso!");
      navigate("/obras");
    } catch (error) {
      console.error("Erro ao criar obra:", error);
      toast.error("Erro ao criar obra. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/obras">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nova Obra</h1>
            <p className="text-muted-foreground">
              Cadastre uma nova obra pública no sistema
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Obra *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Pavimentação Rua das Flores" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva os detalhes da obra..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipo_obra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Obra *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pavimentacao">Pavimentação</SelectItem>
                            <SelectItem value="drenagem">Drenagem</SelectItem>
                            <SelectItem value="edificacao">Edificação</SelectItem>
                            <SelectItem value="saneamento">Saneamento</SelectItem>
                            <SelectItem value="urbanizacao">Urbanização</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unidade_gestora"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade Gestora *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a unidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Secretaria de Obras">Secretaria de Obras</SelectItem>
                            <SelectItem value="Secretaria de Infraestrutura">
                              Secretaria de Infraestrutura
                            </SelectItem>
                            <SelectItem value="Secretaria de Urbanismo">
                              Secretaria de Urbanismo
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                  <FormField
                    control={form.control}
                    name="engenheiro_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engenheiro Responsável</FormLabel>
                        <Select 
                          value={field.value || "none"}
                          onValueChange={field.onChange}
                          disabled={loadingEngenheiros}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={loadingEngenheiros ? "Carregando..." : "Selecione o engenheiro"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Não definido</SelectItem>
                            {engenheiros?.map((eng) => (
                              <SelectItem key={eng.id} value={eng.id}>
                                {eng.nome}{eng.crea ? ` - CREA ${eng.crea}` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados Financeiros e Prazo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="valor_total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0,00" {...field} />
                      </FormControl>
                      <FormDescription>Valor total estimado da obra em reais</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="data_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data_previsao_termino"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previsão de Término *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            placeholder="Ex: 12345-678" 
                            {...field}
                            maxLength={9}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleFetchCep}
                          disabled={isFetchingCep || !field.value || field.value.replace(/\D/g, "").length < 8}
                        >
                          {isFetchingCep ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <MapPin className="h-4 w-4 mr-2" />
                          )}
                          Buscar
                        </Button>
                      </div>
                      <FormDescription>
                        Preenche automaticamente endereço, bairro, cidade e coordenadas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço (Rua/Avenida) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Rua das Flores" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Centro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: São Paulo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="uf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UF</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: SP" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude (Gerada automaticamente)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="-27.5954" 
                            {...field}
                            readOnly
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude (Gerada automaticamente)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="-48.5480" 
                            {...field}
                            readOnly
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos Obrigatórios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Button type="button" variant="outline">
                      Selecionar Arquivos
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Arraste arquivos para esta área ou clique para selecionar
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX até 10MB
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Documentos como projeto executivo, licenças, ART, etc.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Link to="/obras">
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Salvando..." : "Salvar Obra"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
