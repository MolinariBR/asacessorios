import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Tag, X } from 'lucide-react';
import { z } from 'zod';
import { StoreHeader } from '@/components/StoreHeader';
import { useStore } from '@/lib/store';
import { useStoreSettings, useFreightZones, useCoupons, FreightZone } from '@/hooks/use-settings';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Nome é obrigatório').max(100),
  bairro: z.string().trim().min(2, 'Bairro é obrigatório').max(100),
  rua: z.string().trim().min(2, 'Rua é obrigatória').max(200),
  numero: z.string().trim().min(1, 'Número é obrigatório').max(20),
  cep: z.string().trim().min(5, 'CEP inválido').max(9),
  whatsapp: z.string().trim().min(10, 'WhatsApp inválido').max(15),
  distancia: z.string().trim().min(1, 'Informe a distância'),
  paymentMethod: z.enum(['pix', 'credito', 'debito', 'parcelado']),
  installments: z.number().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

function calculateFreightByDistance(distanceKm: number, zones: FreightZone[], defaultFreight: number): { price: number; zoneName: string } {
  if (distanceKm <= 0) return { price: 0, zoneName: '' };
  for (const zone of zones) {
    if (distanceKm >= zone.distanceMin && distanceKm <= zone.distanceMax) {
      return { price: zone.price, zoneName: zone.name };
    }
  }
  return { price: defaultFreight, zoneName: 'Frete padrão' };
}

const paymentLabels: Record<string, string> = {
  pix: 'Pix',
  credito: 'Cartão de Crédito',
  debito: 'Cartão de Débito',
  parcelado: 'Parcelado',
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useStore();
  const { data: settings } = useStoreSettings();
  const { data: freightZones = [] } = useFreightZones();
  const { data: coupons = [] } = useCoupons();
  const [form, setForm] = useState<Partial<CheckoutForm>>({ paymentMethod: 'pix', distancia: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedCoupon ? subtotal * (appliedCoupon.discountPercent / 100) : 0;
  const subtotalWithDiscount = subtotal - discount;
  const distanciaNum = parseFloat(form.distancia || '0') || 0;
  const freightResult = calculateFreightByDistance(distanciaNum, freightZones, settings?.defaultFreight ?? 15);
  const frete = freightResult.price;
  const total = subtotalWithDiscount + frete;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-4">Carrinho vazio</h2>
          <Link to="/" className="btn-gold inline-block px-8 py-3 rounded-sm text-sm uppercase tracking-[0.2em]">Ver Produtos</Link>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const coupon = coupons.find((c) => c.code === code && c.active);
    if (coupon) {
      setAppliedCoupon({ code: coupon.code, discountPercent: coupon.discountPercent });
      toast.success(`Cupom "${coupon.code}" aplicado! ${coupon.discountPercent}% de desconto`);
    } else {
      toast.error('Cupom inválido ou expirado');
    }
    setCouponCode('');
  };

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }

    const data = result.data;
    const itemsText = cart
      .map((item) => `• ${item.product.name} x${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`)
      .join('\n');

    const installmentText = data.paymentMethod === 'parcelado' && data.installments
      ? ` em ${data.installments}x de R$ ${(total / data.installments).toFixed(2).replace('.', ',')}`
      : '';

    const couponText = appliedCoupon
      ? `*Cupom:* ${appliedCoupon.code} (-${appliedCoupon.discountPercent}%)\n*Desconto:* -R$ ${discount.toFixed(2).replace('.', ',')}\n`
      : '';

    const message = `🛍️ *Novo Pedido - AS Acessórios*\n\n` +
      `*Cliente:* ${data.name}\n*WhatsApp:* ${data.whatsapp}\n\n` +
      `*Endereço:*\n${data.rua}, ${data.numero}\n${data.bairro}\nCEP: ${data.cep}\n` +
      `*Distância:* ${data.distancia} km\n\n` +
      `*Produtos:*\n${itemsText}\n\n` +
      `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n` +
      couponText +
      `*Frete (${freightResult.zoneName}):* R$ ${frete.toFixed(2).replace('.', ',')}\n` +
      `*Total:* R$ ${total.toFixed(2).replace('.', ',')}${installmentText}\n\n` +
      `*Pagamento:* ${paymentLabels[data.paymentMethod]}${installmentText}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${(settings?.whatsappNumber ?? '').replace(/\D/g, '')}?text=${encodedMessage}`;

    clearCart();
    toast.success('Pedido enviado! Redirecionando para o WhatsApp...');
    window.open(whatsappUrl, '_blank');
    navigate('/');
  };

  const inputClass = "w-full bg-background border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors";
  const labelClass = "block text-xs tracking-widest uppercase text-muted-foreground font-body mb-2";

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link to="/carrinho" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </Link>

        <h2 className="font-display text-3xl font-semibold text-foreground mb-8">Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-display text-xl font-medium text-foreground">Dados Pessoais</h3>
            <div>
              <label className={labelClass}>Nome completo</label>
              <input className={inputClass} placeholder="Seu nome" value={form.name || ''} onChange={(e) => updateField('name', e.target.value)} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input className={inputClass} placeholder="(11) 99999-9999" value={form.whatsapp || ''} onChange={(e) => updateField('whatsapp', e.target.value)} />
              {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-medium text-foreground">Endereço de Entrega</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>CEP</label>
                <input className={inputClass} placeholder="00000-000" value={form.cep || ''} onChange={(e) => updateField('cep', e.target.value)} />
                {errors.cep && <p className="text-xs text-destructive mt-1">{errors.cep}</p>}
              </div>
              <div>
                <label className={labelClass}>Bairro</label>
                <input className={inputClass} placeholder="Bairro" value={form.bairro || ''} onChange={(e) => updateField('bairro', e.target.value)} />
                {errors.bairro && <p className="text-xs text-destructive mt-1">{errors.bairro}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Rua</label>
                <input className={inputClass} placeholder="Rua" value={form.rua || ''} onChange={(e) => updateField('rua', e.target.value)} />
                {errors.rua && <p className="text-xs text-destructive mt-1">{errors.rua}</p>}
              </div>
              <div>
                <label className={labelClass}>Número</label>
                <input className={inputClass} placeholder="Nº" value={form.numero || ''} onChange={(e) => updateField('numero', e.target.value)} />
                {errors.numero && <p className="text-xs text-destructive mt-1">{errors.numero}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>Distância aproximada (km)</label>
              <input className={inputClass} type="number" step="0.1" min="0" placeholder="Ex: 8" value={form.distancia || ''} onChange={(e) => updateField('distancia', e.target.value)} />
              {errors.distancia && <p className="text-xs text-destructive mt-1">{errors.distancia}</p>}
              {distanciaNum > 0 && frete > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm font-body bg-muted/50 border border-border rounded-sm px-3 py-2">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-foreground">
                    Frete: <strong>R$ {frete.toFixed(2).replace('.', ',')}</strong>
                    <span className="text-muted-foreground ml-1 text-xs">({freightResult.zoneName})</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-medium text-foreground">Cupom de Desconto</h3>
            {appliedCoupon ? (
              <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-sm px-4 py-3">
                <Tag className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-body text-foreground flex-1">
                  <strong>{appliedCoupon.code}</strong> — {appliedCoupon.discountPercent}% de desconto aplicado
                </span>
                <button type="button" onClick={() => setAppliedCoupon(null)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <input className={inputClass} placeholder="Código do cupom" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }} />
                <button type="button" onClick={handleApplyCoupon} className="btn-ghost-brand px-6 py-3 rounded-sm text-sm uppercase tracking-widest whitespace-nowrap">Aplicar</button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-medium text-foreground">Forma de Pagamento</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['pix', 'credito', 'debito', 'parcelado'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => updateField('paymentMethod', method)}
                  className={`px-4 py-3 border rounded-sm text-xs uppercase tracking-widest font-body transition-colors ${
                    form.paymentMethod === method
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground'
                  }`}
                >
                  {paymentLabels[method]}
                </button>
              ))}
            </div>
            {form.paymentMethod === 'parcelado' && (
              <div>
                <label className={labelClass}>Parcelas</label>
                <select className={inputClass} value={form.installments || 2} onChange={(e) => updateField('installments', parseInt(e.target.value))}>
                  {[2, 3, 4, 5, 6, 10, 12].map((n) => (
                    <option key={n} value={n}>{n}x de R$ {(total / n).toFixed(2).replace('.', ',')}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-6 rounded-sm space-y-3">
            <h3 className="font-display text-xl font-semibold text-foreground">Resumo do Pedido</h3>
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">{product.name} x{quantity}</span>
                <span className="text-foreground">R$ {(product.price * quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
            {appliedCoupon && (
              <div className="flex justify-between text-sm font-body text-primary">
                <span>Cupom {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="border-t border-border pt-3 flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-foreground">{frete > 0 ? `R$ ${frete.toFixed(2).replace('.', ',')}` : 'Informe a distância'}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-display text-xl font-semibold">
              <span>Total</span>
              <span>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <button type="submit" className="btn-gold w-full py-4 rounded-sm text-sm uppercase tracking-[0.2em]">
            Confirmar e Enviar via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
