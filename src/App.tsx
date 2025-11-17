import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TenantProvider } from "@/contexts/TenantContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import Perfil from "./pages/Perfil";
import Dashboard from "./pages/Dashboard";
import DashboardEngenheiro from "./pages/DashboardEngenheiro";
import DashboardFinanceiro from "./pages/DashboardFinanceiro";
import Obras from "./pages/Obras";
import ObraDetalhes from "./pages/ObraDetalhes";
import ObraPublica from "./pages/ObraPublica";
import PortalPublico from "./pages/PortalPublico";
import NovaObra from "./pages/NovaObra";
import EditarObra from "./pages/EditarObra";
import Contratos from "./pages/Contratos";
import NovoContrato from "./pages/NovoContrato";
import ContratoDetalhes from "./pages/ContratoDetalhes";
import Medicoes from "./pages/Medicoes";
import NovaMedicao from "./pages/NovaMedicao";
import MedicaoDetalhes from "./pages/MedicaoDetalhes";
import MedicaoDetalhesCompleto from "./pages/MedicaoDetalhesCompleto";
import Fornecedores from "./pages/Fornecedores";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
import Relatorios from "./pages/Relatorios";
import LogAuditoria from "./pages/LogAuditoria";
import ESfinge from "./pages/ESfinge";
import ESfingeExportacao from "./pages/ESfingeExportacao";
import ESfingeEnvio from "./pages/ESfingeEnvio";
import ESfingeLogs from "./pages/ESfingeLogs";
import ESfingeMapeamento from "./pages/ESfingeMapeamento";
import ESfingeImportacao from "./pages/ESfingeImportacao";
import ESfingeConfiguracoes from "./pages/ESfingeConfiguracoes";
import HistoricoTCE from "./pages/HistoricoTCE";
import LoginFornecedor from "./pages/fornecedor/LoginFornecedor";
import DashboardFornecedor from "./pages/fornecedor/DashboardFornecedor";
import ObrasFornecedor from "./pages/fornecedor/ObrasFornecedor";
import DocumentosFornecedor from "./pages/fornecedor/DocumentosFornecedor";
import MedicoesFornecedor from "./pages/fornecedor/MedicoesFornecedor";
import IntegracaoTCE from "./pages/IntegracaoTCE";
import Mapa from "./pages/Mapa";
import NotFound from "./pages/NotFound";
import NovoFornecedor from "./pages/NovoFornecedor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TenantProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/obra/:id" element={<ObraPublica />} />
          <Route path="/portal-publico" element={<PortalPublico />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          
          {/* Dashboard Routes - Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/engenheiro" element={<ProtectedRoute><DashboardEngenheiro /></ProtectedRoute>} />
          <Route path="/dashboard/financeiro" element={<ProtectedRoute><DashboardFinanceiro /></ProtectedRoute>} />
          
          {/* Obras Routes - Protected */}
          <Route path="/obras" element={<ProtectedRoute><Obras /></ProtectedRoute>} />
          <Route path="/obras/nova" element={<ProtectedRoute><NovaObra /></ProtectedRoute>} />
          <Route path="/obras/:id" element={<ProtectedRoute><ObraDetalhes /></ProtectedRoute>} />
          <Route path="/obras/:id/editar" element={<ProtectedRoute><EditarObra /></ProtectedRoute>} />
          
          {/* Contratos Routes - Protected */}
          <Route path="/contratos" element={<ProtectedRoute><Contratos /></ProtectedRoute>} />
          <Route path="/contratos/novo" element={<ProtectedRoute><NovoContrato /></ProtectedRoute>} />
          <Route path="/contratos/:id" element={<ProtectedRoute><ContratoDetalhes /></ProtectedRoute>} />
          
          {/* Medições Routes - Protected */}
          <Route path="/medicoes" element={<ProtectedRoute><Medicoes /></ProtectedRoute>} />
          <Route path="/medicoes/nova" element={<ProtectedRoute><NovaMedicao /></ProtectedRoute>} />
          <Route path="/medicoes/:id" element={<ProtectedRoute><MedicaoDetalhes /></ProtectedRoute>} />
          <Route path="/medicoes/:id/completo" element={<ProtectedRoute><MedicaoDetalhesCompleto /></ProtectedRoute>} />
          
          {/* Fornecedores Routes - Protected */}
          <Route path="/fornecedores" element={<ProtectedRoute><Fornecedores /></ProtectedRoute>} />
          <Route path="/fornecedores/novo" element={<ProtectedRoute><NovoFornecedor /></ProtectedRoute>} />
          
          {/* Admin Routes - Protected */}
          <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
          <Route path="/auditoria" element={<ProtectedRoute><LogAuditoria /></ProtectedRoute>} />
          
          {/* e-Sfinge Integration - Protected */}
          <Route path="/e-sfinge" element={<ProtectedRoute><ESfinge /></ProtectedRoute>} />
          <Route path="/e-sfinge/exportacao" element={<ProtectedRoute><ESfingeExportacao /></ProtectedRoute>} />
          <Route path="/e-sfinge/envio" element={<ProtectedRoute><ESfingeEnvio /></ProtectedRoute>} />
          <Route path="/e-sfinge/logs" element={<ProtectedRoute><HistoricoTCE /></ProtectedRoute>} />
          <Route path="/e-sfinge/mapeamento" element={<ProtectedRoute><ESfingeMapeamento /></ProtectedRoute>} />
          <Route path="/e-sfinge/importacao" element={<ProtectedRoute><ESfingeImportacao /></ProtectedRoute>} />
          <Route path="/e-sfinge/configuracoes" element={<ProtectedRoute><ESfingeConfiguracoes /></ProtectedRoute>} />
          
          {/* Fornecedor Portal Routes */}
          <Route path="/fornecedor/login" element={<LoginFornecedor />} />
          <Route path="/fornecedor/dashboard" element={<ProtectedRoute><DashboardFornecedor /></ProtectedRoute>} />
          <Route path="/fornecedor/obras" element={<ProtectedRoute><ObrasFornecedor /></ProtectedRoute>} />
          <Route path="/fornecedor/medicoes" element={<ProtectedRoute><MedicoesFornecedor /></ProtectedRoute>} />
          <Route path="/fornecedor/documentos" element={<ProtectedRoute><DocumentosFornecedor /></ProtectedRoute>} />
          
          {/* Other Protected Routes */}
          <Route path="/mapa" element={<ProtectedRoute><Mapa /></ProtectedRoute>} />
          <Route path="/integracao-tce/:tipo/:id" element={<ProtectedRoute><IntegracaoTCE /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
    </TenantProvider>
  </QueryClientProvider>
);

export default App;
