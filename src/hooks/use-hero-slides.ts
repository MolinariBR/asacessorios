import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { withCacheVersion } from '@/lib/image-cache';

export interface HeroSlide {
  id: string;
  sortOrder: number;
  image: string;
  subtitle: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

export function useHeroSlides() {
  return useQuery({
    queryKey: ['hero_slides'],
    queryFn: async (): Promise<HeroSlide[]> => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((s) => ({
        id: s.id,
        sortOrder: s.sort_order,
        image: withCacheVersion(s.image),
        subtitle: s.subtitle,
        title: s.title,
        description: s.description,
        ctaText: s.cta_text,
        ctaLink: s.cta_link,
        active: s.active,
      }));
    },
  });
}

export function useAllHeroSlides() {
  return useQuery({
    queryKey: ['hero_slides_all'],
    queryFn: async (): Promise<HeroSlide[]> => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((s) => ({
        id: s.id,
        sortOrder: s.sort_order,
        image: withCacheVersion(s.image),
        subtitle: s.subtitle,
        title: s.title,
        description: s.description,
        ctaText: s.cta_text,
        ctaLink: s.cta_link,
        active: s.active,
      }));
    },
  });
}

export function useAddHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slide: Omit<HeroSlide, 'id'>) => {
      const { error } = await supabase.from('hero_slides').insert({
        sort_order: slide.sortOrder,
        image: slide.image,
        subtitle: slide.subtitle,
        title: slide.title,
        description: slide.description,
        cta_text: slide.ctaText,
        cta_link: slide.ctaLink,
        active: slide.active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero_slides'] });
      qc.invalidateQueries({ queryKey: ['hero_slides_all'] });
    },
  });
}

export function useUpdateHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slide: HeroSlide) => {
      const { error } = await supabase.from('hero_slides').update({
        sort_order: slide.sortOrder,
        image: slide.image,
        subtitle: slide.subtitle,
        title: slide.title,
        description: slide.description,
        cta_text: slide.ctaText,
        cta_link: slide.ctaLink,
        active: slide.active,
      }).eq('id', slide.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero_slides'] });
      qc.invalidateQueries({ queryKey: ['hero_slides_all'] });
    },
  });
}

export function useDeleteHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hero_slides'] });
      qc.invalidateQueries({ queryKey: ['hero_slides_all'] });
    },
  });
}
