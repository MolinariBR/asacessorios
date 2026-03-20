# Guia de Migração para seu próprio Supabase

Este guia explica como conectar este projeto a uma conta Supabase sua, mantendo o painel `/admin` aberto, sem autenticação no app.

## 1. Criar conta e projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie sua conta.
2. Clique em **New Project**.
3. Defina nome, senha do banco e região.
4. Aguarde o provisionamento do projeto.

## 2. Criar as tabelas no banco de dados

No painel do Supabase, abra **SQL Editor** e execute:

```sql
-- Produtos
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configurações da loja
CREATE TABLE public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT NOT NULL DEFAULT '5511999999999',
  store_name TEXT NOT NULL DEFAULT 'AS Acessórios',
  store_address TEXT NOT NULL DEFAULT 'Rua Exemplo, 123 - Centro',
  store_cep TEXT NOT NULL DEFAULT '01000-000',
  default_freight NUMERIC(10,2) NOT NULL DEFAULT 15.00,
  hero_image TEXT NOT NULL DEFAULT '',
  hero_subtitle TEXT NOT NULL DEFAULT 'Nova Coleção',
  hero_title TEXT NOT NULL DEFAULT 'Estilo que você carrega',
  hero_description TEXT NOT NULL DEFAULT 'Bolsas com design contemporâneo e acabamento premium para o seu dia a dia.',
  hero_cta_text TEXT NOT NULL DEFAULT 'Ver Coleção',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Zonas de frete
CREATE TABLE public.freight_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  distance_min NUMERIC(10,2) NOT NULL DEFAULT 0,
  distance_max NUMERIC(10,2) NOT NULL DEFAULT 0,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cupons
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Slides do carrossel principal
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cta_text TEXT NOT NULL DEFAULT '',
  cta_link TEXT NOT NULL DEFAULT '#produtos',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 3. Configurar o bucket de imagens dos banners

Ainda no **SQL Editor**, execute:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true);
```

## 4. Configurar Row Level Security (RLS)

Como este projeto usa o `/admin` sem autenticação, as políticas abaixo liberam leitura e escrita para `public`.

```sql
-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freight_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Products
CREATE POLICY "Public read products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE TO public USING (true);

-- Store Settings
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT TO public USING (true);
CREATE POLICY "Public insert store_settings" ON public.store_settings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update store_settings" ON public.store_settings FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Freight Zones
CREATE POLICY "Public read freight_zones" ON public.freight_zones FOR SELECT TO public USING (true);
CREATE POLICY "Public insert freight_zones" ON public.freight_zones FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update freight_zones" ON public.freight_zones FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public delete freight_zones" ON public.freight_zones FOR DELETE TO public USING (true);

-- Coupons
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT TO public USING (true);
CREATE POLICY "Public insert coupons" ON public.coupons FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update coupons" ON public.coupons FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public delete coupons" ON public.coupons FOR DELETE TO public USING (true);

-- Hero Slides
CREATE POLICY "Public read hero_slides" ON public.hero_slides FOR SELECT TO public USING (true);
CREATE POLICY "Public insert hero_slides" ON public.hero_slides FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update hero_slides" ON public.hero_slides FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public delete hero_slides" ON public.hero_slides FOR DELETE TO public USING (true);

-- Storage: hero-images
CREATE POLICY "Public read hero-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'hero-images');

CREATE POLICY "Public insert hero-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Public update hero-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'hero-images')
WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Public delete hero-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'hero-images');
```

## 5. Inserir dados iniciais

O registro de `store_settings` deve existir para o app funcionar corretamente.

```sql
INSERT INTO public.store_settings (
  whatsapp_number,
  store_name,
  store_address,
  store_cep,
  default_freight,
  hero_image,
  hero_subtitle,
  hero_title,
  hero_description,
  hero_cta_text
) VALUES (
  '5511999999999',
  'AS Acessórios',
  'Rua Exemplo, 123 - Centro',
  '01000-000',
  15.00,
  '',
  'Nova Coleção',
  'Estilo que você carrega',
  'Bolsas com design contemporâneo e acabamento premium para o seu dia a dia.',
  'Ver Coleção'
);
```

Se quiser começar com banners prontos:

```sql
INSERT INTO public.hero_slides (sort_order, subtitle, title, description, cta_text, cta_link) VALUES
  (0, 'Nova Coleção', 'Estilo que você carrega', 'Bolsas com design contemporâneo e acabamento premium para o seu dia a dia.', 'Ver Coleção', '#produtos'),
  (1, 'Joias', 'Brilho e Elegância', 'Joias que complementam seu estilo com sofisticação e delicadeza.', 'Ver Joias', '/categorias'),
  (2, 'Óculos', 'Visão com Estilo', 'Óculos que combinam proteção e design para todos os momentos.', 'Ver Óculos', '/categorias');
```

## 6. Exportar o código para o GitHub

Se o projeto ainda estiver só no Lovable:

1. No editor do Lovable, vá em **Settings → GitHub → Connect project**.
2. Autorize o app do GitHub.
3. Crie ou conecte o repositório.
4. Clone localmente:

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

Se o projeto já estiver local ou versionado, pode pular esta etapa.

## 7. Atualizar as credenciais do Supabase

Crie um arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key_aqui
```

Esses valores ficam em **Supabase Dashboard → Settings → API**.

## 8. Instalar dependências e rodar localmente

```bash
npm install
npm run dev
```

A aplicação passará a usar o seu projeto Supabase.

## 9. Deploy

Você pode publicar em qualquer host compatível com Vite/React.

### Vercel

1. Importe o repositório.
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Faça o deploy.

### Netlify

1. Importe o repositório.
2. Use `npm run build` como build command.
3. Use `dist` como publish directory.
4. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.

## 10. Painel admin

O painel fica em `/admin` e, neste projeto, ele é aberto mesmo.

- Não existe login no app.
- Não é necessário criar usuário no Supabase.
- Produtos, cupons, frete, configurações da loja e banners são gerenciados diretamente por essa rota.

## Resumo da Arquitetura

| Dado | Armazenamento |
|------|---------------|
| Produtos | Supabase (`products`) |
| Configurações da loja | Supabase (`store_settings`) |
| Zonas de frete | Supabase (`freight_zones`) |
| Cupons | Supabase (`coupons`) |
| Banners principais | Supabase (`hero_slides`) |
| Imagens dos banners | Supabase Storage (`hero-images`) |
| Carrinho | `localStorage` |
| Favoritos | `localStorage` |

## Suporte

- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Vite](https://vitejs.dev/guide/)
- [Documentação do React Router](https://reactrouter.com/)
