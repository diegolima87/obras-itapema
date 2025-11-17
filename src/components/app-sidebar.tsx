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
  ShieldCheck
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
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
  { title: "e-Sfinge", url: "/e-sfinge", icon: Zap },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <Sidebar 
      collapsible="icon"
      className="border-r-0"
    >
      <SidebarContent className="bg-gradient-to-b from-[#132A72] to-[#142050] shadow-2xl">
        {/* Sidebar Header */}
        <div className="px-6 py-6 bg-[#142050]/50 border-b border-white/10">
          <div className="flex items-center gap-3">
            <HardHat className="h-8 w-8 text-white" strokeWidth={2.5} />
            <div className={open ? "block" : "hidden"}>
              <h2 className="text-white font-bold text-lg">Gestão de Obras</h2>
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
                      className="py-3.5 px-4 rounded-xl transition-all duration-300 text-white/80 hover:bg-white/10 hover:text-white hover:scale-[1.02] data-[active=true]:bg-white data-[active=true]:text-[#132A72] data-[active=true]:font-bold data-[active=true]:scale-[1.03] data-[active=true]:border-l-4 data-[active=true]:border-blue-400 data-[active=true]:shadow-lg"
                      activeClassName="sidebar-item-active"
                    >
                      <item.icon 
                        className="h-5 w-5 transition-all duration-300 group-hover:text-white group-data-[active=true]:text-[#132A72] group-data-[active=true]:sidebar-glow" 
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
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="group"
                  >
                    <NavLink 
                      to={item.url}
                      className="py-3.5 px-4 rounded-xl transition-all duration-300 text-white/80 hover:bg-white/10 hover:text-white hover:scale-[1.02] data-[active=true]:bg-white data-[active=true]:text-[#132A72] data-[active=true]:font-bold data-[active=true]:scale-[1.03] data-[active=true]:border-l-4 data-[active=true]:border-blue-400 data-[active=true]:shadow-lg"
                      activeClassName="sidebar-item-active"
                    >
                      <item.icon 
                        className="h-5 w-5 transition-all duration-300 group-hover:text-white group-data-[active=true]:text-[#132A72] group-data-[active=true]:sidebar-glow" 
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
    </Sidebar>
  );
}
