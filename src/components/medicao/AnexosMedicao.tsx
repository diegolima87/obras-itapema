import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectWrapper } from "@/components/ui/select-wrapper";
import { useAnexosMedicao, useUploadAnexoMedicao, useDeletarAnexoMedicao } from "@/hooks/useAnexosMedicao";
import { Loader2, Upload, FileText, Image, Video, Trash2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnexosMedicaoProps {
  medicaoId: string;
  readOnly?: boolean;
}

const tipoOptions = [
  { value: "foto", label: "Foto" },
  { value: "video", label: "Vídeo" },
  { value: "diario_obra", label: "Diário de Obra" },
  { value: "documento_tecnico", label: "Documento Técnico" },
];

const tipoIcons = {
  foto: Image,
  video: Video,
  diario_obra: FileText,
  documento_tecnico: FileText,
};

export function AnexosMedicao({ medicaoId, readOnly = false }: AnexosMedicaoProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState<string>("foto");
  const [descricao, setDescricao] = useState("");

  const { data: anexos, isLoading } = useAnexosMedicao(medicaoId);
  const uploadMutation = useUploadAnexoMedicao();
  const deleteMutation = useDeletarAnexoMedicao();

  const handleUpload = async () => {
    if (!file || !tipo) return;

    await uploadMutation.mutateAsync({
      medicaoId,
      file,
      tipo: tipo as any,
      descricao,
    });

    setFile(null);
    setDescricao("");
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anexos da Medição</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!readOnly && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Anexo</Label>
              <SelectWrapper
                value={tipo}
                onValueChange={setTipo}
                options={tipoOptions}
                placeholder="Selecione o tipo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arquivo">Arquivo</Label>
              <Input
                id="arquivo"
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o anexo..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || uploadMutation.isPending}
              className="w-full"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Anexo
                </>
              )}
            </Button>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">
            Anexos ({anexos?.length || 0})
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : anexos && anexos.length > 0 ? (
            <div className="space-y-2">
              {anexos.map((anexo) => {
                const Icon = tipoIcons[anexo.tipo];
                return (
                  <div
                    key={anexo.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {anexo.nome_original || "Anexo"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {tipoOptions.find((t) => t.value === anexo.tipo)?.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(anexo.tamanho)}
                            </span>
                          </div>
                          {anexo.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {anexo.descricao}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(anexo.url, "_blank")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {!readOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => deleteMutation.mutate(anexo.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Nenhum anexo adicionado ainda.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
