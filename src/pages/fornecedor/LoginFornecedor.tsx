import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Lock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginFornecedor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cnpj || !senha) {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    // Simular login bem-sucedido
    toast({
      title: "Login realizado!",
      description: "Bem-vindo ao Portal do Fornecedor",
    });

    navigate("/fornecedor/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Portal do Fornecedor</h1>
          <p className="text-muted-foreground">Acesse suas obras, contratos e medições</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription>Entre com suas credenciais de fornecedor</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">
                  <Mail className="h-4 w-4 inline mr-2" />
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">
                  <Lock className="h-4 w-4 inline mr-2" />
                  Senha
                </Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Entrar no Portal
              </Button>

              <div className="text-center">
                <Button variant="link" size="sm" type="button">
                  Esqueci minha senha
                </Button>
              </div>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                <p>Não possui acesso ao portal?</p>
                <p>Entre em contato com a Secretaria de Obras</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
