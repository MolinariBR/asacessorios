import { useState, useEffect, useRef } from 'react';
import { Package, Settings, Plus, Pencil, Trash2, Menu, X, Truck, Upload, Tag, ImagePlus, Image, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct, Product } from '@/hooks/use-products';
import {
  useStoreSettings, useUpdateStoreSettings,
  useFreightZones, useSaveFreightZones,
  useCoupons, useSaveCoupons,
  FreightZone, Coupon,
} from '@/hooks/use-settings';
import { useAllHeroSlides, useAddHeroSlide, useUpdateHeroSlide, useDeleteHeroSlide, HeroSlide } from '@/hooks/use-hero-slides';
import { toast } from 'sonner';

type Tab = 'products' | 'settings' | 'freight' | 'coupons' | 'banners';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Products
  const { data: products = [] } = useProducts();
  const addProductMut = useAddProduct();
  const updateProductMut = useUpdateProduct();
  const deleteProductMut = useDeleteProduct();

  // Settings
  const { data: settings } = useStoreSettings();
  const updateSettingsMut = useUpdateStoreSettings();

  // Freight
  const { data: freightZones = [] } = useFreightZones();
  const saveFreightMut = useSaveFreightZones();

  // Coupons
  const { data: coupons = [] } = useCoupons();
  const saveCouponsMut = useSaveCoupons();

  // Banners
  const { data: heroSlides = [] } = useAllHeroSlides();
  const addSlideMut = useAddHeroSlide();
  const updateSlideMut = useUpdateHeroSlide();
  const deleteSlideMut = useDeleteHeroSlide();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image: '', category: '', color: '' });

  // Local settings form
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: '', storeName: '', storeAddress: '', storeCep: '', defaultFreight: 15, heroImage: '',
    heroSubtitle: '', heroTitle: '', heroDescription: '', heroCtaText: '',
  });
  const [localFreightZones, setLocalFreightZones] = useState<FreightZone[]>([]);
  const [localCoupons, setLocalCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    if (settings) setSettingsForm({
      whatsappNumber: settings.whatsappNumber,
      storeName: settings.storeName,
      storeAddress: settings.storeAddress,
      storeCep: settings.storeCep,
      defaultFreight: settings.defaultFreight,
      heroImage: settings.heroImage,
      heroSubtitle: settings.heroSubtitle,
      heroTitle: settings.heroTitle,
      heroDescription: settings.heroDescription,
      heroCtaText: settings.heroCtaText,
    });
  }, [settings]);

  useEffect(() => { setLocalFreightZones(freightZones); }, [freightZones]);
  useEffect(() => { setLocalCoupons(coupons); }, [coupons]);

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', image: '', category: '', color: '' });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, description: product.description, price: product.price.toString(), image: product.image, category: product.category, color: product.color });
    setShowProductForm(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image || '/placeholder.svg',
      category: formData.category,
      color: formData.color,
    };
    try {
      if (editingProduct) {
        await updateProductMut.mutateAsync({ id: editingProduct.id, ...productData });
        toast.success('Produto atualizado!');
      } else {
        await addProductMut.mutateAsync(productData);
        toast.success('Produto adicionado!');
      }
      resetForm();
    } catch {
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMut.mutateAsync(id);
      toast.success('Produto removido');
    } catch {
      toast.error('Erro ao remover produto');
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      await updateSettingsMut.mutateAsync({ id: settings.id, ...settingsForm });
      toast.success('Configurações salvas!');
    } catch {
      toast.error('Erro ao salvar configurações');
    }
  };

  const handleSaveFreight = async () => {
    try {
      if (settings) {
        await updateSettingsMut.mutateAsync({ id: settings.id, defaultFreight: settingsForm.defaultFreight });
      }
      await saveFreightMut.mutateAsync(localFreightZones);
      toast.success('Zonas de frete salvas!');
    } catch {
      toast.error('Erro ao salvar frete');
    }
  };

  const handleSaveCoupons = async () => {
    try {
      await saveCouponsMut.mutateAsync(localCoupons);
      toast.success('Cupons salvos!');
    } catch {
      toast.error('Erro ao salvar cupons');
    }
  };

  const sidebarItems = [
    { id: 'products' as Tab, label: 'Produtos', icon: Package },
    { id: 'banners' as Tab, label: 'Banners', icon: Image },
    { id: 'freight' as Tab, label: 'Frete', icon: Truck },
    { id: 'coupons' as Tab, label: 'Cupons', icon: Tag },
    { id: 'settings' as Tab, label: 'Configurações', icon: Settings },
  ];

  const inputClass = "w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors";
  const labelClass = "block text-xs tracking-widest uppercase text-muted-foreground font-body mb-2";

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h1 className="font-display text-xl font-semibold text-foreground">Admin</h1>
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-body transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center px-6 gap-4">
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-display text-lg font-medium text-foreground capitalize">
            {activeTab === 'products' ? 'Produtos' : activeTab === 'banners' ? 'Banners do Carrossel' : activeTab === 'freight' ? 'Zonas de Frete' : activeTab === 'coupons' ? 'Cupons' : 'Configurações'}
          </h2>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-body">{products.length} produto(s)</p>
                <button onClick={() => { resetForm(); setShowProductForm(true); }} className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm text-sm">
                  <Plus className="h-4 w-4" /> Novo Produto
                </button>
              </div>

              {showProductForm && (
                <div className="bg-muted/50 p-6 rounded-sm space-y-4 fade-in">
                  <h3 className="font-display text-lg font-medium text-foreground">
                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Nome *</label>
                      <input className={inputClass} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nome do produto" />
                    </div>
                    <div>
                      <label className={labelClass}>Categoria *</label>
                      <input className={inputClass} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Ex: Colares, Brincos" />
                    </div>
                    <div>
                      <label className={labelClass}>Preço *</label>
                      <input className={inputClass} type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
                    </div>
                    <div>
                      <label className={labelClass}>URL da Imagem</label>
                      <input className={inputClass} value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                      {formData.image && (
                        <img src={formData.image} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded-sm border border-border" />
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Cor</label>
                      <input className={inputClass} value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="Ex: Preto, Marrom, Bege" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Descrição</label>
                    <textarea className={`${inputClass} resize-none h-20`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição do produto" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSaveProduct} className="btn-gold px-6 py-2 rounded-sm text-sm">
                      {editingProduct ? 'Salvar' : 'Adicionar'}
                    </button>
                    <button onClick={resetForm} className="btn-ghost-brand px-6 py-2 rounded-sm text-sm">Cancelar</button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs tracking-widest uppercase text-muted-foreground font-medium">Produto</th>
                      <th className="text-left py-3 px-4 text-xs tracking-widest uppercase text-muted-foreground font-medium">Categoria</th>
                      <th className="text-left py-3 px-4 text-xs tracking-widest uppercase text-muted-foreground font-medium">Preço</th>
                      <th className="text-right py-3 px-4 text-xs tracking-widest uppercase text-muted-foreground font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-sm" />
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                        <td className="py-3 px-4 text-foreground font-medium">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditProduct(product)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'freight' && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-body">{localFreightZones.length} zona(s) de frete</p>
                <button
                  onClick={() => {
                    const newZone: FreightZone = { id: crypto.randomUUID(), name: 'Nova Zona', distanceMin: 0, distanceMax: 0, price: 0 };
                    setLocalFreightZones([...localFreightZones, newZone]);
                  }}
                  className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm text-sm"
                >
                  <Plus className="h-4 w-4" /> Nova Zona
                </button>
              </div>

              <div>
                <label className={labelClass}>Frete Padrão (quando distância excede todas as zonas)</label>
                <input className={inputClass} type="number" step="0.01" value={settingsForm.defaultFreight} onChange={(e) => setSettingsForm({ ...settingsForm, defaultFreight: parseFloat(e.target.value) || 0 })} placeholder="15.00" />
              </div>

              <div className="space-y-4">
                {localFreightZones.map((zone, index) => (
                  <div key={zone.id} className="bg-muted/50 p-4 rounded-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-sm font-medium text-foreground">{zone.name}</h4>
                      <button onClick={() => setLocalFreightZones(localFreightZones.filter((z) => z.id !== zone.id))} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Nome</label>
                        <input className={inputClass} value={zone.name} onChange={(e) => { const z = [...localFreightZones]; z[index] = { ...zone, name: e.target.value }; setLocalFreightZones(z); }} />
                      </div>
                      <div>
                        <label className={labelClass}>Preço (R$)</label>
                        <input className={inputClass} type="number" step="0.01" value={zone.price} onChange={(e) => { const z = [...localFreightZones]; z[index] = { ...zone, price: parseFloat(e.target.value) || 0 }; setLocalFreightZones(z); }} />
                      </div>
                      <div>
                        <label className={labelClass}>Distância mín. (km)</label>
                        <input className={inputClass} type="number" step="0.1" value={zone.distanceMin} onChange={(e) => { const z = [...localFreightZones]; z[index] = { ...zone, distanceMin: parseFloat(e.target.value) || 0 }; setLocalFreightZones(z); }} />
                      </div>
                      <div>
                        <label className={labelClass}>Distância máx. (km)</label>
                        <input className={inputClass} type="number" step="0.1" value={zone.distanceMax} onChange={(e) => { const z = [...localFreightZones]; z[index] = { ...zone, distanceMax: parseFloat(e.target.value) || 0 }; setLocalFreightZones(z); }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleSaveFreight} className="btn-gold px-8 py-3 rounded-sm text-sm uppercase tracking-widest">
                Salvar Zonas de Frete
              </button>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-body">{localCoupons.length} cupom(ns)</p>
                <button
                  onClick={() => {
                    const newCoupon: Coupon = { id: crypto.randomUUID(), code: '', discountPercent: 10, active: true };
                    setLocalCoupons([...localCoupons, newCoupon]);
                  }}
                  className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm text-sm"
                >
                  <Plus className="h-4 w-4" /> Novo Cupom
                </button>
              </div>

              <div className="space-y-4">
                {localCoupons.map((coupon, index) => (
                  <div key={coupon.id} className="bg-muted/50 p-4 rounded-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="font-display text-sm font-medium text-foreground">{coupon.code || 'Novo cupom'}</span>
                      </div>
                      <button onClick={() => setLocalCoupons(localCoupons.filter((c) => c.id !== coupon.id))} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>Código</label>
                        <input className={inputClass} value={coupon.code} onChange={(e) => { const c = [...localCoupons]; c[index] = { ...coupon, code: e.target.value.toUpperCase() }; setLocalCoupons(c); }} placeholder="EX: DESCONTO10" />
                      </div>
                      <div>
                        <label className={labelClass}>Desconto (%)</label>
                        <input className={inputClass} type="number" min="1" max="100" value={coupon.discountPercent} onChange={(e) => { const c = [...localCoupons]; c[index] = { ...coupon, discountPercent: parseInt(e.target.value) || 0 }; setLocalCoupons(c); }} />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => { const c = [...localCoupons]; c[index] = { ...coupon, active: !coupon.active }; setLocalCoupons(c); }}
                          className={`w-full px-4 py-3 border rounded-sm text-xs uppercase tracking-widest font-body transition-colors ${
                            coupon.active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
                          }`}
                        >
                          {coupon.active ? 'Ativo' : 'Inativo'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleSaveCoupons} className="btn-gold px-8 py-3 rounded-sm text-sm uppercase tracking-widest">
                Salvar Cupons
              </button>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="space-y-6 fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-body">{heroSlides.length} banner(s) no carrossel</p>
                <button
                  onClick={async () => {
                    try {
                      await addSlideMut.mutateAsync({
                        sortOrder: heroSlides.length,
                        image: '',
                        subtitle: 'Novo',
                        title: 'Novo Banner',
                        description: 'Descrição do banner',
                        ctaText: 'Ver Mais',
                        ctaLink: '#produtos',
                        active: true,
                      });
                      toast.success('Banner adicionado!');
                    } catch { toast.error('Erro ao adicionar banner'); }
                  }}
                  className="btn-gold flex items-center gap-2 px-4 py-2 rounded-sm text-sm"
                >
                  <Plus className="h-4 w-4" /> Novo Banner
                </button>
              </div>

              <div className="space-y-6">
                {heroSlides.map((slide, index) => (
                  <div key={slide.id} className="bg-muted/50 p-6 rounded-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-display text-sm font-medium text-foreground">Banner {index + 1}</span>
                        <button
                          onClick={async () => {
                            try {
                              await updateSlideMut.mutateAsync({ ...slide, active: !slide.active });
                            } catch { toast.error('Erro ao atualizar'); }
                          }}
                          className={`px-3 py-1 text-xs rounded-sm border transition-colors ${
                            slide.active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
                          }`}
                        >
                          {slide.active ? 'Ativo' : 'Inativo'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        {index > 0 && (
                          <button
                            onClick={async () => {
                              const prev = heroSlides[index - 1];
                              try {
                                await updateSlideMut.mutateAsync({ ...slide, sortOrder: prev.sortOrder });
                                await updateSlideMut.mutateAsync({ ...prev, sortOrder: slide.sortOrder });
                              } catch {}
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                        )}
                        {index < heroSlides.length - 1 && (
                          <button
                            onClick={async () => {
                              const nxt = heroSlides[index + 1];
                              try {
                                await updateSlideMut.mutateAsync({ ...slide, sortOrder: nxt.sortOrder });
                                await updateSlideMut.mutateAsync({ ...nxt, sortOrder: slide.sortOrder });
                              } catch {}
                            }}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            try {
                              await deleteSlideMut.mutateAsync(slide.id);
                              toast.success('Banner removido');
                            } catch { toast.error('Erro ao remover'); }
                          }}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Imagem</label>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-border bg-card text-sm text-foreground hover:bg-accent transition-colors">
                        <ImagePlus size={16} />
                        Escolher arquivo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const ext = file.name.split('.').pop();
                            const path = `hero-${Date.now()}.${ext}`;
                            const { error } = await supabase.storage.from('hero-images').upload(path, file, { upsert: true });
                            if (error) { toast.error('Erro ao enviar imagem'); return; }
                            const { data: urlData } = supabase.storage.from('hero-images').getPublicUrl(path);
                            try {
                              await updateSlideMut.mutateAsync({ ...slide, image: urlData.publicUrl });
                              toast.success('Imagem enviada!');
                            } catch { toast.error('Erro ao salvar'); }
                          }}
                        />
                      </label>
                      {slide.image && (
                        <div className="mt-2">
                          <img src={slide.image} alt="Preview" className="w-full max-w-xs h-32 object-cover rounded-sm border border-border" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Subtítulo</label>
                        <input className={inputClass} defaultValue={slide.subtitle}
                          onBlur={async (e) => {
                            if (e.target.value !== slide.subtitle) {
                              try { await updateSlideMut.mutateAsync({ ...slide, subtitle: e.target.value }); } catch {}
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Título</label>
                        <input className={inputClass} defaultValue={slide.title}
                          onBlur={async (e) => {
                            if (e.target.value !== slide.title) {
                              try { await updateSlideMut.mutateAsync({ ...slide, title: e.target.value }); } catch {}
                            }
                          }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Descrição</label>
                        <textarea className={`${inputClass} resize-none h-16`} defaultValue={slide.description}
                          onBlur={async (e) => {
                            if (e.target.value !== slide.description) {
                              try { await updateSlideMut.mutateAsync({ ...slide, description: e.target.value }); } catch {}
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Texto do Botão</label>
                        <input className={inputClass} defaultValue={slide.ctaText}
                          onBlur={async (e) => {
                            if (e.target.value !== slide.ctaText) {
                              try { await updateSlideMut.mutateAsync({ ...slide, ctaText: e.target.value }); } catch {}
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Link do Botão</label>
                        <input className={inputClass} defaultValue={slide.ctaLink}
                          onBlur={async (e) => {
                            if (e.target.value !== slide.ctaLink) {
                              try { await updateSlideMut.mutateAsync({ ...slide, ctaLink: e.target.value }); } catch {}
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 fade-in">
              <h3 className="font-display text-lg font-medium text-foreground border-b border-border pb-2">Dados da Loja</h3>
              <div>
                <label className={labelClass}>Número do WhatsApp</label>
                <input className={inputClass} value={settingsForm.whatsappNumber} onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })} placeholder="5511999999999" />
                <p className="text-xs text-muted-foreground mt-1">Formato: código do país + DDD + número (sem espaços)</p>
              </div>
              <div>
                <label className={labelClass}>Nome da Loja</label>
                <input className={inputClass} value={settingsForm.storeName} onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Endereço da Loja</label>
                <input className={inputClass} value={settingsForm.storeAddress} onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>CEP da Loja</label>
                <input className={inputClass} value={settingsForm.storeCep} onChange={(e) => setSettingsForm({ ...settingsForm, storeCep: e.target.value })} />
              </div>
              <button onClick={handleSaveSettings} className="btn-gold px-8 py-3 rounded-sm text-sm uppercase tracking-widest">
                Salvar Configurações
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
