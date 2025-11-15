import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  User,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

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
                <span className="hidden sm:inline">Portal Fornecedor</span>
              </Button>
            </Link>
            <Link to="/portal-publico">
              <Button variant="ghost" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Portal Público</span>
              </Button>
            </Link>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Conta autenticada</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/usuarios" className="cursor-pointer">
                      <Users className="mr-2 h-4 w-4" />
                      Usuários
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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