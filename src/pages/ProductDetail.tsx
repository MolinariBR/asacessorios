import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { useProducts } from '@/hooks/use-products';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: products = [], isLoading } = useProducts();
  const addToCart = useStore((s) => s.addToCart);
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container mx-auto px-6 py-20 text-center text-muted-foreground font-body">Carregando...</div>
        <StoreFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Produto não encontrado</h1>
          <Link to="/" className="text-primary underline">Voltar à loja</Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id);

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <div className="container mx-auto px-6 py-8">
        <Link to="/#produtos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="overflow-hidden rounded-sm bg-muted aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{product.name}</h1>
            <p className="text-muted-foreground font-body leading-relaxed">{product.description}</p>
            <span className="font-display text-3xl font-semibold text-foreground">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <button onClick={handleAdd} className="btn-gold px-8 py-3 rounded-sm text-sm uppercase tracking-widest w-fit">
              Adicionar ao carrinho
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-8">Você também pode gostar</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/produto/${p.id}`} className="group">
                  <div className="overflow-hidden rounded-sm bg-muted aspect-square mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover product-image-zoom" loading="lazy" />
                  </div>
                  <h3 className="font-display text-sm font-medium text-foreground">{p.name}</h3>
                  <span className="font-display text-sm text-foreground">R$ {p.price.toFixed(2).replace('.', ',')}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <StoreFooter />
    </div>
  );
};

export default ProductDetail;
