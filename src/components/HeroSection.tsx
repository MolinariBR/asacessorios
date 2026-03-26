import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroSlides } from '@/hooks/use-hero-slides';

export function HeroSection() {
  const { data: slides = [], isFetched } = useHeroSlides();
  const [current, setCurrent] = useState(0);

  const hasSlides = slides.length > 0;
  const activeSlides = hasSlides ? slides : [{
    id: 'default',
    sortOrder: 0,
    image: '',
    subtitle: 'Nova Coleção',
    title: 'Estilo que você carrega',
    description: 'Bolsas com design contemporâneo e acabamento premium para o seu dia a dia.',
    ctaText: 'Ver Coleção',
    ctaLink: '#produtos',
    active: true,
  }];

  const total = activeSlides.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Auto-advance every 5s
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, total]);

  // Reset index if slides change
  useEffect(() => { setCurrent(0); }, [slides]);

  const slide = activeSlides[current];

  if (!isFetched && !hasSlides) {
    return (
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted/60" />
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Slides */}
      {activeSlides.map((s, i) => (
        s.image ? (
          <img
            key={s.id}
            src={s.image}
            alt={s.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      <div className="relative h-full flex flex-col justify-end pb-16 px-6 container mx-auto">
        <div className="max-w-lg fade-in" key={slide.id}>
          <p className="text-xs tracking-[0.3em] uppercase text-white/80 font-body mb-3 drop-shadow-md">
            {slide.subtitle}
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            {slide.title}
          </h2>
          <p className="text-white/90 font-body text-base mb-6 leading-relaxed drop-shadow-md" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {slide.description}
          </p>
          <a
            href={slide.ctaLink}
            className="btn-gold inline-block px-8 py-3 rounded-sm text-sm uppercase tracking-[0.2em]"
          >
            {slide.ctaText}
          </a>
        </div>

        {/* Navigation */}
        {total > 1 && (
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-background/50 text-foreground backdrop-blur-sm hover:bg-background/80 transition-colors"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-primary w-6' : 'bg-foreground/30'
                  }`}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full bg-background/50 text-foreground backdrop-blur-sm hover:bg-background/80 transition-colors"
              aria-label="Próximo slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
