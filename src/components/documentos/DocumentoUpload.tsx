import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { useUploadDocumento } from "@/hooks/useUploadDocumento";

interface DocumentoUploadProps {
  bucketName: string;
  tipo: string;
  obraId?: string;
  contratoId?: string;
  medicaoId?: string;
  fornecedorId?: string;
  allowedTypes?: string;
  maxSize?: string;
}

export function DocumentoUpload({
  bucketName,
  tipo,
  obraId,
  contratoId,
  medicaoId,
  fornecedorId,
  allowedTypes = ".pdf,.doc,.docx,.xls,.xlsx",
  maxSize = "10MB",
}: DocumentoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: uploadDocumento, isPending } = useUploadDocumento();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    uploadDocumento({
      file: selectedFile,
      tipo,
      bucketName,
      obraId,
      contratoId,
      medicaoId,
      fornecedorId,
    }, {
      onSuccess: () => {
        setSelectedFile(null);
        // Reset input
        const input = document.getElementById('file-input') as HTMLInputElement;
        if (input) input.value = '';
      }
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <Upload className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Arraste um arquivo ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground">
            Formatos aceitos: {allowedTypes} • Tamanho máximo: {maxSize}
          </p>
        </div>
        <input
          id="file-input"
          type="file"
          accept={allowedTypes}
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-input">
          <Button variant="outline" asChild>
            <span>Selecionar Arquivo</span>
          </Button>
        </label>
        {selectedFile && (
          <div className="w-full space-y-2">
            <p className="text-sm font-medium">
              Arquivo selecionado: {selectedFile.name}
            </p>
            <Button
              onClick={handleUpload}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Documento
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
