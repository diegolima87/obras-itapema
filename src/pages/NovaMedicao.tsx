import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NovaMedicao() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    obra_id: "",
    periodo_inicio: "",
    periodo_fim: "",
    valor_medicao: 0,
    percentual_executado: 0,
    observacoes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast({
        title: "Medição criada!",
        description: "A medição foi cadastrada com sucesso",
      });
      setLoading(false);
      navigate("/medicoes");
    }, 1000);
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
                        <SelectItem value="1">Construção de Ponte sobre o Rio Verde</SelectItem>
                        <SelectItem value="2">Pavimentação da Rua das Flores</SelectItem>
                        <SelectItem value="3">Reforma do Centro Cultural</SelectItem>
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
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.valor_medicao}
                      onChange={(e) => setFormData({ ...formData, valor_medicao: parseFloat(e.target.value) })}
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
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste arquivos ou clique para selecionar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fotos e documentos da medição (máx. 10MB por arquivo)
                    </p>
                    <Button type="button" variant="outline" className="mt-4">
                      Selecionar Arquivos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Salvando..." : "Salvar Medição"}
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
