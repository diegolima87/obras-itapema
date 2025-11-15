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
import { UserPlus, Search, Shield, Loader2, Edit, Trash2 } from "lucide-react";
import { useUsuarios, UserRole, UserProfile } from "@/hooks/useUsuarios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Usuarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole['role']>('cidadao');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState({ nome: "", telefone: "", crea: "" });

  const { usuarios, isLoading, assignRole, removeRole, updateProfile } = useUsuarios();

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

  const openEditDialog = (usuario: UserProfile) => {
    setEditingUser(usuario);
    setEditFormData({
      nome: usuario.nome,
      telefone: usuario.telefone || "",
      crea: usuario.crea || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingUser) return;
    
    await updateProfile.mutateAsync({
      userId: editingUser.id,
      data: editFormData,
    });
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const openDeleteDialog = (usuario: UserProfile) => {
    setEditingUser(usuario);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!editingUser) return;
    
    // Remove all roles first
    if (editingUser.roles) {
      for (const role of editingUser.roles) {
        await removeRole.mutateAsync({ userId: editingUser.id, role: role.role });
      }
    }
    
    setIsDeleteDialogOpen(false);
    setEditingUser(null);
  };

  const SUPER_ADMIN_EMAIL = 'deklima@gmail.com';

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

  const isSuperAdmin = (email: string) => email === SUPER_ADMIN_EMAIL;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">Gerencie usuários e seus papéis no sistema</p>
          </div>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Usuários Cadastrados</CardTitle>
            <Button onClick={() => window.location.href = '/login'} size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
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
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {usuario.nome}
                              {isSuperAdmin(usuario.email) && (
                                <span className="text-yellow-500" title="Super Administrador">👑</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {usuario.roles && usuario.roles.length > 0 ? (
                                usuario.roles.map((userRole) => {
                                  const isAdminAndSuperAdmin = isSuperAdmin(usuario.email) && userRole.role === 'admin';
                                  return (
                                    <Badge 
                                      key={userRole.id} 
                                      className={roleColors[userRole.role]}
                                      onClick={() => !isAdminAndSuperAdmin && handleRemoveRole(usuario.id, userRole.role)}
                                      style={{ cursor: isAdminAndSuperAdmin ? 'not-allowed' : 'pointer', opacity: isAdminAndSuperAdmin ? 0.8 : 1 }}
                                      title={isAdminAndSuperAdmin ? "Não é possível remover papel de Super Admin" : "Clique para remover"}
                                    >
                                      {roleLabels[userRole.role]}
                                      {isAdminAndSuperAdmin && <span className="ml-1 text-xs">(Super Admin)</span>}
                                    </Badge>
                                  );
                                })
                              ) : (
                                <Badge variant="secondary">Sem papéis</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(usuario.id);
                                  setIsRoleDialogOpen(true);
                                }}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(usuario)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openDeleteDialog(usuario)}
                                className="text-red-600 hover:text-red-700"
                                disabled={isSuperAdmin(usuario.email) && usuario.roles?.some(r => r.role === 'admin')}
                                title={isSuperAdmin(usuario.email) ? "Não é possível remover papéis do Super Admin" : ""}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>Atualize as informações do usuário</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome Completo</Label>
                <Input
                  id="edit-nome"
                  value={editFormData.nome}
                  onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-telefone">Telefone</Label>
                <Input
                  id="edit-telefone"
                  value={editFormData.telefone}
                  onChange={(e) => setEditFormData({ ...editFormData, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-crea">CREA (Opcional)</Label>
                <Input
                  id="edit-crea"
                  value={editFormData.crea}
                  onChange={(e) => setEditFormData({ ...editFormData, crea: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleEditSubmit}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação removerá todos os papéis de <strong>{editingUser?.nome}</strong>.
                O usuário não será deletado do sistema, mas perderá todos os acessos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Remover Acessos
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
