import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StoreHeader } from '@/components/StoreHeader';
import { StoreFooter } from '@/components/StoreFooter';
import { useProducts } from '@/hooks/use-products';
import { useStore } from '@/lib/store';
import { getPrimaryProductImage } from '@/lib/product-images';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: products = [], isLoading } = useProducts();
  const addToCart = useStore((s) => s.addToCart);
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  const productImages = useMemo(() => {
    if (product?.images && product.images.length > 0) return product.images;
    return [getPrimaryProductImage(product?.image)];
  }, [product?.image, product?.images]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mobileCarouselApi, setMobileCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id, productImages.length]);

  const clampImageIndex = (index: number) => {
    if (productImages.length === 0) return 0;
    return (index + productImages.length) % productImages.length;
  };

  useEffect(() => {
    if (!mobileCarouselApi) return;
    const onSelect = () => setSelectedImageIndex(mobileCarouselApi.selectedScrollSnap());
    onSelect();
    mobileCarouselApi.on('select', onSelect);
    mobileCarouselApi.on('reInit', onSelect);
    return () => {
      mobileCarouselApi.off('select', onSelect);
      mobileCarouselApi.off('reInit', onSelect);
    };
  }, [mobileCarouselApi]);

  useEffect(() => {
    if (!mobileCarouselApi) return;
    const current = mobileCarouselApi.selectedScrollSnap();
    if (current !== selectedImageIndex) mobileCarouselApi.scrollTo(selectedImageIndex);
  }, [mobileCarouselApi, selectedImageIndex]);

  const selectedImage = productImages[clampImageIndex(selectedImageIndex)];

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
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex md:flex-row gap-4 md:items-start">
            <div className="hidden md:block md:w-[88px]">
              <div
                className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible md:overflow-y-auto scrollbar-hide"
                style={{ touchAction: 'pan-x' }}
              >
                {productImages.map((image, index) => {
                  const isActive = index === selectedImageIndex;
                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`shrink-0 overflow-hidden rounded-sm border transition-colors ${
                        isActive ? 'border-primary' : 'border-border hover:border-foreground/30'
                      }`}
                      aria-label={`Ver imagem ${index + 1} do produto`}
                      aria-current={isActive ? 'true' : 'false'}
                    >
                      <img
                        src={image}
                        alt={`${product.name} miniatura ${index + 1}`}
                        className="h-20 w-20 object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:block overflow-hidden rounded-sm bg-muted aspect-square flex-1">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="md:hidden max-w-[420px] mx-auto">
              <Carousel
                setApi={setMobileCarouselApi}
                opts={{ align: 'center', loop: productImages.length > 1 }}
                className="w-full"
              >
                <CarouselContent className="-ml-3">
                  {productImages.map((image, index) => (
                    <CarouselItem key={`${image}-mobile-${index}`} className="pl-3 basis-[86%]">
                      <div className="overflow-hidden rounded-sm bg-muted aspect-[2/3]">
                        <img src={image} alt={`${product.name} foto ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
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
            {productImages.length > 1 && (
              <p className="text-xs text-muted-foreground font-body">No celular, deslize lateralmente na foto para navegar pela galeria.</p>
            )}
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
