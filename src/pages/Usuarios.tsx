import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search, Shield, Loader2 } from "lucide-react";
import { useUsuarios, UserRole } from "@/hooks/useUsuarios";
import { Skeleton } from "@/components/ui/skeleton";

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole['role']>('cidadao');

  const { usuarios, isLoading, assignRole, removeRole } = useUsuarios();

  const filteredUsuarios = usuarios?.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    await assignRole.mutateAsync({ userId: selectedUser, role: selectedRole });
    setIsRoleDialogOpen(false);
    setSelectedUser(null);
    setSelectedRole('cidadao');
  };

  const handleRemoveRole = async (userId: string, role: UserRole['role']) => {
    await removeRole.mutateAsync({ userId, role });
  };

  const roleLabels: Record<UserRole['role'], string> = {
    admin: 'Administrador',
    gestor: 'Gestor',
    fiscal: 'Fiscal',
    fornecedor: 'Fornecedor',
    cidadao: 'Cidadão',
  };

  const roleColors: Record<UserRole['role'], string> = {
    admin: 'bg-red-500',
    gestor: 'bg-blue-500',
    fiscal: 'bg-green-500',
    fornecedor: 'bg-purple-500',
    cidadao: 'bg-gray-500',
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">Gerencie usuários e seus papéis no sistema</p>
          </div>
          <Button onClick={() => window.location.href = '/login'} variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Página de Cadastro
          </Button>
        </div>

        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogTrigger asChild>
            <div style={{ display: 'none' }}></div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atribuir Papel ao Usuário</DialogTitle>
              <DialogDescription>Selecione o papel que deseja atribuir</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role">Papel</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole['role'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="fiscal">Fiscal</SelectItem>
                    <SelectItem value="fornecedor">Fornecedor</SelectItem>
                    <SelectItem value="cidadao">Cidadão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAssignRole}
                disabled={assignRole.isPending}
              >
                {assignRole.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Atribuir Papel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Papéis</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsuarios.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Nenhum usuário encontrado. Os usuários aparecerão aqui após o primeiro cadastro.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                          <TableCell className="font-medium">{usuario.nome}</TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {usuario.roles && usuario.roles.length > 0 ? (
                                usuario.roles.map((userRole) => (
                                  <Badge 
                                    key={userRole.id} 
                                    className={roleColors[userRole.role]}
                                    onClick={() => handleRemoveRole(usuario.id, userRole.role)}
                                    style={{ cursor: 'pointer' }}
                                    title="Clique para remover"
                                  >
                                    {roleLabels[userRole.role]}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="secondary">Sem papéis</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedUser(usuario.id);
                                setIsRoleDialogOpen(true);
                              }}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Atribuir Papel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
