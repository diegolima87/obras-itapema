import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectWrapper } from "@/components/ui/select-wrapper";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FiltrosObras } from "@/hooks/useObrasComFiltros";

interface FiltrosAvancadosProps {
  filtros: FiltrosObras;
  onFiltrosChange: (filtros: FiltrosObras) => void;
  bairrosDisponiveis: string[];
  cidadesDisponiveis: string[];
  statusDisponiveis: string[];
  tiposDisponiveis: string[];
}

const statusLabels: Record<string, string> = {
  planejada: "Planejada",
  andamento: "Em Andamento",
  concluida: "Concluída",
  paralisada: "Paralisada",
};

export function FiltrosAvancados({
  filtros,
  onFiltrosChange,
  bairrosDisponiveis,
  cidadesDisponiveis,
  statusDisponiveis,
  tiposDisponiveis,
}: FiltrosAvancadosProps) {
  const handleLimparFiltros = () => {
    onFiltrosChange({});
  };

  const temFiltrosAtivos = Object.keys(filtros).length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Filtros Avançados</CardTitle>
        {temFiltrosAtivos && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLimparFiltros}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <SelectWrapper
            value={filtros.cidade || ""}
            onValueChange={(value) =>
              onFiltrosChange({ ...filtros, cidade: value || undefined })
            }
            placeholder="Todas as cidades"
            options={cidadesDisponiveis.map((c) => ({ value: c, label: c }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bairro">Bairro</Label>
          <SelectWrapper
            value={filtros.bairro || ""}
            onValueChange={(value) =>
              onFiltrosChange({ ...filtros, bairro: value || undefined })
            }
            placeholder="Todos os bairros"
            options={bairrosDisponiveis.map((b) => ({ value: b, label: b }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <SelectWrapper
            value={filtros.status || ""}
            onValueChange={(value) =>
              onFiltrosChange({ ...filtros, status: value || undefined })
            }
            placeholder="Todos os status"
            options={statusDisponiveis.map((s) => ({
              value: s,
              label: statusLabels[s] || s,
            }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Obra</Label>
          <SelectWrapper
            value={filtros.tipo_obra || ""}
            onValueChange={(value) =>
              onFiltrosChange({ ...filtros, tipo_obra: value || undefined })
            }
            placeholder="Todos os tipos"
            options={tiposDisponiveis.map((t) => ({ value: t, label: t }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor_min">Valor Mínimo</Label>
          <Input
            id="valor_min"
            type="number"
            placeholder="R$ 0,00"
            value={filtros.valor_min || ""}
            onChange={(e) =>
              onFiltrosChange({
                ...filtros,
                valor_min: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor_max">Valor Máximo</Label>
          <Input
            id="valor_max"
            type="number"
            placeholder="R$ 1.000.000,00"
            value={filtros.valor_max || ""}
            onChange={(e) =>
              onFiltrosChange({
                ...filtros,
                valor_max: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
