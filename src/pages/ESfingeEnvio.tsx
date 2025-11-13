import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ESfingeEnvio() {
  const { toast } = useToast();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [envioCompleto, setEnvioCompleto] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
      setEnvioCompleto(false);
    }
  };

  const handleEnviar = () => {
    if (!arquivo) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo XML para enviar",
        variant: "destructive"
      });
      return;
    }

    setEnviando(true);
    setProgresso(0);

    const interval = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setEnviando(false);
          setEnvioCompleto(true);
          toast({
            title: "Envio concluído",
            description: "Dados enviados com sucesso ao e-Sfinge TCE/SC",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Envio Manual</h1>
          <p className="text-muted-foreground">
            Envie arquivos XML manualmente ao e-Sfinge TCE/SC
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Upload de Arquivo</CardTitle>
                <CardDescription>
                  Selecione o arquivo XML exportado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="arquivo">Arquivo XML</Label>
                  <Input
                    id="arquivo"
                    type="file"
                    accept=".xml"
                    onChange={handleFileChange}
                    disabled={enviando}
                  />
                  {arquivo && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{arquivo.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuário TCE/SC</Label>
                  <Input
                    id="usuario"
                    type="text"
                    placeholder="Digite seu usuário"
                    disabled={enviando}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    disabled={enviando}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações (Opcional)</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Adicione observações sobre este envio..."
                    rows={3}
                    disabled={enviando}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleEnviar}
                  disabled={!arquivo || enviando}
                >
                  {enviando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar ao TCE/SC
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="lg:col-span-2 space-y-6">
            {enviando && (
              <Card>
                <CardHeader>
                  <CardTitle>Enviando Dados</CardTitle>
                  <CardDescription>
                    Aguarde enquanto os dados são transmitidos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso do envio</span>
                      <span>{progresso}%</span>
                    </div>
                    <Progress value={progresso} />
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Validando arquivo XML...</p>
                    <p>• Estabelecendo conexão segura...</p>
                    <p>• Transmitindo dados ao TCE/SC...</p>
                    <p>• Aguardando confirmação...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {envioCompleto && (
              <Card className="border-green-200 dark:border-green-900">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <CardTitle className="text-green-600">Envio Concluído</CardTitle>
                  </div>
                  <CardDescription>
                    Dados enviados com sucesso ao e-Sfinge
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Protocolo:</span>
                      <span className="font-mono">TCE-2024-000123</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Data/Hora:</span>
                      <span>15/01/2024 às 14:30:45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Registros:</span>
                      <span>45 registros processados</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-green-600 font-medium">Aprovado</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Baixar Comprovante
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Novo Arquivo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!enviando && !envioCompleto && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Instruções de Envio</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <p>
                        <strong>Exporte os dados</strong> através da página de Exportação e Validação
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <p>
                        <strong>Selecione o arquivo XML</strong> gerado na exportação
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <p>
                        <strong>Informe suas credenciais</strong> de acesso ao portal do TCE/SC
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <p>
                        <strong>Clique em Enviar</strong> e aguarde a confirmação
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <CardTitle className="text-yellow-900 dark:text-yellow-100">
                        Atenção
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                    <p>
                      • Certifique-se de que o arquivo foi validado antes do envio
                    </p>
                    <p>
                      • O envio pode levar alguns minutos dependendo do tamanho do arquivo
                    </p>
                    <p>
                      • Mantenha suas credenciais do TCE/SC em segurança
                    </p>
                    <p>
                      • Guarde o número do protocolo para consultas futuras
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
