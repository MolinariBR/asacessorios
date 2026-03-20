import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SeoConfig = {
  title: string;
  description: string;
  robots: 'index,follow' | 'noindex,nofollow';
};

const DEFAULT_BASE_URL = 'https://asacessorios.vercel.app';
const SITE_NAME = 'AS Acessórios';

function ensureMetaByName(name: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  return tag;
}

function ensureMetaByProperty(property: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  return tag;
}

function ensureCanonicalLink() {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  return link;
}

function getSeoForPath(pathname: string): SeoConfig {
  if (pathname === '/') {
    return {
      title: `${SITE_NAME} | Bolsas e Acessórios Femininos`,
      description: 'AS Acessórios: bolsas e acessórios femininos com curadoria e acabamento premium.',
      robots: 'index,follow',
    };
  }

  if (pathname === '/admin' || pathname === '/checkout' || pathname === '/carrinho' || pathname === '/favoritos') {
    return {
      title: `${SITE_NAME} | Área Interna`,
      description: 'Área interna da loja.',
      robots: 'noindex,nofollow',
    };
  }

  if (pathname === '/novidades') {
    return {
      title: `${SITE_NAME} | Novidades`,
      description: 'Confira as novidades em bolsas e acessórios selecionados pela AS Acessórios.',
      robots: 'index,follow',
    };
  }

  if (pathname === '/categorias') {
    return {
      title: `${SITE_NAME} | Categorias`,
      description: 'Explore os produtos por categorias e encontre o acessório ideal.',
      robots: 'index,follow',
    };
  }

  if (pathname.startsWith('/produto/')) {
    return {
      title: `${SITE_NAME} | Produto`,
      description: 'Detalhes do produto selecionado na AS Acessórios.',
      robots: 'index,follow',
    };
  }

  return {
    title: `${SITE_NAME} | Página não encontrada`,
    description: 'Página não encontrada.',
    robots: 'noindex,nofollow',
  };
}

export function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
    const pathname = location.pathname || '/';
    const currentUrl = `${baseUrl}${pathname === '/' ? '/' : pathname}`;
    const seo = getSeoForPath(pathname);

    document.title = seo.title;

    ensureMetaByName('description').setAttribute('content', seo.description);
    ensureMetaByName('robots').setAttribute('content', seo.robots);

    ensureMetaByName('twitter:title').setAttribute('content', seo.title);
    ensureMetaByName('twitter:description').setAttribute('content', seo.description);

    ensureMetaByProperty('og:title').setAttribute('content', seo.title);
    ensureMetaByProperty('og:description').setAttribute('content', seo.description);
    ensureMetaByProperty('og:url').setAttribute('content', currentUrl);

    ensureCanonicalLink().setAttribute('href', currentUrl);
  }, [location.pathname]);

  return null;
}
