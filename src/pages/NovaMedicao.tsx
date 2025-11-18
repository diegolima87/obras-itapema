import { useState, ChangeEvent, DragEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrencyInput, parseCurrency } from "@/lib/utils";
import { useCriarMedicao } from "@/hooks/useMedicoes";
import { useUploadDocumento } from "@/hooks/useUploadDocumento";
import { useObras } from "@/hooks/useObras";

export default function NovaMedicao() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: obras } = useObras();
  const criarMedicao = useCriarMedicao();
  const uploadDocumento = useUploadDocumento();

  const [formData, setFormData] = useState({
    obra_id: "",
    periodo_inicio: "",
    periodo_fim: "",
    valor_medicao: 0,
    percentual_executado: 0,
    observacoes: "",
  });

  const [valorDisplay, setValorDisplay] = useState("R$ 0,00");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);

  const validateAndAddFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de arquivo inválido",
          description: `${file.name} não é um tipo permitido (PDF, JPG, PNG, WEBP)`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o tamanho máximo de 10MB`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files);
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.obra_id) {
      toast({
        title: "Erro",
        description: "Selecione uma obra",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Buscar contrato e fornecedor da obra selecionada
      const obraSelecionada = obras?.find(o => o.id === formData.obra_id);
      if (!obraSelecionada) {
        throw new Error("Obra não encontrada");
      }

      // Aqui você precisa buscar o contrato e fornecedor vinculados à obra
      // Por enquanto, vou usar valores mock - você precisa ajustar isso
      const contratoId = "temp-contrato-id"; // TODO: Buscar do banco
      const fornecedorId = "temp-fornecedor-id"; // TODO: Buscar do banco

      // Criar a medição
      const novaMedicao = await criarMedicao.mutateAsync({
        numero_medicao: `MED-${Date.now()}`, // Gerar número automático
        obra_id: formData.obra_id,
        contrato_id: contratoId,
        fornecedor_id: fornecedorId,
        valor_medido: formData.valor_medicao,
        percentual_executado: formData.percentual_executado,
        observacoes: formData.observacoes,
        competencia: formData.periodo_fim,
        status: "pendente",
      } as any);

      // Fazer upload dos documentos se houver
      if (selectedFiles.length > 0 && novaMedicao?.id) {
        setIsUploadingDocs(true);
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          toast({
            title: `Enviando documento ${i + 1} de ${selectedFiles.length}...`,
          });
          
          await uploadDocumento.mutateAsync({
            file,
            medicaoId: novaMedicao.id,
            tipo: "medicao",
            bucketName: "documentos_medicoes",
          });
        }
        
        setIsUploadingDocs(false);
      }

      toast({
        title: "Medição criada!",
        description: "A medição foi cadastrada com sucesso",
      });
      
      navigate(`/medicoes/${novaMedicao.id}`);
    } catch (error: any) {
      toast({
        title: "Erro ao criar medição",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsUploadingDocs(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/medicoes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nova Medição</h1>
            <p className="text-muted-foreground">Registre uma nova medição de obra</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Medição</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="obra_id">Obra *</Label>
                    <Select
                      value={formData.obra_id}
                      onValueChange={(value) => setFormData({ ...formData, obra_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a obra" />
                      </SelectTrigger>
                      <SelectContent>
                        {obras?.map((obra) => (
                          <SelectItem key={obra.id} value={obra.id}>
                            {obra.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodo_inicio">Período - Início *</Label>
                    <Input
                      id="periodo_inicio"
                      type="date"
                      value={formData.periodo_inicio}
                      onChange={(e) => setFormData({ ...formData, periodo_inicio: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodo_fim">Período - Fim *</Label>
                    <Input
                      id="periodo_fim"
                      type="date"
                      value={formData.periodo_fim}
                      onChange={(e) => setFormData({ ...formData, periodo_fim: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor_medicao">Valor da Medição (R$) *</Label>
                    <Input
                      id="valor_medicao"
                      type="text"
                      placeholder="R$ 0,00"
                      value={valorDisplay}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setValorDisplay(formatted);
                        setFormData({ ...formData, valor_medicao: parseCurrency(formatted) });
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percentual_executado">Percentual Executado (%) *</Label>
                    <Input
                      id="percentual_executado"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={formData.percentual_executado}
                      onChange={(e) => setFormData({ ...formData, percentual_executado: parseFloat(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      placeholder="Informações adicionais sobre a medição"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fotos e Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors"
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste arquivos ou clique para selecionar
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      PDF, JPG, PNG, WEBP (máx. 10MB por arquivo)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-input-medicao"
                    />
                    <label htmlFor="file-input-medicao">
                      <Button type="button" variant="outline" asChild>
                        <span>Selecionar Arquivos</span>
                      </Button>
                    </label>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Arquivos selecionados ({selectedFiles.length})</Label>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || isUploadingDocs}>
                <Save className="mr-2 h-4 w-4" />
                {isUploadingDocs 
                  ? "Enviando documentos..." 
                  : loading 
                    ? "Salvando..." 
                    : "Salvar Medição"}
              </Button>
              <Link to="/medicoes">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
