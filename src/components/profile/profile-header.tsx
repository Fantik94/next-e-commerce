'use client';

import React from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import AvatarUpload from './avatar-upload';

export function ProfileHeader() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-24 w-24"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Utilisateur';

  return (
    <div className="relative overflow-hidden rounded-lg border bg-background p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20" />
      
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar section */}
        <div className="relative flex-shrink-0">
          <AvatarUpload size="md" showUploadText={false} />
        </div>

        {/* User info section */}
        <div className="flex-1 space-y-4">
          {/* Name and badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {displayName}
              </h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {user.role === 'admin' ? 'Administrateur' : 'Membre'}
              </Badge>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Membre depuis {formatDate(new Date(user.createdAt))}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="default" size="sm">
              Modifier le profil
            </Button>
            <Button variant="outline" size="sm">
              Paramètres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
