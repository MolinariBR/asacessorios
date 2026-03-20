import { useMemo } from 'react';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/use-products';

const Novidades = () => {
  const { data: products = [], isLoading } = useProducts();

  const newest = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 12);
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body mb-2">
            Acabou de chegar
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Novidades
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-3 max-w-md mx-auto">
            Confira os produtos mais recentes da nossa coleção.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-body">Carregando...</div>
        ) : newest.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-body">Nenhum produto encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {newest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <StoreFooter />
    </div>
  );
};

export default Novidades;
