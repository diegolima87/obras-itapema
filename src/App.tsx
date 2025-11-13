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
import Fornecedores from "./pages/Fornecedores";
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
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/obras/nova" element={<NovaObra />} />
          <Route path="/obras/:id" element={<ObraDetalhes />} />
          <Route path="/obras/:id/editar" element={<EditarObra />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/contratos/novo" element={<NovoContrato />} />
          <Route path="/contratos/:id" element={<ContratoDetalhes />} />
          <Route path="/medicoes" element={<Medicoes />} />
          <Route path="/medicoes/nova" element={<NovaMedicao />} />
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
