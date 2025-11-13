import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import LoginFornecedor from "./pages/fornecedor/LoginFornecedor";
import DashboardFornecedor from "./pages/fornecedor/DashboardFornecedor";
import ObrasFornecedor from "./pages/fornecedor/ObrasFornecedor";
import DocumentosFornecedor from "./pages/fornecedor/DocumentosFornecedor";
import Mapa from "./pages/Mapa";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/obra/:id" element={<ObraPublica />} />
          <Route path="/portal-publico" element={<PortalPublico />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/perfil" element={<Perfil />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/engenheiro" element={<DashboardEngenheiro />} />
          <Route path="/dashboard/financeiro" element={<DashboardFinanceiro />} />
          
          {/* Obras Routes */}
          <Route path="/obras" element={<Obras />} />
          <Route path="/obras/nova" element={<NovaObra />} />
          <Route path="/obras/:id" element={<ObraDetalhes />} />
          <Route path="/obras/:id/editar" element={<EditarObra />} />
          
          {/* Contratos Routes */}
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/contratos/novo" element={<NovoContrato />} />
          <Route path="/contratos/:id" element={<ContratoDetalhes />} />
          
          {/* Medições Routes */}
          <Route path="/medicoes" element={<Medicoes />} />
          <Route path="/medicoes/nova" element={<NovaMedicao />} />
          <Route path="/medicoes/:id" element={<MedicaoDetalhes />} />
          
          {/* Admin Routes */}
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/auditoria" element={<LogAuditoria />} />
          
          {/* e-Sfinge Integration */}
          <Route path="/e-sfinge" element={<ESfinge />} />
          <Route path="/e-sfinge/exportacao" element={<ESfingeExportacao />} />
          <Route path="/e-sfinge/envio" element={<ESfingeEnvio />} />
          <Route path="/e-sfinge/logs" element={<ESfingeLogs />} />
          <Route path="/e-sfinge/mapeamento" element={<ESfingeMapeamento />} />
          
          {/* Fornecedor Portal Routes */}
          <Route path="/fornecedor/login" element={<LoginFornecedor />} />
          <Route path="/fornecedor/dashboard" element={<DashboardFornecedor />} />
          <Route path="/fornecedor/obras" element={<ObrasFornecedor />} />
          <Route path="/fornecedor/documentos" element={<DocumentosFornecedor />} />
          
          {/* Other Routes */}
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/mapa" element={<Mapa />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
