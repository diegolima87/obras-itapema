import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EsfingeProtectedRouteProps {
  children: React.ReactNode;
}

export function EsfingeProtectedRoute({ children }: EsfingeProtectedRouteProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Apenas o usuário específico pode acessar
  if (user.email !== 'obras@itapema.gov.br') {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Acesso restrito. Apenas o usuário autorizado pode acessar o e-Sfinge.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  return <>{children}</>;
}
