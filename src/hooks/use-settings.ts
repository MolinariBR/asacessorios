import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FreightZone {
  id: string;
  name: string;
  distanceMin: number;
  distanceMax: number;
  price: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
}

export interface StoreSettings {
  id: string;
  whatsappNumber: string;
  storeName: string;
  storeAddress: string;
  storeCep: string;
  defaultFreight: number;
  heroImage: string;
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroCtaText: string;
}

export function useStoreSettings() {
  return useQuery({
    queryKey: ['store_settings'],
    queryFn: async (): Promise<StoreSettings> => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return {
        id: data.id,
        whatsappNumber: data.whatsapp_number,
        storeName: data.store_name,
        storeAddress: data.store_address,
        storeCep: data.store_cep,
        defaultFreight: Number(data.default_freight),
        heroImage: data.hero_image,
        heroSubtitle: data.hero_subtitle,
        heroTitle: data.hero_title,
        heroDescription: data.hero_description,
        heroCtaText: data.hero_cta_text,
      };
    },
  });
}

export function useUpdateStoreSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<StoreSettings> & { id: string }) => {
      const { id, ...rest } = settings;
      const mapped: Record<string, unknown> = {};
      if (rest.whatsappNumber !== undefined) mapped.whatsapp_number = rest.whatsappNumber;
      if (rest.storeName !== undefined) mapped.store_name = rest.storeName;
      if (rest.storeAddress !== undefined) mapped.store_address = rest.storeAddress;
      if (rest.storeCep !== undefined) mapped.store_cep = rest.storeCep;
      if (rest.defaultFreight !== undefined) mapped.default_freight = rest.defaultFreight;
      if (rest.heroImage !== undefined) mapped.hero_image = rest.heroImage;
      if (rest.heroSubtitle !== undefined) mapped.hero_subtitle = rest.heroSubtitle;
      if (rest.heroTitle !== undefined) mapped.hero_title = rest.heroTitle;
      if (rest.heroDescription !== undefined) mapped.hero_description = rest.heroDescription;
      if (rest.heroCtaText !== undefined) mapped.hero_cta_text = rest.heroCtaText;
      mapped.updated_at = new Date().toISOString();
      const { error } = await supabase.from('store_settings').update(mapped).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['store_settings'] }),
  });
}

export function useFreightZones() {
  return useQuery({
    queryKey: ['freight_zones'],
    queryFn: async (): Promise<FreightZone[]> => {
      const { data, error } = await supabase
        .from('freight_zones')
        .select('*')
        .order('distance_min', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((z) => ({
        id: z.id,
        name: z.name,
        distanceMin: Number(z.distance_min),
        distanceMax: Number(z.distance_max),
        price: Number(z.price),
      }));
    },
  });
}

export function useSaveFreightZones() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (zones: FreightZone[]) => {
      // Delete all existing then insert new
      const { error: delError } = await supabase.from('freight_zones').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (delError) throw delError;
      if (zones.length > 0) {
        const { error } = await supabase.from('freight_zones').insert(
          zones.map((z) => ({
            name: z.name,
            distance_min: z.distanceMin,
            distance_max: z.distanceMax,
            price: z.price,
          }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['freight_zones'] }),
  });
}

export function useCoupons() {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async (): Promise<Coupon[]> => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []).map((c) => ({
        id: c.id,
        code: c.code,
        discountPercent: Number(c.discount_percent),
        active: c.active,
      }));
    },
  });
}

export function useSaveCoupons() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (coupons: Coupon[]) => {
      const { error: delError } = await supabase.from('coupons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (delError) throw delError;
      if (coupons.length > 0) {
        const { error } = await supabase.from('coupons').insert(
          coupons.map((c) => ({
            code: c.code,
            discount_percent: c.discountPercent,
            active: c.active,
          }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  });
}
