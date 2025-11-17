import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Image as ImageIcon, Trash2, Loader2, Eye } from "lucide-react";
import { useDocumentos } from "@/hooks/useDocumentos";
import { useDeleteDocumento } from "@/hooks/useDeleteDocumento";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentoListaProps {
  obraId?: string;
  contratoId?: string;
  medicaoId?: string;
  fornecedorId?: string;
  showDelete?: boolean;
}

export function DocumentoLista({
  obraId,
  contratoId,
  medicaoId,
  fornecedorId,
  showDelete = false,
}: DocumentoListaProps) {
  const { data: documentos, isLoading } = useDocumentos({
    obraId,
    contratoId,
    medicaoId,
    fornecedorId,
  });
  const { mutate: deleteDocumento, isPending: isDeleting } = useDeleteDocumento();

  const getIcon = (mimeType: string | null) => {
    if (mimeType?.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-orange-500" />;
  };

  const getTipoBadge = (tipo: string) => {
    const tipos: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      contrato: { label: "Contrato", variant: "default" },
      aditivo: { label: "Aditivo", variant: "secondary" },
      medicao: { label: "Medição", variant: "outline" },
      pagamento: { label: "Pagamento", variant: "default" },
      projeto: { label: "Projeto/Técnico", variant: "secondary" },
      foto: { label: "Foto", variant: "outline" },
      outro: { label: "Outro", variant: "secondary" },
    };

    const tipoConfig = tipos[tipo] || { label: tipo, variant: "secondary" };
    return <Badge variant={tipoConfig.variant}>{tipoConfig.label}</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getBucketName = (tipo: string): string => {
    if (tipo === 'foto_obra') return 'fotos_obras';
    if (contratoId) return 'documentos_contratos';
    if (medicaoId) return 'documentos_medicoes';
    return 'documentos_obras';
  };

  const handleDelete = (documentoId: string, tipo: string, filePath: string) => {
    deleteDocumento({
      documentoId,
      bucketName: getBucketName(tipo),
      filePath,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!documentos || documentos.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum documento anexado ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Anexados ({documentos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documentos.map((doc) => {
            const fileName = doc.nome_original || doc.nome;
            const fileUrl = doc.arquivo_url || doc.url;
            const filePath = doc.arquivo_path || '';
            
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getIcon(doc.mime_type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fileName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{formatFileSize(doc.tamanho)}</span>
                      <span>•</span>
                      <span>{format(new Date(doc.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                    </div>
                  </div>
                  {getTipoBadge(doc.tipo)}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Visualizar arquivo"
                  >
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Baixar arquivo"
                  >
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  {showDelete && filePath && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isDeleting}
                          title="Excluir arquivo"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O arquivo será permanentemente removido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(doc.id, doc.tipo, filePath)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
