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

function mapHeroSlideRow(s: any): HeroSlide {
  return {
    id: s.id,
    sortOrder: s.sort_order,
    image: withCacheVersion(s.image),
    subtitle: s.subtitle,
    title: s.title,
    description: s.description,
    ctaText: s.cta_text,
    ctaLink: s.cta_link,
    active: s.active,
  };
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
      return (data ?? []).map(mapHeroSlideRow);
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
      return (data ?? []).map(mapHeroSlideRow);
    },
  });
}

export function useAddHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slide: Omit<HeroSlide, 'id'>) => {
      const { data, error } = await supabase.from('hero_slides').insert({
        sort_order: slide.sortOrder,
        image: slide.image,
        subtitle: slide.subtitle,
        title: slide.title,
        description: slide.description,
        cta_text: slide.ctaText,
        cta_link: slide.ctaLink,
        active: slide.active,
      }).select('*').single();
      if (error) throw error;
      return data;
    },
    onSuccess: (createdRow) => {
      const created = mapHeroSlideRow(createdRow);
      qc.setQueryData<HeroSlide[]>(['hero_slides_all'], (current = []) => [...current, created]);
      qc.setQueryData<HeroSlide[]>(['hero_slides'], (current = []) =>
        created.active ? [...current, created] : current
      );
      qc.invalidateQueries({ queryKey: ['hero_slides'] });
      qc.invalidateQueries({ queryKey: ['hero_slides_all'] });
    },
  });
}

export function useUpdateHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slide: HeroSlide) => {
      const { data, error } = await supabase.from('hero_slides').update({
        sort_order: slide.sortOrder,
        image: slide.image,
        subtitle: slide.subtitle,
        title: slide.title,
        description: slide.description,
        cta_text: slide.ctaText,
        cta_link: slide.ctaLink,
        active: slide.active,
      }).eq('id', slide.id).select('*').single();
      if (error) throw error;
      return data;
    },
    onSuccess: (updatedRow) => {
      const updated = mapHeroSlideRow(updatedRow);
      qc.setQueryData<HeroSlide[]>(['hero_slides_all'], (current = []) =>
        current.map((slide) => (slide.id === updated.id ? updated : slide))
      );
      qc.setQueryData<HeroSlide[]>(['hero_slides'], (current = []) => {
        const withoutUpdated = current.filter((slide) => slide.id !== updated.id);
        if (!updated.active) return withoutUpdated;
        return [...withoutUpdated, updated].sort((a, b) => a.sortOrder - b.sortOrder);
      });
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
    onSuccess: (_, deletedId) => {
      qc.setQueryData<HeroSlide[]>(['hero_slides_all'], (current = []) =>
        current.filter((slide) => slide.id !== deletedId)
      );
      qc.setQueryData<HeroSlide[]>(['hero_slides'], (current = []) =>
        current.filter((slide) => slide.id !== deletedId)
      );
      qc.invalidateQueries({ queryKey: ['hero_slides'] });
      qc.invalidateQueries({ queryKey: ['hero_slides_all'] });
    },
  });
}
