import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ItensMedicao } from "@/components/medicao/ItensMedicao";
import { AnexosMedicao } from "@/components/medicao/AnexosMedicao";
import { 
  useMedicao, 
  useEnviarMedicao, 
  useAprovarMedicao, 
  useReprovarMedicao 
} from "@/hooks/useMedicao";
import { useAuth } from "@/hooks/useAuth";
import { 
  AlertCircle, 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Building2,
  FileText,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  analise: "Em Análise",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-500",
  analise: "bg-blue-500",
  aprovado: "bg-green-500",
  reprovado: "bg-red-500",
};

export default function MedicaoDetalhesCompleto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [motivoReprovacao, setMotivoReprovacao] = useState("");
  const [dialogReprovarAberto, setDialogReprovarAberto] = useState(false);

  const { data: medicao, isLoading, error } = useMedicao(id!);
  const enviarMutation = useEnviarMedicao();
  const aprovarMutation = useAprovarMedicao();
  const reprovarMutation = useReprovarMedicao();

  const handleEnviar = async () => {
    if (confirm("Deseja enviar esta medição para análise?")) {
      await enviarMutation.mutateAsync(id!);
    }
  };

  const handleAprovar = async () => {
    if (confirm("Deseja aprovar esta medição?")) {
      await aprovarMutation.mutateAsync(id!);
    }
  };

  const handleReprovar = async () => {
    if (!motivoReprovacao.trim()) {
      alert("Por favor, informe o motivo da reprovação");
      return;
    }

    await reprovarMutation.mutateAsync({
      medicaoId: id!,
      motivo: motivoReprovacao,
    });

    setDialogReprovarAberto(false);
    setMotivoReprovacao("");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </MainLayout>
    );
  }

  if (error || !medicao) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar medição: {error?.message || "Medição não encontrada"}
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const isReadOnly = medicao.status === "aprovado" || medicao.status === "reprovado";
  const podeFornecedorEditar = medicao.status === "pendente";
  const podeAprovar = medicao.status === "analise";

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                Medição #{medicao.numero_medicao}
              </h1>
              <p className="text-muted-foreground">
                {medicao.obra?.nome}
              </p>
            </div>
          </div>
          <Badge className={statusColors[medicao.status]}>
            {statusLabels[medicao.status]}
          </Badge>
        </div>

        {/* Card de Informações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Medição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Obra</span>
                </div>
                <p className="font-semibold">{medicao.obra?.nome}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Contrato</span>
                </div>
                <p className="font-semibold">{medicao.contrato?.numero}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Competência</span>
                </div>
                <p className="font-semibold">
                  {medicao.competencia 
                    ? new Date(medicao.competencia).toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Não informada"}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Valor Medido</span>
                </div>
                <p className="font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(medicao.valor_medido || 0)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Percentual Físico</span>
                </div>
                <p className="font-semibold">{medicao.percentual_fisico || 0}%</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Percentual Financeiro</span>
                </div>
                <p className="font-semibold">{medicao.percentual_financeiro || 0}%</p>
              </div>
            </div>

            {medicao.descricao && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                  <p>{medicao.descricao}</p>
                </div>
              </>
            )}

            {medicao.observacoes && medicao.status === "reprovado" && (
              <>
                <Separator className="my-4" />
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Motivo da Reprovação:</strong>
                    <p className="mt-2">{medicao.observacoes}</p>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>
        </Card>

        {/* Itens da Medição */}
        <ItensMedicao medicaoId={id!} readOnly={isReadOnly || !podeFornecedorEditar} />

        {/* Anexos */}
        <AnexosMedicao medicaoId={id!} readOnly={isReadOnly} />

        {/* Ações */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 justify-between items-center">
              {medicao.status === "aprovado" && (
                <Link to={`/integracao-tce/medicao/${id}`}>
                  <Button variant="outline" size="lg">
                    <FileText className="mr-2 h-5 w-5" />
                    Enviar ao TCE/e-Sfinge
                  </Button>
                </Link>
              )}
              
              <div className="flex flex-wrap gap-4 ml-auto">
                {podeFornecedorEditar && (
                <Button
                  onClick={handleEnviar}
                  disabled={enviarMutation.isPending}
                  size="lg"
                >
                  {enviarMutation.isPending ? (
                    <>
                      <Send className="mr-2 h-5 w-5 animate-pulse" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar para Análise
                    </>
                  )}
                </Button>
              )}

              {podeAprovar && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => setDialogReprovarAberto(true)}
                    disabled={reprovarMutation.isPending}
                    size="lg"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reprovar
                  </Button>

                  <Button
                    onClick={handleAprovar}
                    disabled={aprovarMutation.isPending}
                    size="lg"
                  >
                    {aprovarMutation.isPending ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5 animate-pulse" />
                        Aprovando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Aprovar Medição
                      </>
                    )}
                  </Button>
                </>
              )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Reprovação */}
      <Dialog open={dialogReprovarAberto} onOpenChange={setDialogReprovarAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Medição</DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação da medição. Esta informação será
              enviada ao fornecedor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Descreva o motivo da reprovação..."
              value={motivoReprovacao}
              onChange={(e) => setMotivoReprovacao(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogReprovarAberto(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReprovar}
              disabled={!motivoReprovacao.trim() || reprovarMutation.isPending}
            >
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
