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
import { UserPlus, Search, Shield, Loader2, Edit, Trash2, Users, Crown, X } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useTenant } from "@/contexts/TenantContext";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import { useIsSuperAdmin } from "@/hooks/useUserRoles";

export default function Usuarios() {
  const queryClient = useQueryClient();
  const { tenant } = useTenant();
  const { isSuperAdmin } = useIsSuperAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole['role']>('cidadao');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState({ nome: "", telefone: "", crea: "" });
  const [newUserFormData, setNewUserFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    crea: "",
    senha: "",
    confirmarSenha: "",
    role: "cidadao" as UserRole['role'],
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const { usuarios, isLoading, assignRole, removeRole, updateProfile } = useUsuarios();

  // Verificar se pode gerenciar um usuário
  const canManageUser = (usuario: UserProfile) => {
    // Super admin pode gerenciar todos
    if (isSuperAdmin) return true;
    
    // Não pode gerenciar super admins
    if (usuario.roles?.some(r => r.role === 'super_admin')) return false;
    
    // Admin/Gestor pode gerenciar usuários do mesmo tenant (exceto super admins)
    return true;
  };

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
    try {
      await removeRole.mutateAsync({ userId, role });
    } catch (error: any) {
      console.error('Erro ao remover papel:', error);
      if (error.message?.includes('permission') || error.code === 'PGRST301') {
        toast.error('Você não tem permissão para remover papéis deste usuário');
      }
    }
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
    
    // Verificar permissão
    if (!canManageUser(editingUser)) {
      toast.error('Você não tem permissão para excluir este usuário');
      setIsDeleteDialogOpen(false);
      return;
    }
    
    try {
      console.log('🗑️ Iniciando exclusão do usuário:', editingUser.id);
      
      // Chamar a edge function para deletar o usuário de forma segura
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId: editingUser.id }
      });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        throw new Error(error.message || 'Erro ao excluir usuário');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro ao excluir usuário');
      }

      console.log('✅ Usuário excluído com sucesso');
      toast.success('Usuário excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setIsDeleteDialogOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error('❌ Erro ao excluir usuário:', error);
      if (error.message?.includes('permission') || error.message?.includes('permissão')) {
        toast.error('Você não tem permissão para excluir este usuário');
      } else {
        toast.error(error.message || 'Erro ao excluir usuário');
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCreateUser = async () => {
    // Validação
    if (!newUserFormData.nome || !newUserFormData.email || !newUserFormData.senha) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (newUserFormData.senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (newUserFormData.senha !== newUserFormData.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newUserFormData.role === 'engenheiro' && !newUserFormData.crea) {
      toast.error("CREA é obrigatório para engenheiros");
      return;
    }

    setIsCreatingUser(true);

    try {
      // 1. Criar usuário no Auth usando admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserFormData.email,
        password: newUserFormData.senha,
        email_confirm: true,
        user_metadata: {
          nome: newUserFormData.nome,
          tenant_id: tenant?.id,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário");

      // 2. Criar perfil
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          nome: newUserFormData.nome,
          email: newUserFormData.email,
          telefone: newUserFormData.telefone || null,
          crea: newUserFormData.crea || null,
          tenant_id: tenant?.id,
        });

      if (profileError) throw profileError;

      // 3. Atribuir papel
      await assignRole.mutateAsync({
        userId: authData.user.id,
        role: newUserFormData.role,
      });

      toast.success("Usuário criado com sucesso!");
      setIsNewUserDialogOpen(false);
      setNewUserFormData({
        nome: "",
        email: "",
        telefone: "",
        crea: "",
        senha: "",
        confirmarSenha: "",
        role: "cidadao",
      });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      toast.error(error.message || "Erro ao criar usuário");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const roleLabels: Record<UserRole['role'], string> = {
    super_admin: 'Super Admin',
    admin: 'Administrador',
    gestor: 'Gestor',
    fiscal: 'Fiscal',
    engenheiro: 'Engenheiro',
    fornecedor: 'Fornecedor',
    cidadao: 'Cidadão',
  };

  const getRoleBadgeClasses = (role: UserRole['role']) => {
    const baseClasses = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md";
    
    const roleStyles: Record<UserRole['role'], string> = {
      super_admin: 'bg-gradient-to-r from-yellow-900 to-yellow-600 text-white hover:from-yellow-800 hover:to-yellow-500',
      admin: 'bg-gradient-to-r from-red-900 to-red-600 text-white hover:from-red-800 hover:to-red-500',
      gestor: 'bg-gradient-to-r from-[#132A72] to-blue-600 text-white hover:from-[#1e3a8a] hover:to-blue-500',
      fiscal: 'bg-gradient-to-r from-green-900 to-green-600 text-white hover:from-green-800 hover:to-green-500',
      engenheiro: 'bg-gradient-to-r from-orange-900 to-orange-600 text-white hover:from-orange-800 hover:to-orange-500',
      fornecedor: 'bg-gradient-to-r from-purple-900 to-purple-600 text-white hover:from-purple-800 hover:to-purple-500',
      cidadao: 'bg-gradient-to-r from-gray-700 to-gray-500 text-white hover:from-gray-600 hover:to-gray-400',
    };
    
    return `${baseClasses} ${roleStyles[role]}`;
  };

  return (
    <RoleProtectedRoute allowedRoles={['super_admin', 'admin', 'gestor']}>
      <MainLayout>
      <div className="space-y-6">
        {/* Modern Header with Gradient */}
        <div className="gradient-primary rounded-xl p-8 shadow-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Users size={180} />
          </div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Gerenciar Usuários</h1>
              <p className="text-white/90 mt-2 text-lg">Gerencie usuários e seus papéis no sistema</p>
              {usuarios && (
                <p className="text-white/80 text-sm mt-1">
                  {usuarios.length} {usuarios.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}
                </p>
              )}
            </div>
            <Button 
              onClick={() => setIsNewUserDialogOpen(true)} 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg hover:scale-105 transition-transform duration-200"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Novo Usuário
            </Button>
          </div>
        </div>

        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogTrigger asChild>
            <div style={{ display: 'none' }}></div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="gradient-primary rounded-t-lg -mx-6 -mt-6 px-6 py-4 mb-4">
              <DialogTitle className="text-white text-xl">Atribuir Papel ao Usuário</DialogTitle>
              <DialogDescription className="text-white/90">Selecione o papel que deseja atribuir</DialogDescription>
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
                    <SelectItem value="engenheiro">Engenheiro</SelectItem>
                    <SelectItem value="fornecedor">Fornecedor</SelectItem>
                    <SelectItem value="cidadao">Cidadão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
                disabled={assignRole.isPending}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAssignRole}
                disabled={assignRole.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {assignRole.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Atribuir Papel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="shadow-custom border-0 overflow-hidden">
          <CardHeader className="gradient-primary border-b-0 pb-6">
            <CardTitle className="text-white text-2xl">Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-primary/60" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 focus:border-primary transition-colors duration-200"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full bg-primary/10" />
                <Skeleton className="h-14 w-full bg-primary/10" />
                <Skeleton className="h-14 w-full bg-primary/10" />
              </div>
            ) : (
              <div className="rounded-xl border-2 border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="gradient-primary hover:bg-none">
                      <TableHead className="text-white font-semibold">Nome</TableHead>
                      <TableHead className="text-white font-semibold">Email</TableHead>
                      <TableHead className="text-white font-semibold">Papéis</TableHead>
                      <TableHead className="text-white font-semibold">Data de Cadastro</TableHead>
                      <TableHead className="text-right text-white font-semibold">Ações</TableHead>
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
                              {usuario.roles?.some(r => r.role === 'super_admin') && (
                                <span className="text-yellow-500" title="Super Administrador">👑</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{usuario.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {usuario.roles && usuario.roles.length > 0 ? (
                                usuario.roles.map((userRole) => {
                                  const isSuperAdminRole = usuario.roles?.some(r => r.role === 'super_admin');
                                  return (
                                    <button
                                      key={userRole.id}
                                      className={`${getRoleBadgeClasses(userRole.role)} ${
                                        isSuperAdminRole ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                      }`}
                                      onClick={() => {
                                        if (!isSuperAdminRole) {
                                          handleRemoveRole(usuario.id, userRole.role);
                                        }
                                      }}
                                      title={isSuperAdminRole ? "Não é possível remover papel de Super Admin" : "Clique para remover"}
                                      disabled={isSuperAdminRole}
                                    >
                                      {roleLabels[userRole.role]}
                                      {!isSuperAdminRole && (
                                        <X className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      )}
                                      {isSuperAdminRole && (
                                        <Crown className="h-3 w-3 ml-1" />
                                      )}
                                    </button>
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
                                disabled={!canManageUser(usuario)}
                                title={!canManageUser(usuario) ? "Você não tem permissão para gerenciar este usuário" : "Atribuir papel"}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(usuario)}
                                disabled={!canManageUser(usuario)}
                                title={!canManageUser(usuario) ? "Você não tem permissão para editar este usuário" : "Editar usuário"}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openDeleteDialog(usuario)}
                                className="text-red-600 hover:text-red-700"
                                disabled={!canManageUser(usuario) || usuario.roles?.some(r => r.role === 'super_admin')}
                                title={usuario.roles?.some(r => r.role === 'super_admin') ? "Não é possível remover papéis do Super Admin" : !canManageUser(usuario) ? "Você não tem permissão para remover papéis deste usuário" : "Remover papéis"}
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

        {/* New User Dialog */}
        <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="gradient-primary rounded-t-lg -mx-6 -mt-6 px-6 py-4 mb-4">
              <DialogTitle className="text-white text-xl">Cadastrar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={newUserFormData.nome}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, nome: e.target.value })}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserFormData.email}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, email: e.target.value })}
                  placeholder="usuario@email.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={newUserFormData.telefone}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              {newUserFormData.role === 'engenheiro' && (
                <div className="grid gap-2">
                  <Label htmlFor="crea">CREA *</Label>
                  <Input
                    id="crea"
                    value={newUserFormData.crea}
                    onChange={(e) => setNewUserFormData({ ...newUserFormData, crea: e.target.value })}
                    placeholder="CREA/UF 000000000-0"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="senha">Senha Inicial *</Label>
                <Input
                  id="senha"
                  type="password"
                  value={newUserFormData.senha}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, senha: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={newUserFormData.confirmarSenha}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, confirmarSenha: e.target.value })}
                  placeholder="Digite a senha novamente"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Papel Inicial *</Label>
                <Select
                  value={newUserFormData.role}
                  onValueChange={(value) => {
                    const newRole = value as UserRole['role'];
                    setNewUserFormData({ 
                      ...newUserFormData, 
                      role: newRole,
                      crea: newRole === 'engenheiro' ? newUserFormData.crea : ''
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="fiscal">Fiscal</SelectItem>
                    <SelectItem value="engenheiro">Engenheiro</SelectItem>
                    <SelectItem value="fornecedor">Fornecedor</SelectItem>
                    <SelectItem value="cidadao">Cidadão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)} disabled={isCreatingUser}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateUser} 
                disabled={isCreatingUser}
                className="bg-primary hover:bg-primary/90"
              >
                {isCreatingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Usuário"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="gradient-primary rounded-t-lg -mx-6 -mt-6 px-6 py-4 mb-4">
              <DialogTitle className="text-white text-xl">Editar Usuário</DialogTitle>
              <DialogDescription className="text-white/90">Atualize as informações do usuário</DialogDescription>
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
                className="bg-primary hover:bg-primary/90"
              >
                {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Excluir Usuário?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                <div className="space-y-2">
                  <p>Esta ação é <strong className="text-red-600">PERMANENTE</strong> e excluirá completamente o usuário <strong className="text-foreground">{editingUser?.nome}</strong> do sistema.</p>
                  <p className="text-muted-foreground">Isso incluirá:</p>
                  <ul className="list-disc list-inside text-muted-foreground ml-2">
                    <li>Conta de acesso</li>
                    <li>Todos os papéis e permissões</li>
                    <li>Perfil do usuário</li>
                  </ul>
                  <p className="text-red-600 font-semibold mt-3">Esta ação não pode ser desfeita!</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                Sim, Excluir Permanentemente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
    </RoleProtectedRoute>
  );
}
