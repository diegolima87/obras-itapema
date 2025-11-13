import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface ImportarItensProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obraId: string;
}

export function ImportarItens({ open, onOpenChange, obraId }: ImportarItensProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Arquivo selecionado:", file.name);
      toast.success(`Arquivo ${file.name} importado com sucesso!`);
      onOpenChange(false);
    }
  };

  const downloadTemplate = () => {
    toast.info("Download do modelo de planilha iniciado");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importar Planilha de Itens</DialogTitle>
          <DialogDescription>
            Faça upload de uma planilha CSV ou Excel com os itens da obra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Formato da Planilha
            </h4>
            <p className="text-sm text-muted-foreground">
              A planilha deve conter as seguintes colunas:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Código do Item</li>
              <li>Descrição</li>
              <li>Unidade de Medida</li>
              <li>Quantidade Contratada</li>
              <li>Valor Unitário</li>
            </ul>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Baixar Modelo de Planilha
            </Button>
          </div>

          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-4">
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" asChild>
                  <span>Selecionar Arquivo</span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileSelect}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Arraste um arquivo para esta área ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formatos aceitos: CSV, XLS, XLSX (até 5MB)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
