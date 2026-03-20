# AS Acessórios

Loja virtual em React + Vite com painel administrativo em `/admin`, banco Supabase e deploy na Vercel.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Supabase (database + storage)
- Vercel (deploy)

## Requisitos

- Node.js 20+
- npm 10+

## Ambiente local

1. Clone o repositório:

```bash
git clone https://github.com/MolinariBR/asacessorios.git
cd asacessorios
```

2. Instale dependências:

```bash
npm install
```

3. Crie `.env.local`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA
VITE_SITE_URL=https://asacessorios.vercel.app
```

4. Rode localmente:

```bash
npm run dev
```

## Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de produção
- `npm run preview`: preview local do build
- `npm run test`: testes com Vitest
- `npm run lint`: lint

## Supabase

- As migrações SQL estão em `supabase/migrations`.
- Guia operacional: `MIGRATION_GUIDE.md`.
- O painel `/admin` permanece aberto (sem autenticação no app), conforme decisão do projeto.

## Deploy na Vercel

1. Conecte o repositório no painel da Vercel.
2. Configure variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SITE_URL` (ex.: `https://asacessorios.vercel.app`)
3. Faça deploy pelo branch `main`.

## SEO implementado no projeto

- Metadados principais (`title`, `description`, Open Graph e Twitter Cards).
- Canonical por rota.
- `robots` por rota:
  - páginas públicas: `index,follow`
  - rotas internas (`/admin`, `/checkout`, `/carrinho`, `/favoritos`): `noindex,nofollow`
- `robots.txt` e `sitemap.xml` públicos.
- Structured data (`schema.org/Store`) no `index.html`.
