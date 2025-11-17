import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  Send,
  Settings,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ESfingeConfiguracoes() {
  const { toast } = useToast();
  const [envioMensalAtivo, setEnvioMensalAtivo] = useState(true);
  const [diaEnvioMensal, setDiaEnvioMensal] = useState("1");
  const [horaEnvioMensal, setHoraEnvioMensal] = useState("06:00");
  const [importacaoAtiva, setImportacaoAtiva] = useState(true);
  const [horaImportacao, setHoraImportacao] = useState("06:00");
  const [testando, setTestando] = useState(false);

  const handleSalvarConfiguracoes = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de envio automático foram atualizadas",
    });
  };

  const handleTestarEnvioMensal = async () => {
    setTestando(true);
    try {
      const { data, error } = await supabase.functions.invoke("enviar-situacao-obras-mensal");

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Teste concluído com sucesso",
          description: `${data.resumo.sucessos} obras enviadas de ${data.resumo.total}`,
        });
      } else {
        throw new Error("Erro no teste de envio");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: "Erro no teste",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTestando(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações de Integração</h1>
          <p className="text-muted-foreground">
            Configure envios automáticos e importações do e-Sfinge TCE/SC
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Envio Mensal Automático */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Envio Mensal Automático</CardTitle>
                  <CardDescription>
                    Situação de todas as obras enviada mensalmente ao TCE/SC
                  </CardDescription>
                </div>
                <Switch
                  checked={envioMensalAtivo}
                  onCheckedChange={setEnvioMensalAtivo}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {envioMensalAtivo && (
                <>
                  <div className="space-y-2">
                    <Label>Dia do Mês</Label>
                    <Select value={diaEnvioMensal} onValueChange={setDiaEnvioMensal}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Dia 1</SelectItem>
                        <SelectItem value="5">Dia 5</SelectItem>
                        <SelectItem value="10">Dia 10</SelectItem>
                        <SelectItem value="15">Dia 15</SelectItem>
                        <SelectItem value="20">Dia 20</SelectItem>
                        <SelectItem value="25">Dia 25</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Horário de Envio</Label>
                    <Select value={horaEnvioMensal} onValueChange={setHoraEnvioMensal}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00:00">00:00 (Meia-noite)</SelectItem>
                        <SelectItem value="06:00">06:00 (Manhã)</SelectItem>
                        <SelectItem value="12:00">12:00 (Meio-dia)</SelectItem>
                        <SelectItem value="18:00">18:00 (Tarde)</SelectItem>
                        <SelectItem value="22:00">22:00 (Noite)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3 mb-4">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Próximo Envio Agendado</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date().getDate() < parseInt(diaEnvioMensal) 
                            ? `${diaEnvioMensal} de ${new Date().toLocaleDateString('pt-BR', { month: 'long' })}`
                            : `${diaEnvioMensal} de ${new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('pt-BR', { month: 'long' })}`
                          } às {horaEnvioMensal}
                        </p>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleTestarEnvioMensal}
                      disabled={testando}
                    >
                      {testando ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Testar Envio Agora
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {!envioMensalAtivo && (
                <div className="py-4 text-center text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                  <p>Envio mensal automático desativado</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Importação Diária */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Importação Diária Automática</CardTitle>
                  <CardDescription>
                    Importação automática de dados do e-Sfinge
                  </CardDescription>
                </div>
                <Switch
                  checked={importacaoAtiva}
                  onCheckedChange={setImportacaoAtiva}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {importacaoAtiva && (
                <>
                  <div className="space-y-2">
                    <Label>Horário de Importação</Label>
                    <Select value={horaImportacao} onValueChange={setHoraImportacao}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00:00">00:00 (Meia-noite)</SelectItem>
                        <SelectItem value="06:00">06:00 (Manhã)</SelectItem>
                        <SelectItem value="12:00">12:00 (Meio-dia)</SelectItem>
                        <SelectItem value="18:00">18:00 (Tarde)</SelectItem>
                        <SelectItem value="22:00">22:00 (Noite)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Dados Importados</p>
                        <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                          <li>• Contratos e Aditivos</li>
                          <li>• Liquidações</li>
                          <li>• Documentos Fiscais</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!importacaoAtiva && (
                <div className="py-4 text-center text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                  <p>Importação diária desativada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status e Informações */}
        <Card>
          <CardHeader>
            <CardTitle>Status dos Cron Jobs</CardTitle>
            <CardDescription>
              Estado atual das tarefas agendadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                    <p className="font-medium">Importação Diária (importar-esfinge-diario)</p>
                    <p className="text-sm text-muted-foreground">Executa todo dia às {horaImportacao}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Ativo
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                    <p className="font-medium">Envio Mensal (enviar-situacao-obras-mensal)</p>
                    <p className="text-sm text-muted-foreground">Executa dia {diaEnvioMensal} de cada mês às {horaEnvioMensal}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Ativo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <Button onClick={handleSalvarConfiguracoes} size="lg">
            <Settings className="mr-2 h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
