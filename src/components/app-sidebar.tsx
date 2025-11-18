import { 
  LayoutDashboard, 
  HardHat, 
  FileText, 
  TrendingUp, 
  Users, 
  Map, 
  Building2, 
  Settings,
  FileBarChart,
  History,
  Zap,
  Layers,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useTenant } from "@/contexts/TenantContext";
import { useFeatureEnabled } from "@/hooks/useTenantFeatures";
import { useIsSuperAdmin } from "@/hooks/useUserRoles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Obras", url: "/obras", icon: HardHat },
  { title: "Contratos", url: "/contratos", icon: FileText },
  { title: "Medições", url: "/medicoes", icon: TrendingUp },
  { title: "Fornecedores", url: "/fornecedores", icon: Building2 },
  { title: "Mapa", url: "/mapa", icon: Map },
];

const adminItems = [
  { title: "Usuários", url: "/usuarios", icon: Users },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
  { title: "Auditoria", url: "/auditoria", icon: History },
  { title: "e-Sfinge", url: "/e-sfinge", icon: Zap, requiresFeature: 'esfinge' as const },
  { title: "Gerenciar Features", url: "/admin/features", icon: ShieldCheck, superAdminOnly: true },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { tenant } = useTenant();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { isEnabled: esfingeEnabled } = useFeatureEnabled('esfinge');
  const { isSuperAdmin } = useIsSuperAdmin();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  
  // Filtrar itens de admin baseado em features e permissões
  const filteredAdminItems = adminItems.filter(item => {
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (item.requiresFeature === 'esfinge' && !esfingeEnabled) return false;
    return true;
  });

  return (
    <Sidebar 
      collapsible="icon"
      className="border-r-0"
    >
      <SidebarContent className="bg-gradient-to-b from-primary to-primary-dark shadow-2xl">
        {/* Sidebar Header */}
        <div className="px-6 py-6 bg-primary-dark/50 border-b border-white/10">
          <div className="flex items-center gap-3">
            {tenant?.logo_url ? (
              <div className="bg-white/10 p-2 rounded-lg">
                <img 
                  src={tenant.logo_url} 
                  alt="Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
            ) : (
              <HardHat className="h-8 w-8 text-white" strokeWidth={2.5} />
            )}
            <div className={open ? "block" : "hidden"}>
              <h2 className="text-white font-bold text-lg">
                {(tenant?.nome_sistema || "Gestão de Obras").replace(/\s*Digital\s*/gi, '').trim()}
              </h2>
              <p className="text-white/60 text-xs">Sistema Integrado</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="px-3 mt-6">
          <SidebarGroupLabel className="px-3 mb-3 text-white/70 uppercase font-bold tracking-wider text-xs flex items-center gap-2 pb-2 border-b border-white/10">
            <Layers className="h-4 w-4" />
            {open && "Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="group"
                  >
                    <NavLink 
                      to={item.url}
                      className="py-3.5 px-4 rounded-xl transition-all duration-300 text-white/80 hover:bg-white/10 hover:text-white hover:scale-[1.02] data-[active=true]:bg-white data-[active=true]:text-primary data-[active=true]:font-bold data-[active=true]:scale-[1.03] data-[active=true]:border-l-4 data-[active=true]:border-accent data-[active=true]:shadow-lg"
                      activeClassName="sidebar-item-active"
                    >
                      <item.icon 
                        className="h-5 w-5 transition-all duration-300 group-hover:text-white group-data-[active=true]:text-primary group-data-[active=true]:sidebar-glow" 
                        strokeWidth={2.5}
                      />
                      <span className="transition-all duration-300">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        <SidebarGroup className="px-3 mt-6">
          <SidebarGroupLabel className="px-3 mb-3 text-white/70 uppercase font-bold tracking-wider text-xs flex items-center gap-2 pb-2 border-b border-white/10">
            <ShieldCheck className="h-4 w-4" />
            {open && "Administração"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {filteredAdminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="group"
                  >
                    <NavLink 
                      to={item.url}
                      className="py-3.5 px-4 rounded-xl transition-all duration-300 text-white/80 hover:bg-white/10 hover:text-white hover:scale-[1.02] data-[active=true]:bg-white data-[active=true]:text-primary data-[active=true]:font-bold data-[active=true]:scale-[1.03] data-[active=true]:border-l-4 data-[active=true]:border-accent data-[active=true]:shadow-lg"
                      activeClassName="sidebar-item-active"
                    >
                      <item.icon 
                        className="h-5 w-5 transition-all duration-300 group-hover:text-white group-data-[active=true]:text-primary group-data-[active=true]:sidebar-glow" 
                        strokeWidth={2.5}
                      />
                      <span className="transition-all duration-300">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer com botão de logout */}
      <SidebarFooter className="p-4 border-t border-white/10 bg-primary-dark">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          <LogOut className="h-5 w-5" strokeWidth={2.5} />
          {open && <span className="font-medium">Sair</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
