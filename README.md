# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c487f6bd-c29b-4564-bcc2-ff6d5ae8eb91

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c487f6bd-c29b-4564-bcc2-ff6d5ae8eb91) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c487f6bd-c29b-4564-bcc2-ff6d5ae8eb91) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 🗺️ Configuração do Google Maps Geocoding API

Para melhorar a precisão da geocodificação de endereços das obras, siga os passos abaixo:

### Passo a Passo:

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **APIs & Services** > **Library**
4. Busque por **"Geocoding API"**
5. Clique em **"Enable"** (Habilitar)
6. Configure o billing se solicitado
7. A mesma API key configurada em `VITE_GOOGLE_MAPS_API_KEY` será usada automaticamente

### Como verificar se está funcionando:

No console do navegador, após tentar geocodificar um endereço, você verá:
- ✅ `"Coordenadas encontradas via Google Maps"` = Funcionando corretamente
- ⚠️ `"Google Maps API: Geocoding API não está habilitada"` = Precisa habilitar a API

### Benefícios:

- ✅ Maior precisão para endereços novos e recentes
- ✅ Melhor cobertura de loteamentos e áreas em expansão
- ✅ Geocodificação de áreas rurais
- ✅ Validação automática de endereços
- ✅ Redução de coordenadas aproximadas (centro da cidade)

### Sistema de Fallback:

O sistema usa uma estratégia em cascata:
1. **Google Maps Geocoding API** (mais precisa) - se disponível
2. **OpenStreetMap Nominatim** (gratuita) - fallback automático
3. **Coordenadas aproximadas** - centro da cidade como última opção

### Indicadores de Precisão:

Cada obra exibe um badge indicando a precisão das coordenadas:
- 🟢 **Coordenadas Precisas**: Obtidas via Google Maps ou endereço específico
- 🟡 **Coordenadas Aproximadas**: Centro da cidade (necessita ajuste manual)
- 🔵 **Coordenadas Manuais**: Selecionadas pelo usuário no mapa
