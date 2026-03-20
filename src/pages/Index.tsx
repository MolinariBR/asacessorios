import { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StoreHeader, HeaderFilterState } from '@/components/StoreHeader';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { StoreFooter } from '@/components/StoreFooter';
import { useProducts, Product } from '@/hooks/use-products';

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  );
}

function CategoryCarousel({ category, products }: { category: string; products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.8;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-semibold text-foreground">{category}</h3>
        <div className="flex gap-2 sm:hidden">
          <button onClick={() => scroll('left')} className="p-1.5 border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide sm:hidden pb-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start shrink-0 w-[75vw] max-w-[300px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

const Index = () => {
  const { data: products = [], isLoading } = useProducts();

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);
  const colors = useMemo(() => [...new Set(products.map((p) => p.color).filter(Boolean))], [products]);
  const priceMin = useMemo(() => (products.length ? Math.floor(Math.min(...products.map((p) => p.price))) : 0), [products]);
  const priceMax = useMemo(() => (products.length ? Math.ceil(Math.max(...products.map((p) => p.price))) : 1000), [products]);

  const [searchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');

  const [activeCategory, setActiveCategory] = useState<string | null>(categoriaParam);
  const [filters, setFilters] = useState<HeaderFilterState>({
    priceRange: [0, 10000],
    colors: [],
  });

  useEffect(() => {
    setActiveCategory(categoriaParam);
  }, [categoriaParam]);

  useEffect(() => {
    if (products.length) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [priceMin, priceMax],
      }));
    }
  }, [priceMin, priceMax, products.length]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      if (filters.colors.length > 0 && !filters.colors.includes(p.color)) return false;
      return true;
    });
  }, [products, activeCategory, filters]);

  const displayCategories = activeCategory ? [activeCategory] : categories;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader
        filters={filters}
        onFiltersChange={setFilters}
        priceMin={priceMin}
        priceMax={priceMax}
        colors={colors}
      />
      <HeroSection />

      <section id="produtos" className="container mx-auto px-6 py-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body mb-2">
              Curadoria
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Nossos Produtos
            </h2>
          </div>
        </AnimatedSection>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground font-body">Carregando produtos...</div>
        ) : (
          <>
            {/* Category buttons */}
            <AnimatedSection>
              <div id="categorias" className="flex justify-center gap-3 mb-10 flex-wrap">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`text-xs tracking-widest uppercase font-body px-4 py-2 border rounded-sm transition-colors ${
                    activeCategory === null
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs tracking-widest uppercase font-body px-4 py-2 border rounded-sm transition-colors ${
                      activeCategory === cat
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Mobile: carousels */}
            <div className="sm:hidden">
              {displayCategories.map((cat) => (
                <CategoryCarousel
                  key={cat}
                  category={cat}
                  products={filteredProducts.filter((p) => p.category === cat)}
                />
              ))}
            </div>

            {/* Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((product, i) => (
                <AnimatedSection key={product.id} className={`delay-[${i * 50}ms]`}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-body">Nenhum produto encontrado com os filtros selecionados</p>
              </div>
            )}
          </>
        )}
      </section>

      <StoreFooter />
    </div>
  );
};

export default Index;
