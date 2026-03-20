import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Heart, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { useProducts } from '@/hooks/use-products';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

export interface HeaderFilterState {
  priceRange: [number, number];
  colors: string[];
}

interface FilterDropdownProps {
  label: string;
  active: boolean;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}

function FilterDropdown({ label, active, children, open, onToggle }: FilterDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 text-xs tracking-widest uppercase font-body px-3 py-1.5 border rounded-sm transition-colors ${
          active
            ? 'border-primary bg-primary/10 text-foreground'
            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
        }`}
      >
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-sm shadow-lg z-50 min-w-[220px] p-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export function StoreHeader({
  filters,
  onFiltersChange,
  priceMin,
  priceMax,
  colors,
}: {
  filters?: HeaderFilterState;
  onFiltersChange?: (f: HeaderFilterState) => void;
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
}) {
  const cart = useStore((s) => s.cart);
  const favorites = useStore((s) => s.favorites);
  const { data: products = [] } = useProducts();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const pMin = priceMin ?? 0;
  const pMax = priceMax ?? 1000;
  const availableColors = colors ?? [];

  const searchResults = searchQuery.trim().length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.color.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const toggleColor = (color: string) => {
    if (!filters || !onFiltersChange) return;
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: next });
  };

  const hasPriceFilter = filters && (filters.priceRange[0] > pMin || filters.priceRange[1] < pMax);
  const hasColorFilter = filters && filters.colors.length > 0;
  const hasAnyFilter = hasPriceFilter || hasColorFilter;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" aria-label="AS Acessórios - Início" className="flex items-center">
          <img
            src="/icon-192.png"
            alt="Logo AS Acessórios"
            className="h-8 w-8 md:h-9 md:w-9 rounded-sm object-cover"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
          <Link to="/novidades" className="hover:text-foreground transition-colors">Novidades</Link>
          <Link to="/categorias" className="hover:text-foreground transition-colors">Categorias</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            {searchOpen ? <X className="h-5 w-5 text-secondary" strokeWidth={1.5} /> : <Search className="h-5 w-5 text-secondary" strokeWidth={1.5} />}
          </button>

          <Link to="/favoritos" className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <Heart className="h-5 w-5 text-secondary" strokeWidth={1.5} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {favorites.length}
              </span>
            )}
          </Link>

          <a
            href="https://www.instagram.com/as.acessorios_as"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>

          <Link to="/carrinho" className="relative p-2 hover:bg-muted rounded-full transition-colors">
            <ShoppingBag className="h-5 w-5 text-secondary" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search + Filter bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background animate-fade-in">
          <div className="container mx-auto px-6 py-3 relative">
            <input
              autoFocus
              type="text"
              placeholder="Buscar por nome, categoria ou cor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            />

            {/* Filter dropdowns */}
            {filters && onFiltersChange && (
              <div className="flex items-center gap-3 mt-3">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

                <FilterDropdown
                  label="Preço"
                  active={!!hasPriceFilter}
                  open={openDropdown === 'price'}
                  onToggle={() => toggleDropdown('price')}
                >
                  <div className="space-y-3">
                    <Slider
                      min={pMin}
                      max={pMax}
                      step={1}
                      value={filters.priceRange}
                      onValueChange={(v) => onFiltersChange({ ...filters, priceRange: v as [number, number] })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-body">
                      <span>R$ {filters.priceRange[0].toFixed(0)}</span>
                      <span>R$ {filters.priceRange[1].toFixed(0)}</span>
                    </div>
                  </div>
                </FilterDropdown>

                {availableColors.length > 0 && (
                  <FilterDropdown
                    label={`Cor${filters.colors.length > 0 ? ` (${filters.colors.length})` : ''}`}
                    active={!!hasColorFilter}
                    open={openDropdown === 'color'}
                    onToggle={() => toggleDropdown('color')}
                  >
                    <div className="space-y-2 max-h-48 overflow-auto">
                      {availableColors.map((color) => (
                        <label key={color} className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox
                            checked={filters.colors.includes(color)}
                            onCheckedChange={() => toggleColor(color)}
                          />
                          <span className="text-sm font-body text-muted-foreground group-hover:text-foreground transition-colors">
                            {color}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterDropdown>
                )}

                {hasAnyFilter && (
                  <button
                    onClick={() => onFiltersChange({ priceRange: [pMin, pMax], colors: [] })}
                    className="flex items-center gap-1 text-xs tracking-widest uppercase font-body text-muted-foreground hover:text-foreground transition-colors ml-auto"
                  >
                    <X className="h-3 w-3" />
                    Limpar filtros
                  </button>
                )}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="absolute left-6 right-6 top-full bg-background border border-border rounded-sm shadow-lg z-50 max-h-80 overflow-auto">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate(`/produto/${product.id}`);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-sm object-cover" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                        {product.color ? ` · ${product.color}` : ''}
                        {' · '}R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <div className="absolute left-6 right-6 top-full bg-background border border-border rounded-sm shadow-lg z-50 px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
