import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  slug: string;
  nome_municipio: string;
  nome_sistema: string;
  cnpj: string;
  uf: string;
  email: string;
  telefone?: string;
  endereco?: string;
  logo_url?: string;
  logo_dark_url?: string;
  favicon_url?: string;
  cor_primaria: string;
  cor_secundaria: string;
  cor_destaque?: string;
  dominio_customizado?: string;
  subdominio: string;
  portal_ativo: boolean;
  mostrar_valores: boolean;
  mostrar_fornecedores: boolean;
  exigir_aprovacao: boolean;
  permitir_comentarios: boolean;
  ativo: boolean;
  plano: 'basico' | 'premium' | 'enterprise';
  data_contratacao?: string;
  created_at: string;
  updated_at: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  refetchTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  refetchTenant: async () => {},
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTenant = async () => {
    try {
      // Identificar tenant pelo hostname
      const hostname = window.location.hostname;
      
      let tenantSlug = '';
      
      // Para desenvolvimento local e Lovable preview, usa 'itampema' por padrão
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('lovableproject.com')) {
        tenantSlug = 'itampema';
      }
      // Verificar se é subdomínio (itampema.obrasdigital.com.br)
      else if (hostname.includes('.obrasdigital.com.br')) {
        tenantSlug = hostname.split('.')[0];
      } 
      // Verificar domínio customizado
      else {
        const { data } = await supabase
          .from('tenants')
          .select('*')
          .eq('dominio_customizado', hostname)
          .maybeSingle();
        
        if (data) {
          setTenant(data);
          applyTenantStyles(data);
          setLoading(false);
          return;
        }
        // Fallback para 'itampema' se não encontrar domínio customizado
        tenantSlug = 'itampema';
      }

      // Carregar tenant pelo slug
      if (tenantSlug) {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .eq('slug', tenantSlug)
          .maybeSingle();
        
        if (error) {
          console.error('Erro ao carregar tenant:', error);
        }
        
        if (data) {
          setTenant(data);
          applyTenantStyles(data);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar tenant:', error);
      setLoading(false);
    }
  };

  const applyTenantStyles = (tenantData: Tenant) => {
    if (!tenantData) return;

    // Aplicar cores dinamicamente ao documento
    const root = document.documentElement;
    
    // Converter cores hex para HSL e aplicar
    if (tenantData.cor_primaria) {
      root.style.setProperty('--primary', hexToHSL(tenantData.cor_primaria));
    }
    
    if (tenantData.cor_secundaria) {
      root.style.setProperty('--primary-dark', hexToHSL(tenantData.cor_secundaria));
    }

    if (tenantData.cor_destaque) {
      root.style.setProperty('--accent', hexToHSL(tenantData.cor_destaque));
    }
    
    // Atualizar favicon
    if (tenantData.favicon_url) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = tenantData.favicon_url;
    }
    
    // Atualizar título da página
    document.title = tenantData.nome_sistema;
  };

  // Função auxiliar para converter HEX para HSL
  const hexToHSL = (hex: string): string => {
    // Remove o # se existir
    hex = hex.replace(/^#/, '');
    
    // Converte para RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    // Retorna no formato HSL para CSS (0-360, 0-100%, 0-100%)
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  useEffect(() => {
    loadTenant();
  }, []);

  const refetchTenant = async () => {
    await loadTenant();
  };

  return (
    <TenantContext.Provider value={{ tenant, loading, refetchTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider');
  }
  return context;
};
