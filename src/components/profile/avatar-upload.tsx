'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, Trash2, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';

interface AvatarUploadProps {
  size?: 'sm' | 'md' | 'lg';
  showUploadText?: boolean;
  className?: string;
}

export function AvatarUpload({ 
  size = 'md', 
  showUploadText = true,
  className = '' 
}: AvatarUploadProps) {
  const { user } = useAuth();
  const { uploading, uploadAvatar, deleteAvatar } = useAvatarUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Tailles configurables
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  const buttonSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Gérer la sélection de fichier
  const handleFileSelect = async (file: File) => {
    const result = await uploadAvatar(file);
    
    if (result.success) {
      alert('Avatar mis à jour avec succès !');
      setImageError(false);
    } else {
      alert(result.error || 'Erreur lors de l\'upload');
    }
  };

  // Input file change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      alert('Veuillez déposer un fichier image valide.');
    }
  };

  // Supprimer l'avatar
  const handleDeleteAvatar = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      const result = await deleteAvatar();
      
      if (result.success) {
        alert('Photo de profil supprimée !');
        setImageError(false);
      } else {
        alert(result.error || 'Erreur lors de la suppression');
      }
    }
  };

  // Ouvrir le sélecteur de fichier
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Utilisateur';

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar avec overlay */}
      <div 
        className={`relative ${sizeClasses[size]} overflow-hidden rounded-full border-4 border-background shadow-lg cursor-pointer transition-all duration-200 ${
          dragOver ? 'border-primary border-dashed scale-105' : ''
        } ${uploading ? 'opacity-50' : 'hover:scale-105'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        {/* Image ou placeholder */}
        {user?.avatar && !imageError ? (
          <Image
            src={user.avatar}
            alt={`Photo de profil de ${displayName}`}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600">
            <User className={`${iconSizeClasses[size]} text-white opacity-80`} />
          </div>
        )}

        {/* Overlay lors du drag */}
        {dragOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Upload className={`${iconSizeClasses[size]} text-white`} />
          </div>
        )}

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className={`${iconSizeClasses[size]} text-white animate-spin`} />
          </div>
        )}

        {/* Bouton caméra */}
        {!uploading && (
          <Button
            size="sm"
            variant="secondary"
            className={`absolute -bottom-1 -right-1 ${buttonSizeClasses[size]} rounded-full p-0 shadow-md hover:scale-110 transition-transform`}
            disabled={uploading}
          >
            <Camera className={iconSizeClasses[size]} />
            <span className="sr-only">Changer la photo de profil</span>
          </Button>
        )}
      </div>

      {/* Texte d'instructions */}
      {showUploadText && (
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">
            {user?.avatar ? 'Changer la photo' : 'Ajouter une photo'}
          </p>
          <p className="text-xs text-muted-foreground">
            Cliquez ou glissez une image
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP ou GIF • Max 5MB
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={openFileSelector}
          disabled={uploading}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Choisir</span>
        </Button>

        {user?.avatar && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAvatar}
            disabled={uploading}
            className="flex items-center space-x-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span>Supprimer</span>
          </Button>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}

export default AvatarUpload;
