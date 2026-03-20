import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '@/hooks/use-products';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((s) => s.addToCart);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFavorite = useStore((s) => s.favorites.includes(product.id));

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  return (
    <div className="group fade-in">
      <Link to={`/produto/${product.id}`}>
        <div className="relative overflow-hidden rounded-sm bg-muted aspect-square mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover product-image-zoom"
            loading="lazy"
          />
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background transition-colors z-10"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'fill-destructive text-destructive' : 'text-foreground'
              }`}
              strokeWidth={1.5}
            />
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-xs tracking-widest uppercase text-muted-foreground font-body">
            {product.category}
          </p>
          <h3 className="font-display text-xl font-medium text-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between pt-4">
        <span className="font-body text-lg font-semibold text-foreground">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </span>
        <button
          onClick={handleAdd}
          className="btn-gold px-6 py-2.5 rounded-sm text-sm uppercase tracking-widest"
        >
          Comprar
        </button>
      </div>
    </div>
  );
}
