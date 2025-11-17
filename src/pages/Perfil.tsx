import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, Building2, Shield, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile, useUpdateProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

export default function Perfil() {
  const { toast } = useToast();
  const { data: userProfile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const [userData, setUserData] = useState({
    nome: "",
    telefone: "",
    crea: "",
  });

  useEffect(() => {
    if (userProfile?.profile) {
      setUserData({
        nome: userProfile.profile.nome || "",
        telefone: userProfile.profile.telefone || "",
        crea: userProfile.profile.crea || "",
      });
    }
  }, [userProfile]);

  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(userData);
  };

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (senhaData.novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter no mínimo 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: senhaData.novaSenha
      });

      if (error) throw error;

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi atualizada com sucesso",
      });
      setSenhaData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e segurança</p>
        </div>

        <Tabs defaultValue="dados" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="senha">Alterar Senha</TabsTrigger>
          </TabsList>

          <TabsContent value="dados">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados cadastrais</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSalvarPerfil} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl">
                        {userData.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline">Alterar Foto</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">
                        <User className="h-4 w-4 inline mr-2" />
                        Nome Completo
                      </Label>
                      <Input
                        id="nome"
                        value={userData.nome}
                        onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Telefone
                      </Label>
                      <Input
                        id="telefone"
                        value={userData.telefone}
                        onChange={(e) => setUserData({ ...userData, telefone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        value={userData.cargo}
                        onChange={(e) => setUserData({ ...userData, cargo: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unidade">
                        <Building2 className="h-4 w-4 inline mr-2" />
                        Unidade Gestora
                      </Label>
                      <Input
                        id="unidade"
                        value={userData.unidade}
                        readOnly
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="perfil">
                        <Shield className="h-4 w-4 inline mr-2" />
                        Perfil de Acesso
                      </Label>
                      <Input
                        id="perfil"
                        value={userData.perfil}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="senha">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Altere sua senha de acesso</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAlterarSenha} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual">
                      <Key className="h-4 w-4 inline mr-2" />
                      Senha Atual
                    </Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhaData.senhaAtual}
                      onChange={(e) => setSenhaData({ ...senhaData, senhaAtual: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={senhaData.novaSenha}
                      onChange={(e) => setSenhaData({ ...senhaData, novaSenha: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={senhaData.confirmarSenha}
                      onChange={(e) => setSenhaData({ ...senhaData, confirmarSenha: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Alterar Senha" : "Alterar Senha"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
