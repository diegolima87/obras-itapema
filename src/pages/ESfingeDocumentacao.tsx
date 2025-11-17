import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Book, CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function ESfingeDocumentacao() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Documentação TCE/SC 2025</h1>
            <p className="text-muted-foreground">
              Layout oficial e especificações de campos para integração e-Sfinge
            </p>
          </div>
        </div>

        <Alert>
          <Book className="h-4 w-4" />
          <AlertDescription>
            Esta documentação está alinhada com o <strong>Manual de Integração TCE/SC - Layout versão 2.0.0</strong>.
            Última atualização: Janeiro/2025
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="contratos" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
            <TabsTrigger value="medicoes">Medições</TabsTrigger>
            <TabsTrigger value="situacao_obra">Situação de Obra</TabsTrigger>
            <TabsTrigger value="liquidacoes">Liquidações</TabsTrigger>
          </TabsList>

          {/* CONTRATOS */}
          <TabsContent value="contratos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Layout de Contratos - TCE/SC 2025</CardTitle>
                <CardDescription>
                  Estrutura de dados para envio de contratos ao e-Sfinge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-semibold mb-2">Informações Gerais</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Tipo de envio: <code className="bg-background px-1 rounded">contrato</code></li>
                    <li>• Formato: JSON estruturado conforme schema TCE/SC</li>
                    <li>• Endpoint: <code className="bg-background px-1 rounded">https://esfinge.tce.sc.gov.br/api/v2/contratos</code></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Campos Obrigatórios
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">exercicio</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>Ano do exercício fiscal (ex: 2025)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">numero_contrato</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>max 50</TableCell>
                        <TableCell>Número único do contrato</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">modalidade_licitacao</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>max 10</TableCell>
                        <TableCell>Código: PE, CC, TP, DL, IN, etc.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">numero_processo</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>max 50</TableCell>
                        <TableCell>Número do processo licitatório</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">objeto</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>10-8000</TableCell>
                        <TableCell>Descrição detalhada do objeto</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">tipo_objeto</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>O=Obra, S=Serviço, C=Compra</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">data_assinatura</TableCell>
                        <TableCell><Badge variant="secondary">date</Badge></TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>Formato: YYYY-MM-DD</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">data_inicio_vigencia</TableCell>
                        <TableCell><Badge variant="secondary">date</Badge></TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>Data início do contrato</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">data_fim_vigencia</TableCell>
                        <TableCell><Badge variant="secondary">date</Badge></TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>Data fim do contrato</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">valor_inicial</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>Valor original (decimal, min: 0.01)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">valor_atualizado</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>Valor com aditivos</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">contratado.tipo_pessoa</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>J=Jurídica, F=Física</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">contratado.cpf_cnpj</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>11 ou 14</TableCell>
                        <TableCell>CPF (11 dígitos) ou CNPJ (14 dígitos)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">contratado.nome_razao_social</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>3-200</TableCell>
                        <TableCell>Nome ou razão social</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Modalidades de Licitação
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">PE</code>
                      <span>Pregão Eletrônico</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">PP</code>
                      <span>Pregão Presencial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">CC</code>
                      <span>Concorrência</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">TP</code>
                      <span>Tomada de Preços</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">DL</code>
                      <span>Dispensa de Licitação</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-background px-2 py-1 rounded">IN</code>
                      <span>Inexigibilidade</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MEDIÇÕES */}
          <TabsContent value="medicoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Layout de Medições - TCE/SC 2025</CardTitle>
                <CardDescription>
                  Estrutura de dados para envio de medições ao e-Sfinge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Importante:</strong> Apenas medições com status "Aprovado" devem ser enviadas ao TCE/SC
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="font-semibold mb-3">Campos Obrigatórios</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">exercicio</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>Ano do exercício fiscal</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">numero_contrato</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>max 50</TableCell>
                        <TableCell>Referência ao contrato</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">numero_medicao</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>max 50</TableCell>
                        <TableCell>Número sequencial ou único</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">mes_competencia</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>7</TableCell>
                        <TableCell>Formato: YYYY-MM</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">data_medicao</TableCell>
                        <TableCell><Badge variant="secondary">date</Badge></TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>Data da medição</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">valor_medido</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>Valor desta medição</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">percentual_executado</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>0 a 100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">situacao</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>P=Pendente, A=Aprovada, R=Rejeitada, C=Cancelada</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SITUAÇÃO DE OBRA */}
          <TabsContent value="situacao_obra" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Layout de Situação de Obra - TCE/SC 2025</CardTitle>
                <CardDescription>
                  Estrutura de dados para envio mensal de situação de obras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Este layout deve ser enviado <strong>mensalmente</strong> para todas as obras ativas
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="font-semibold mb-3">Campos Obrigatórios</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">codigo_obra</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>Código único da obra</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">mes_referencia</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>Mês de referência (YYYY-MM)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">nome</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>Nome da obra (5-500 chars)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">descricao</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>Descrição detalhada (10-8000 chars)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">municipio</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>Nome do município</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">uf</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>SC (Santa Catarina)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">situacao</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>P=Planejada, A=Andamento, C=Concluída, S=Suspensa</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">valor_previsto</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>Valor total previsto</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">percentual_fisico</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>Percentual físico executado (0-100)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LIQUIDAÇÕES */}
          <TabsContent value="liquidacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Layout de Liquidações - TCE/SC 2025</CardTitle>
                <CardDescription>
                  Estrutura de dados importados do e-Sfinge para liquidações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Liquidações são <strong>importadas</strong> do e-Sfinge automaticamente através da integração
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="font-semibold mb-3">Campos Principais</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">numero_empenho</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>Número do empenho</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">numero_liquidacao</TableCell>
                        <TableCell><Badge variant="secondary">string</Badge></TableCell>
                        <TableCell>Número da liquidação</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">data_liquidacao</TableCell>
                        <TableCell><Badge variant="secondary">date</Badge></TableCell>
                        <TableCell>Data da liquidação (YYYY-MM-DD)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">valor_liquidado</TableCell>
                        <TableCell><Badge variant="secondary">number</Badge></TableCell>
                        <TableCell>Valor liquidado</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Referências e Links Úteis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Documentação</Badge>
              <a 
                href="https://esfinge.tce.sc.gov.br/documentacao" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Manual de Integração e-Sfinge TCE/SC
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Portal</Badge>
              <a 
                href="https://esfinge.tce.sc.gov.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Portal e-Sfinge TCE/SC
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Suporte</Badge>
              <span className="text-sm text-muted-foreground">esfinge@tce.sc.gov.br</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
