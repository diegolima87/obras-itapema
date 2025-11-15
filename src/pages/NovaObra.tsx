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
import { ArrowLeft, Save, Upload } from "lucide-react";
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

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  tipo_obra: z.string().min(1, "Selecione o tipo de obra"),
  unidade_gestora: z.string().min(1, "Selecione a unidade gestora"),
  engenheiro_id: z.string().min(1, "Selecione o engenheiro responsável"),
  valor_total: z.string().min(1, "Informe o valor total"),
  data_inicio: z.string().min(1, "Informe a data de início"),
  data_previsao_termino: z.string().min(1, "Informe a previsão de término"),
  endereco: z.string().min(5, "Informe o endereço completo"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export default function NovaObra() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tipo_obra: "",
      unidade_gestora: "",
      engenheiro_id: "",
      valor_total: "",
      data_inicio: "",
      data_previsao_termino: "",
      endereco: "",
      latitude: "",
      longitude: "",
    },
  });

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
          engenheiro_fiscal_id: values.engenheiro_id || null,
          valor_total: parseFloat(values.valor_total),
          valor_executado: 0,
          percentual_executado: 0,
          data_inicio: values.data_inicio,
          data_fim_prevista: values.data_previsao_termino,
          endereco: values.endereco,
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
                      <FormLabel>Engenheiro Responsável *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o engenheiro" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="eng1">João Silva - CREA 12345</SelectItem>
                          <SelectItem value="eng2">Maria Santos - CREA 67890</SelectItem>
                          <SelectItem value="eng3">Pedro Costa - CREA 11223</SelectItem>
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
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Completo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, número, bairro, cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input placeholder="-27.5954" {...field} />
                        </FormControl>
                        <FormDescription>Opcional: para marcação no mapa</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input placeholder="-48.5480" {...field} />
                        </FormControl>
                        <FormDescription>Opcional: para marcação no mapa</FormDescription>
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
