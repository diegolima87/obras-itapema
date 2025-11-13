import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  HardHat,
  FileText,
  TrendingUp,
  Users,
  Map,
  Building2,
  Globe,
  Menu,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MainLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Obras", href: "/obras", icon: HardHat },
  { name: "Contratos", href: "/contratos", icon: FileText },
  { name: "Medições", href: "/medicoes", icon: TrendingUp },
  { name: "Fornecedores", href: "/fornecedores", icon: Building2 },
  { name: "Mapa", href: "/mapa", icon: Map },
];

const NavLinks = () => {
  const location = useLocation();
  
  return (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link key={item.name} to={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </>
  );
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <HardHat className="h-6 w-6 text-primary" />
            <h1 className="text-base sm:text-lg font-semibold hidden sm:block">
              Sistema de Gestão de Obras Públicas
            </h1>
            <h1 className="text-base font-semibold sm:hidden">
              Gestão de Obras
            </h1>
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            <Link to="/portal-fornecedor">
              <Button variant="ghost" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Portal Fornecedor
              </Button>
            </Link>
            <Link to="/portal-publico">
              <Button variant="ghost" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                Portal Público
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex w-64 flex-col gap-2 border-r bg-card p-4 min-h-[calc(100vh-4rem)]">
          <nav className="flex flex-col gap-2">
            <NavLinks />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};