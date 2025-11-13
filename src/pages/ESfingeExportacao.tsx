import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ESfingeExportacao() {
  const { toast } = useToast();
  const [tipoExportacao, setTipoExportacao] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [validando, setValidando] = useState(false);
  const [validacaoCompleta, setValidacaoCompleta] = useState(false);

  const [opcoes, setOpcoes] = useState({
    incluirAnexos: true,
    validarCampos: true,
    gerarRelatorio: true
  });

  const validacaoResultados = {
    obras: { total: 45, validos: 43, erros: 2 },
    contratos: { total: 23, validos: 23, erros: 0 },
    medicoes: { total: 67, validos: 65, erros: 2 },
    fornecedores: { total: 34, validos: 34, erros: 0 }
  };

  const handleValidar = () => {
    setValidando(true);
    
    setTimeout(() => {
      setValidando(false);
      setValidacaoCompleta(true);
      
      toast({
        title: "Validação concluída",
        description: "Encontrados 4 registros com problemas que precisam ser corrigidos.",
      });
    }, 2000);
  };

  const handleExportar = () => {
    toast({
      title: "Exportação iniciada",
      description: "O arquivo será baixado em instantes.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exportação e Validação</h1>
          <p className="text-muted-foreground">
            Exporte e valide dados antes de enviar ao e-Sfinge TCE/SC
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Selecione os dados para exportação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Dados</Label>
                  <Select value={tipoExportacao} onValueChange={setTipoExportacao}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="obras">Obras</SelectItem>
                      <SelectItem value="contratos">Contratos</SelectItem>
                      <SelectItem value="medicoes">Medições</SelectItem>
                      <SelectItem value="fornecedores">Fornecedores</SelectItem>
                      <SelectItem value="todos">Todos os Dados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Período de Referência</Label>
                  <Select value={periodo} onValueChange={setPeriodo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mes-atual">Mês Atual</SelectItem>
                      <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
                      <SelectItem value="trimestre">Último Trimestre</SelectItem>
                      <SelectItem value="semestre">Último Semestre</SelectItem>
                      <SelectItem value="ano">Ano Atual</SelectItem>
                      <SelectItem value="personalizado">Período Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anexos"
                      checked={opcoes.incluirAnexos}
                      onCheckedChange={(checked) => 
                        setOpcoes({...opcoes, incluirAnexos: checked as boolean})
                      }
                    />
                    <Label htmlFor="anexos" className="text-sm font-normal cursor-pointer">
                      Incluir anexos e documentos
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="validar"
                      checked={opcoes.validarCampos}
                      onCheckedChange={(checked) => 
                        setOpcoes({...opcoes, validarCampos: checked as boolean})
                      }
                    />
                    <Label htmlFor="validar" className="text-sm font-normal cursor-pointer">
                      Validar campos obrigatórios
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="relatorio"
                      checked={opcoes.gerarRelatorio}
                      onCheckedChange={(checked) => 
                        setOpcoes({...opcoes, gerarRelatorio: checked as boolean})
                      }
                    />
                    <Label htmlFor="relatorio" className="text-sm font-normal cursor-pointer">
                      Gerar relatório de validação
                    </Label>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={handleValidar}
                    disabled={!tipoExportacao || !periodo || validando}
                  >
                    {validando ? (
                      <>
                        <Calendar className="mr-2 h-4 w-4 animate-spin" />
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
                    variant="outline" 
                    className="w-full"
                    onClick={handleExportar}
                    disabled={!validacaoCompleta}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar XML
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {validacaoCompleta && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Resultado da Validação</CardTitle>
                    <CardDescription>
                      Resumo dos dados validados para {tipoExportacao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(validacaoResultados).map(([tipo, dados]) => (
                        <div key={tipo} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold capitalize">{tipo}</h3>
                            <Badge variant={dados.erros > 0 ? "destructive" : "default"}>
                              {dados.validos}/{dados.total}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>{dados.validos} registros válidos</span>
                            </div>
                            {dados.erros > 0 && (
                              <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>{dados.erros} registros com erros</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {validacaoResultados.obras.erros > 0 && (
                  <Card className="border-red-200 dark:border-red-900">
                    <CardHeader>
                      <CardTitle className="text-red-600">Erros Encontrados</CardTitle>
                      <CardDescription>
                        Corrija os erros abaixo antes de exportar
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-900 dark:text-red-100">
                                Obra: Pavimentação Rua das Flores
                              </p>
                              <p className="text-sm text-red-700 dark:text-red-300">
                                Campo obrigatório "Data de Início" não preenchido
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-900 dark:text-red-100">
                                Medição: Medição 03/2024 - Praça Central
                              </p>
                              <p className="text-sm text-red-700 dark:text-red-300">
                                Valor da medição excede valor do contrato
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Passos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      <span>1. Corrija os erros apontados na validação</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>2. Exporte o arquivo XML com os dados validados</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>3. Envie o arquivo através da página de Envio Manual</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!validacaoCompleta && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileSpreadsheet className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Configure as opções e clique em "Validar Dados" para iniciar
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
