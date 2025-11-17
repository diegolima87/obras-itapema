import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useHasAnyRole, useIsSuperAdmin, UserRole } from '@/hooks/useUserRoles';
import { useFeatureEnabled, FeatureType } from '@/hooks/useTenantFeatures';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

interface FeatureProtectedRouteProps {
  children: React.ReactNode;
  feature: FeatureType;
  allowedRoles: UserRole[];
  featureName?: string;
}

export function FeatureProtectedRoute({ 
  children, 
  feature, 
  allowedRoles,
  featureName = 'este módulo' 
}: FeatureProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { hasRole, isLoading: rolesLoading } = useHasAnyRole(allowedRoles);
  const { isEnabled, isLoading: featureLoading } = useFeatureEnabled(feature);
  const { isSuperAdmin } = useIsSuperAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || rolesLoading || featureLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) return null;

  // Verificar role
  if (!hasRole) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar {featureName}.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  // Super admin sempre pode acessar (para gerenciar)
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // Verificar se feature está habilitada para o tenant
  if (!isEnabled) {
    return (
      <MainLayout>
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            O módulo {featureName} não está habilitado para sua organização. 
            Entre em contato com o suporte para habilitar este módulo.
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  return <>{children}</>;
}
