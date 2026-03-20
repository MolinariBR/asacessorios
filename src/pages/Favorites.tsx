import { Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/lib/store';
import { useProducts } from '@/hooks/use-products';

const Favorites = () => {
  const favorites = useStore((s) => s.favorites);
  const { data: products = [] } = useProducts();
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Voltar à loja
        </Link>

        <h2 className="font-display text-3xl font-semibold text-foreground mb-8">
          Meus Favoritos
        </h2>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
            <p className="text-muted-foreground font-body mb-6">
              Você ainda não tem favoritos. Explore nossa coleção!
            </p>
            <Link
              to="/"
              className="btn-gold inline-block px-8 py-3 rounded-sm text-sm uppercase tracking-[0.2em]"
            >
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <StoreFooter />
    </div>
  );
};

export default Favorites;
