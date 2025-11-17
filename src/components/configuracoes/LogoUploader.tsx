import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { useTenantUpload } from "@/hooks/useTenantUpload";

interface LogoUploaderProps {
  title: string;
  description: string;
  currentUrl?: string | null;
  type: 'logo_url' | 'logo_dark_url' | 'favicon_url';
  accept?: string;
}

export function LogoUploader({
  title,
  description,
  currentUrl,
  type,
  accept = "image/png,image/svg+xml,image/jpeg,image/webp"
}: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAsset, removeAsset, isUploading } = useTenantUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAsset.mutate({ file, type });
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (confirm('Tem certeza que deseja remover esta imagem?')) {
      removeAsset.mutate(type);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {currentUrl ? (
          <div className="relative group">
            <div className="border rounded-lg p-4 bg-muted/50">
              <img
                src={currentUrl}
                alt={title}
                className="w-full h-32 object-contain"
              />
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 bg-background/80 rounded-lg">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Alterar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 mx-auto mb-2 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Enviando...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Clique para enviar</p>
                <p className="text-xs text-muted-foreground mt-1">ou arraste o arquivo aqui</p>
              </>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </CardContent>
    </Card>
  );
}
