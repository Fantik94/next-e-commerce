'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface UseAvatarUploadReturn {
  uploading: boolean;
  uploadAvatar: (file: File) => Promise<UploadResult>;
  deleteAvatar: () => Promise<UploadResult>;
  getAvatarUrl: (path: string) => string;
}

export function useAvatarUpload(): UseAvatarUploadReturn {
  const [uploading, setUploading] = useState(false);
  const { user, updateProfile } = useAuth();

  // Valider le fichier
  const validateFile = (file: File): string | null => {
    // Vérifier le type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.';
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Le fichier est trop volumineux. Taille maximale : 5MB.';
    }

    return null;
  };

  // Générer un nom de fichier unique
  const generateFileName = (file: File): string => {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    return `${user?.id}/${timestamp}.${extension}`;
  };

  // Redimensionner l'image avant upload (optionnel)
  const resizeImage = (file: File, maxWidth: number = 400, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions en gardant le ratio
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        // Redimensionner
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        // Convertir en blob puis en file
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            resolve(file); // Fallback au fichier original
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Upload d'avatar
  const uploadAvatar = async (file: File): Promise<UploadResult> => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté.' };
    }

    setUploading(true);

    try {
      // Valider le fichier
      const validationError = validateFile(file);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Redimensionner l'image
      const resizedFile = await resizeImage(file);
      const fileName = generateFileName(resizedFile);

      // Supprimer l'ancien avatar s'il existe
      if (user.avatar) {
        await deleteCurrentAvatar();
      }

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, resizedFile, {
          cacheControl: '3600',
          upsert: false, // Ne pas écraser
        });

      if (uploadError) {
        console.error('❌ Erreur upload:', uploadError);
        return { success: false, error: uploadError.message };
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;

      // Mettre à jour le profil avec la nouvelle URL
      const updateResult = await updateProfile({ avatar: avatarUrl });
      
      if (!updateResult.success) {
        // Supprimer le fichier uploadé en cas d'erreur de mise à jour
        await supabase.storage
          .from('avatars')
          .remove([fileName]);
        
        return { success: false, error: updateResult.error };
      }

      console.log('✅ Avatar uploadé avec succès !');
      return { success: true, url: avatarUrl };

    } catch (error: any) {
      console.error('❌ Erreur inattendue:', error);
      return { success: false, error: 'Une erreur inattendue s\'est produite.' };
    } finally {
      setUploading(false);
    }
  };

  // Supprimer l'avatar actuel du storage
  const deleteCurrentAvatar = async (): Promise<void> => {
    if (!user?.avatar) return;

    try {
      // Extraire le chemin du fichier depuis l'URL
      const url = user.avatar;
      const matches = url.match(/avatars\/(.+)$/);
      if (matches) {
        const filePath = matches[1];
        await supabase.storage
          .from('avatars')
          .remove([filePath]);
        
        console.log('🗑️ Ancien avatar supprimé');
      }
    } catch (error) {
      console.error('⚠️ Erreur lors de la suppression de l\'ancien avatar:', error);
      // Ne pas faire échouer l'opération pour cette erreur
    }
  };

  // Supprimer l'avatar (fonction publique)
  const deleteAvatar = async (): Promise<UploadResult> => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté.' };
    }

    setUploading(true);

    try {
      // Supprimer du storage
      await deleteCurrentAvatar();

      // Mettre à jour le profil
      const updateResult = await updateProfile({ avatar: null });
      
      if (!updateResult.success) {
        return { success: false, error: updateResult.error };
      }

      console.log('✅ Avatar supprimé avec succès !');
      return { success: true };

    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression:', error);
      return { success: false, error: 'Une erreur inattendue s\'est produite.' };
    } finally {
      setUploading(false);
    }
  };

  // Générer l'URL publique d'un avatar
  const getAvatarUrl = (path: string): string => {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  return {
    uploading,
    uploadAvatar,
    deleteAvatar,
    getAvatarUrl,
  };
}

export default useAvatarUpload;
