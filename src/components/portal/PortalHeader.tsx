import { Button } from "@/components/ui/button";
import { Building2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function PortalHeader() {
  return (
    <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Portal da Transparência</h1>
              <p className="text-xs text-muted-foreground">Obras Públicas</p>
            </div>
          </Link>

          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" />
              Acessar Sistema Interno
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
