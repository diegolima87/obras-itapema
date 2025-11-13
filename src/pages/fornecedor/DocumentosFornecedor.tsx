import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, LogOut, ArrowLeft, Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DocumentosFornecedor() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const fornecedor = {
    nome: "Construtora ABC Ltda",
    cnpj: "12.345.678/0001-90",
  };

  const documentosObrigatorios = [
    {
      id: 1,
      nome: "Certidão Negativa de Débitos Federais (CND Federal)",
      status: "valido",
      vencimento: "2025-08-15",
      arquivo: "CND_Federal_2025.pdf",
      data_upload: "2024-08-10",
    },
    {
      id: 2,
      nome: "Certidão Negativa de Débitos Estaduais (CND Estadual)",
      status: "proximo_vencimento",
      vencimento: "2025-02-15",
      arquivo: "CND_Estadual_2024.pdf",
      data_upload: "2024-08-10",
    },
    {
      id: 3,
      nome: "Certidão Negativa de Débitos Municipais (CND Municipal)",
      status: "vencido",
      vencimento: "2025-01-10",
      arquivo: "CND_Municipal_2024.pdf",
      data_upload: "2024-07-05",
    },
    {
      id: 4,
      nome: "Certidão Negativa de Débitos Trabalhistas (CNDT)",
      status: "valido",
      vencimento: "2025-10-20",
      arquivo: "CNDT_2025.pdf",
      data_upload: "2024-10-15",
    },
    {
      id: 5,
      nome: "Certificado de Regularidade do FGTS (CRF)",
      status: "pendente",
      vencimento: null,
      arquivo: null,
      data_upload: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valido":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Válido
          </Badge>
        );
      case "proximo_vencimento":
        return (
          <Badge className="bg-orange-500">
            <AlertCircle className="h-3 w-3 mr-1" />
            Próximo ao Vencimento
          </Badge>
        );
      case "vencido":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Vencido
          </Badge>
        );
      case "pendente":
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pendente de Envio
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDiasVencimento = (vencimento: string | null) => {
    if (!vencimento) return null;
    const hoje = new Date();
    const dataVencimento = new Date(vencimento);
    const diffTime = dataVencimento.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleUpload = (documentoId: number) => {
    setUploading(true);
    setTimeout(() => {
      toast({
        title: "Documento enviado!",
        description: "O documento foi enviado e está em análise",
      });
      setUploading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">{fornecedor.nome}</h1>
                <p className="text-sm text-muted-foreground">CNPJ: {fornecedor.cnpj}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/fornecedor/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Documentos Obrigatórios</h2>
            <p className="text-muted-foreground">Mantenha seus documentos atualizados para participar de licitações</p>
          </div>

          {/* Alertas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Documentos Válidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {documentosObrigatorios.filter((d) => d.status === "valido").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Próximos ao Vencimento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  {documentosObrigatorios.filter((d) => d.status === "proximo_vencimento").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Vencidos ou Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  {
                    documentosObrigatorios.filter((d) => d.status === "vencido" || d.status === "pendente")
                      .length
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Documentos */}
          <div className="space-y-4">
            {documentosObrigatorios.map((doc) => {
              const diasVencimento = getDiasVencimento(doc.vencimento);
              return (
                <Card key={doc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6 text-primary" />
                            <div>
                              <h3 className="font-semibold">{doc.nome}</h3>
                              {doc.arquivo && (
                                <p className="text-sm text-muted-foreground">
                                  Arquivo: {doc.arquivo}
                                </p>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(doc.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {doc.vencimento && (
                            <div>
                              <p className="text-muted-foreground">Vencimento</p>
                              <p className="font-medium">
                                {new Date(doc.vencimento).toLocaleDateString("pt-BR")}
                                {diasVencimento !== null && (
                                  <span
                                    className={`ml-2 ${
                                      diasVencimento < 0
                                        ? "text-red-600"
                                        : diasVencimento <= 30
                                        ? "text-orange-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    ({diasVencimento < 0 ? "vencido há" : "vence em"}{" "}
                                    {Math.abs(diasVencimento)} dias)
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                          {doc.data_upload && (
                            <div>
                              <p className="text-muted-foreground">Data de Upload</p>
                              <p className="font-medium">
                                {new Date(doc.data_upload).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {doc.arquivo && (
                          <Button variant="outline" size="sm">
                            Baixar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          disabled={uploading}
                          onClick={() => handleUpload(doc.id)}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {doc.arquivo ? "Atualizar" : "Enviar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle>
                <AlertCircle className="h-5 w-5 inline mr-2" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Os documentos devem estar em formato PDF com no máximo 5MB</p>
              <p>• Certifique-se de que as certidões estão legíveis e dentro do prazo de validade</p>
              <p>• Documentos vencidos ou pendentes impedem o envio de novas medições</p>
              <p>• Você receberá notificações por email 30 dias antes do vencimento</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
