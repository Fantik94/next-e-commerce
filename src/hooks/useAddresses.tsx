'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export interface Address {
  id: string;
  userId: string;
  type: 'shipping' | 'billing' | 'both';
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  streetComplement?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressData {
  type: 'shipping' | 'billing' | 'both';
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  streetComplement?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export const useAddresses = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les adresses de l'utilisateur
  const fetchAddresses = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const mappedAddresses: Address[] = data.map(addr => ({
        id: addr.id,
        userId: addr.user_id,
        type: addr.type,
        firstName: addr.first_name,
        lastName: addr.last_name,
        company: addr.company,
        street: addr.street,
        streetComplement: addr.street_complement,
        city: addr.city,
        postalCode: addr.postal_code,
        country: addr.country,
        phone: addr.phone,
        isDefault: addr.is_default,
        createdAt: new Date(addr.created_at),
        updatedAt: new Date(addr.updated_at),
      }));

      setAddresses(mappedAddresses);
    } catch (err: any) {
      console.error('❌ Erreur lors de la récupération des adresses:', err);
      setError(err.message || 'Erreur lors de la récupération des adresses');
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une nouvelle adresse
  const createAddress = async (addressData: CreateAddressData): Promise<{ success: boolean; error?: string; address?: Address }> => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Si cette adresse est définie comme par défaut, désactiver les autres
      if (addressData.isDefault) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          type: addressData.type,
          first_name: addressData.firstName,
          last_name: addressData.lastName,
          company: addressData.company,
          street: addressData.street,
          street_complement: addressData.streetComplement,
          city: addressData.city,
          postal_code: addressData.postalCode,
          country: addressData.country,
          phone: addressData.phone,
          is_default: addressData.isDefault || false,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newAddress: Address = {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        firstName: data.first_name,
        lastName: data.last_name,
        company: data.company,
        street: data.street,
        streetComplement: data.street_complement,
        city: data.city,
        postalCode: data.postal_code,
        country: data.country,
        phone: data.phone,
        isDefault: data.is_default,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      // Mettre à jour la liste locale
      setAddresses(prev => [newAddress, ...prev.filter(addr => !newAddress.isDefault || !addr.isDefault)]);
      showSuccess('Adresse ajoutée !', 'Votre nouvelle adresse a été enregistrée avec succès.');

      return { success: true, address: newAddress };
    } catch (err: any) {
      console.error('❌ Erreur lors de la création de l\'adresse:', err);
      const errorMessage = err.message || 'Erreur lors de la création de l\'adresse';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une adresse
  const updateAddress = async (addressId: string, addressData: Partial<CreateAddressData>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Si cette adresse est définie comme par défaut, désactiver les autres
      if (addressData.isDefault) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', addressId);
      }

      const updateData: any = {};
      if (addressData.type !== undefined) updateData.type = addressData.type;
      if (addressData.firstName !== undefined) updateData.first_name = addressData.firstName;
      if (addressData.lastName !== undefined) updateData.last_name = addressData.lastName;
      if (addressData.company !== undefined) updateData.company = addressData.company;
      if (addressData.street !== undefined) updateData.street = addressData.street;
      if (addressData.streetComplement !== undefined) updateData.street_complement = addressData.streetComplement;
      if (addressData.city !== undefined) updateData.city = addressData.city;
      if (addressData.postalCode !== undefined) updateData.postal_code = addressData.postalCode;
      if (addressData.country !== undefined) updateData.country = addressData.country;
      if (addressData.phone !== undefined) updateData.phone = addressData.phone;
      if (addressData.isDefault !== undefined) updateData.is_default = addressData.isDefault;

      const { error } = await supabase
        .from('user_addresses')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Mettre à jour la liste locale
      setAddresses(prev => prev.map(addr => {
        if (addr.id === addressId) {
          return {
            ...addr,
            ...addressData,
            updatedAt: new Date(),
          };
        }
        // Si cette adresse devient par défaut, désactiver les autres
        if (addressData.isDefault && addr.isDefault && addr.id !== addressId) {
          return { ...addr, isDefault: false };
        }
        return addr;
      }));
      showSuccess('Adresse mise à jour !', 'Vos modifications ont été enregistrées avec succès.');

      return { success: true };
    } catch (err: any) {
      console.error('❌ Erreur lors de la mise à jour de l\'adresse:', err);
      const errorMessage = err.message || 'Erreur lors de la mise à jour de l\'adresse';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une adresse
  const deleteAddress = async (addressId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Mettre à jour la liste locale
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      showSuccess('Adresse supprimée !', 'L\'adresse a été supprimée de votre compte.');

      return { success: true };
    } catch (err: any) {
      console.error('❌ Erreur lors de la suppression de l\'adresse:', err);
      const errorMessage = err.message || 'Erreur lors de la suppression de l\'adresse';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Définir une adresse comme par défaut
  const setDefaultAddress = async (addressId: string): Promise<{ success: boolean; error?: string }> => {
    return updateAddress(addressId, { isDefault: true });
  };

  // Charger les adresses au montage du composant
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  return {
    addresses,
    isLoading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
