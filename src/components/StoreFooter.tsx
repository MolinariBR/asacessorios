import { Shield, RefreshCw, CreditCard, Lock } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
import { Link } from 'react-router-dom';

export function StoreFooter() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="font-display text-lg font-medium text-foreground">Qualidade Premium</h4>
              <p className="text-sm text-muted-foreground font-body mt-1">
                Materiais selecionados com acabamento de alta qualidade e durabilidade.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="font-display text-lg font-medium text-foreground">Trocas Simples</h4>
              <p className="text-sm text-muted-foreground font-body mt-1">
                Troca facilitada em até 7 dias após o recebimento.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="font-display text-lg font-medium text-foreground">Pagamento Flexível</h4>
              <p className="text-sm text-muted-foreground font-body mt-1">
                Pix, cartão de crédito/débito e parcelamento disponíveis.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center">
          <p className="font-display text-xl font-semibold text-secondary mb-2">AS Acessórios</p>
          <p className="text-xs text-muted-foreground font-body tracking-wide">
            © {new Date().getFullYear()} AS Acessórios. Todos os direitos reservados.
          </p>
          <a
            href="https://www.instagram.com/as.acessorios_as"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-body mt-3"
          >
            <InstagramIcon className="h-5 w-5" />
            @as.acessorios_as
          </a>
          <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors font-body mt-2">
            <Lock className="h-3 w-3" />
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}
