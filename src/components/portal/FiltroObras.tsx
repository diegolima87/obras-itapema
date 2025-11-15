import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { SelectWrapper } from "@/components/ui/select-wrapper";

interface FiltroObrasProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  tipoFilter: string;
  onTipoChange: (value: string) => void;
}

export function FiltroObras({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  tipoFilter,
  onTipoChange,
}: FiltroObrasProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nome ou descrição da obra..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <SelectWrapper
              value={statusFilter}
              onValueChange={onStatusChange}
              placeholder="Todos os status"
              options={[
                { value: "todos", label: "Todos os status" },
                { value: "planejada", label: "Planejada" },
                { value: "andamento", label: "Em Andamento" },
                { value: "concluida", label: "Concluída" },
                { value: "paralisada", label: "Paralisada" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Obra</Label>
            <SelectWrapper
              value={tipoFilter}
              onValueChange={onTipoChange}
              placeholder="Todos os tipos"
              options={[
                { value: "todos", label: "Todos os tipos" },
                { value: "Infraestrutura", label: "Infraestrutura" },
                { value: "Educação", label: "Educação" },
                { value: "Urbanismo", label: "Urbanismo" },
              ]}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
