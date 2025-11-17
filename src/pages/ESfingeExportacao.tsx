import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  AlertCircle, 
  Eye,
  Send,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContratos } from "@/hooks/useContratos";
import { useMedicoes } from "@/hooks/useMedicoes";
import { useObras } from "@/hooks/useObras";
import { useValidarDadosTCE } from "@/hooks/useValidarDadosTCE";
import { useEnviarTCE } from "@/hooks/useIntegracoesTCE";

export default function ESfingeExportacao() {
  const { toast } = useToast();
  const [tipoExportacao, setTipoExportacao] = useState<"contrato" | "medicao" | "situacao_obra" | "">("");
  const [registrosSelecionados, setRegistrosSelecionados] = useState<string[]>([]);
  const [validacaoCompleta, setValidacaoCompleta] = useState(false);
  const [enviandoLote, setEnviandoLote] = useState(false);
  const [progressoEnvio, setProgressoEnvio] = useState(0);
  const [payloadPreview, setPayloadPreview] = useState<any>(null);

  const { data: contratos = [] } = useContratos();
  const { data: medicoes = [] } = useMedicoes();
  const { data: obras = [] } = useObras();
  const validarMutation = useValidarDadosTCE();
  const enviarMutation = useEnviarTCE();

  const registrosDisponiveis = useMemo(() => {
    if (tipoExportacao === "contrato") return contratos;
    if (tipoExportacao === "medicao") return medicoes;
    if (tipoExportacao === "situacao_obra") return obras;
    return [];
  }, [tipoExportacao, contratos, medicoes, obras]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setRegistrosSelecionados(registrosDisponiveis.map(r => r.id));
    } else {
      setRegistrosSelecionados([]);
    }
  };

  const handleSelectRegistro = (id: string, checked: boolean) => {
    if (checked) {
      setRegistrosSelecionados([...registrosSelecionados, id]);
    } else {
      setRegistrosSelecionados(registrosSelecionados.filter(r => r !== id));
    }
  };

  const handleValidar = async () => {
    if (!tipoExportacao || registrosSelecionados.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione o tipo e ao menos um registro para validar",
        variant: "destructive",
      });
      return;
    }

    try {
      const resultado = await validarMutation.mutateAsync({
        tipo: tipoExportacao as any,
        ids: registrosSelecionados,
      });

      setValidacaoCompleta(true);
      
      toast({
        title: "Validação concluída",
        description: `${resultado.resumo.validos} de ${resultado.resumo.total} registros válidos`,
      });
    } catch (error) {
      console.error("Erro ao validar:", error);
    }
  };

  const handleEnviarLote = async () => {
    if (registrosSelecionados.length === 0) return;

    setEnviandoLote(true);
    setProgressoEnvio(0);

    try {
      for (let i = 0; i < registrosSelecionados.length; i++) {
        const id = registrosSelecionados[i];
        
        await enviarMutation.mutateAsync({
          tipo: tipoExportacao as any,
          referenciaId: id,
        });

        setProgressoEnvio(((i + 1) / registrosSelecionados.length) * 100);
      }

      toast({
        title: "Envio concluído",
        description: `${registrosSelecionados.length} registros enviados com sucesso`,
      });

      setRegistrosSelecionados([]);
      setValidacaoCompleta(false);
    } catch (error) {
      console.error("Erro ao enviar lote:", error);
    } finally {
      setEnviandoLote(false);
      setProgressoEnvio(0);
    }
  };

  const handlePreviewPayload = (registro: any) => {
    const payload = {
      tipo: tipoExportacao,
      id: registro.id,
      dados: registro,
      timestamp: new Date().toISOString(),
    };
    setPayloadPreview(payload);
  };

  const getNomeRegistro = (registro: any) => {
    if (tipoExportacao === "contrato") return `Contrato ${registro.numero}`;
    if (tipoExportacao === "medicao") return `Medição ${registro.numero_medicao}`;
    if (tipoExportacao === "situacao_obra") return registro.nome;
    return "";
  };

  const resultadosValidacao = validarMutation.data?.resultados || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exportação e Validação</h1>
          <p className="text-muted-foreground">
            Selecione, valide e envie dados em lote ao e-Sfinge TCE/SC
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Selecione o tipo de dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Dados</Label>
                  <Select 
                    value={tipoExportacao} 
                    onValueChange={(value: any) => {
                      setTipoExportacao(value);
                      setRegistrosSelecionados([]);
                      setValidacaoCompleta(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contrato">Contratos</SelectItem>
                      <SelectItem value="medicao">Medições</SelectItem>
                      <SelectItem value="situacao_obra">Situação de Obras</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={handleValidar}
                    disabled={!tipoExportacao || registrosSelecionados.length === 0 || validarMutation.isPending}
                  >
                    {validarMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Validar Dados
                      </>
                    )}
                  </Button>

                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={handleEnviarLote}
                    disabled={!validacaoCompleta || registrosSelecionados.length === 0 || enviandoLote}
                  >
                    {enviandoLote ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar em Lote ({registrosSelecionados.length})
                      </>
                    )}
                  </Button>

                  {enviandoLote && (
                    <div className="space-y-2">
                      <Progress value={progressoEnvio} />
                      <p className="text-sm text-muted-foreground text-center">
                        {Math.round(progressoEnvio)}% concluído
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            {tipoExportacao && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Selecione os Registros</CardTitle>
                      <CardDescription>
                        {registrosDisponiveis.length} registros disponíveis
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={registrosSelecionados.length === registrosDisponiveis.length && registrosDisponiveis.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                      <Label htmlFor="select-all" className="cursor-pointer">
                        Selecionar Todos
                      </Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {registrosDisponiveis.map((registro: any) => {
                        const validacao = resultadosValidacao.find(v => v.id === registro.id);
                        
                        return (
                          <div 
                            key={registro.id} 
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <Checkbox
                                id={registro.id}
                                checked={registrosSelecionados.includes(registro.id)}
                                onCheckedChange={(checked) => 
                                  handleSelectRegistro(registro.id, checked as boolean)
                                }
                              />
                              <div className="flex-1">
                                <Label htmlFor={registro.id} className="cursor-pointer font-medium">
                                  {getNomeRegistro(registro)}
                                </Label>
                                {validacao && (
                                  <div className="flex gap-2 mt-1">
                                    {validacao.valido ? (
                                      <Badge variant="outline" className="text-green-600 border-green-600">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        Válido
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-red-600 border-red-600">
                                        <AlertCircle className="mr-1 h-3 w-3" />
                                        {validacao.erros.length} erro(s)
                                      </Badge>
                                    )}
                                    {validacao.avisos.length > 0 && (
                                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                        {validacao.avisos.length} aviso(s)
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handlePreviewPayload(registro)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>Preview do Payload</DialogTitle>
                                  <DialogDescription>
                                    Dados que serão enviados ao e-Sfinge TCE/SC
                                  </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="h-[500px]">
                                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                                    {JSON.stringify(payloadPreview, null, 2)}
                                  </pre>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Validation Results */}
            {validacaoCompleta && resultadosValidacao.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultado da Validação</CardTitle>
                  <CardDescription>
                    Detalhes dos erros e avisos encontrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resultadosValidacao.map((resultado) => {
                      if (resultado.valido && resultado.avisos.length === 0) return null;
                      
                      const registro = registrosDisponiveis.find((r: any) => r.id === resultado.id);
                      
                      return (
                        <div key={resultado.id} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">
                            {registro && getNomeRegistro(registro)}
                          </h4>
                          
                          {resultado.erros.length > 0 && (
                            <div className="space-y-2 mb-3">
                              <p className="text-sm font-medium text-red-600">Erros:</p>
                              {resultado.erros.map((erro, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium">{erro.campo}:</span> {erro.mensagem}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {resultado.avisos.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-yellow-600">Avisos:</p>
                              {resultado.avisos.map((aviso, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium">{aviso.campo}:</span> {aviso.mensagem}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
