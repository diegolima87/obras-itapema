import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, Home, FileText, Folder, Upload } from "lucide-react";
import { useFornecedorAtual } from "@/hooks/useFornecedorData";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { NavLink } from "@/components/NavLink";

interface FornecedorLayoutProps {
  children: ReactNode;
}

export function FornecedorLayout({ children }: FornecedorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: fornecedor, isLoading } = useFornecedorAtual();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/fornecedor/login");
  };

  const menuItems = [
    { to: "/fornecedor/dashboard", icon: Home, label: "Dashboard" },
    { to: "/fornecedor/obras", icon: Building2, label: "Minhas Obras" },
    { to: "/fornecedor/medicoes", icon: FileText, label: "Minhas Medições" },
    { to: "/fornecedor/documentos", icon: Folder, label: "Documentos" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/fornecedor/dashboard" className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                {isLoading ? (
                  <Skeleton className="h-5 w-48" />
                ) : (
                  <>
                    <h1 className="text-xl font-bold">{fornecedor?.nome}</h1>
                    <p className="text-sm text-muted-foreground">
                      CNPJ: {fornecedor?.cnpj}
                    </p>
                  </>
                )}
              </div>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent"
                activeClassName="text-primary border-primary"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
