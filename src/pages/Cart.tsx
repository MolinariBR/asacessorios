import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { useStore } from '@/lib/store';
import { getPrimaryProductImage } from '@/lib/product-images';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
            Seu carrinho está vazio
          </h2>
          <p className="text-muted-foreground font-body mb-8">
            Explore nossa coleção e encontre peças que combinam com você.
          </p>
          <Link
            to="/"
            className="btn-gold inline-block px-8 py-3 rounded-sm text-sm uppercase tracking-[0.2em]"
          >
            Ver Produtos
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="container mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>

        <h2 className="font-display text-3xl font-semibold text-foreground mb-8">Carrinho</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 pb-6 border-b border-border fade-in">
                <img
                  src={getPrimaryProductImage(product.image)}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-sm"
                />
                <div className="flex-1">
                  <h3 className="font-display text-lg font-medium text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground font-body">{product.category}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="p-1 border border-border rounded-sm hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-body text-sm w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="p-1 border border-border rounded-sm hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="font-display text-xl font-semibold text-foreground">
                  R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 p-6 rounded-sm h-fit space-y-4">
            <h3 className="font-display text-xl font-semibold text-foreground">Resumo</h3>
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-muted-foreground">Calculado no checkout</span>
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-display text-xl font-semibold">
              <span>Total</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <Link
              to="/checkout"
              className="btn-gold block text-center py-3 rounded-sm text-sm uppercase tracking-[0.2em] mt-4"
            >
              Finalizar Compra
            </Link>
          </div>
        </div>
      </div>
      <StoreFooter />
    </div>
  );
};

export default Cart;
