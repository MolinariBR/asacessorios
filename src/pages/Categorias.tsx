import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { useProducts } from '@/hooks/use-products';

const Categorias = () => {
  const { data: products = [], isLoading } = useProducts();

  const categoryData = useMemo(() => {
    const map = new Map<string, { count: number; image: string }>();
    products.forEach((p) => {
      if (!p.category) return;
      if (!map.has(p.category)) {
        map.set(p.category, { count: 0, image: p.image });
      }
      map.get(p.category)!.count++;
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      image: data.image,
    }));
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body mb-2">
            Explore
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Categorias
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-3 max-w-md mx-auto">
            Encontre o estilo perfeito navegando pelas nossas categorias.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-body">Carregando...</div>
        ) : categoryData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-body">Nenhuma categoria encontrada.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.map((cat) => (
              <Link
                key={cat.name}
                to={`/?categoria=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-sm aspect-[4/3] block"
              >
                <img
                  src={cat.image || '/placeholder.svg'}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl font-semibold text-background">{cat.name}</h3>
                  <p className="text-background/70 font-body text-sm mt-1">
                    {cat.count} {cat.count === 1 ? 'produto' : 'produtos'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <StoreFooter />
    </div>
  );
};

export default Categorias;
