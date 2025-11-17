import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HardHat, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/contexts/TenantContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [nomeMunicipio, setNomeMunicipio] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [uf, setUf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    user
  } = useAuth();
  const {
    tenant,
    loading: tenantLoading
  } = useTenant();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      return;
    }
    const {
      error
    } = await signIn(email, senha);
    if (!error) {
      navigate("/dashboard");
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha || !nome || !nomeMunicipio || !cnpj || !uf) {
      return;
    }
    if (senha.length < 6) {
      return;
    }
    const {
      error
    } = await signUp(email, senha, nome, nomeMunicipio, cnpj, uf, telefone);
    if (!error) {
      setActiveTab("login");
      setEmail("");
      setSenha("");
      setNome("");
      setNomeMunicipio("");
      setCnpj("");
      setUf("");
      setTelefone("");
    }
  };
  if (tenantLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {tenant?.logo_dark_url || tenant?.logo_url ? <img src={tenant.logo_dark_url || tenant.logo_url} alt="Logo" className="h-24 w-24 object-contain" /> : <div className="bg-primary p-3 rounded-full">
                <HardHat className="h-12 w-12 text-primary-foreground" />
              </div>}
          </div>
          
          <CardDescription>Entre ou crie sua conta para acessar</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input id="login-email" type="email" placeholder="seu.email@prefeitura.sc.gov.br" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-senha">Senha</Label>
                  <Input id="login-senha" type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
                <Button type="button" variant="link" className="w-full" onClick={() => navigate('/recuperar-senha')}>
                  Esqueci minha senha
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-nome">Nome Completo</Label>
                  <Input id="signup-nome" type="text" placeholder="João Silva" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input id="signup-email" type="email" placeholder="seu.email@prefeitura.sc.gov.br" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-senha">Senha</Label>
                  <Input id="signup-senha" type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} required minLength={6} />
                  <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
                </div>
                
                <div className="border-t pt-4 space-y-4">
                  <p className="text-sm text-muted-foreground font-medium">Informações do Município/Órgão</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-municipio">Nome do Município/Órgão</Label>
                    <Input id="signup-municipio" type="text" placeholder="Prefeitura de São Paulo" value={nomeMunicipio} onChange={e => setNomeMunicipio(e.target.value)} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-cnpj">CNPJ</Label>
                    <Input id="signup-cnpj" type="text" placeholder="00.000.000/0000-00" value={cnpj} onChange={e => setCnpj(e.target.value)} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-uf">Estado (UF)</Label>
                    <Select value={uf} onValueChange={setUf} required>
                      <SelectTrigger id="signup-uf">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-telefone">Telefone (opcional)</Label>
                    <Input id="signup-telefone" type="tel" placeholder="(00) 0000-0000" value={telefone} onChange={e => setTelefone(e.target.value)} />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Criar Conta e Município
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t">
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/portal-publico')}>
              <Globe className="mr-2 h-4 w-4" />
              Acessar Portal da Transparência
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Visualize obras públicas sem necessidade de login
            </p>
          </div>
        </CardContent>
      </Card>
    </div>;
}