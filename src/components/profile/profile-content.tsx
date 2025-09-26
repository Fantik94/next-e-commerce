'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  FileText, 
  Save, 
  X,
  Edit3,
  Shield,
  LogOut,
  Settings,
  Bell,
  CreditCard,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeInput } from '@/lib/auth-validation';
import { useRouter } from 'next/navigation';

// Schema pour l'édition du profil
const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s\-\+\(\)\.]{10,}$/.test(val), 'Format de téléphone invalide'),
  
  company: z
    .string()
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères')
    .optional(),
  
  jobTitle: z
    .string()
    .max(100, 'Le titre du poste ne peut pas dépasser 100 caractères')
    .optional(),
  
  location: z
    .string()
    .max(100, 'La localisation ne peut pas dépasser 100 caractères')
    .optional(),
  
  bio: z
    .string()
    .max(500, 'La bio ne peut pas dépasser 500 caractères')
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '',
      company: '',
      jobTitle: '',
      location: '',
      bio: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    
    try {
      const sanitizedData = {
        firstName: sanitizeInput(data.firstName),
        lastName: sanitizeInput(data.lastName),
      };

      const result = await updateProfile(sanitizedData);

      if (result.success) {
        setIsEditing(false);
        console.log('✅ Profil mis à jour !');
        // Tu peux ajouter un toast ici
      } else {
        console.error('❌ Erreur:', result.error);
        alert(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      alert('Une erreur inattendue s\'est produite.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
      router.push('/');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '',
      company: '',
      jobTitle: '',
      location: '',
      bio: '',
    });
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Personnel</span>
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Compte</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Sécurité</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
      </TabsList>

      {/* Onglet Personnel */}
      <TabsContent value="personal" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles et votre profil public.
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {isEditing ? (
              <Form>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nom et Prénom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      name="firstName"
                      render={() => (
                        <div className="space-y-2">
                          <FormLabel htmlFor="firstName">Prénom</FormLabel>
                          <FormControl>
                            <Input
                              id="firstName"
                              {...form.register('firstName')}
                              placeholder="Votre prénom"
                              disabled={isLoading}
                            />
                          </FormControl>
                          {form.formState.errors.firstName && (
                            <FormMessage>{form.formState.errors.firstName.message}</FormMessage>
                          )}
                        </div>
                      )}
                    />

                    <FormField
                      name="lastName"
                      render={() => (
                        <div className="space-y-2">
                          <FormLabel htmlFor="lastName">Nom</FormLabel>
                          <FormControl>
                            <Input
                              id="lastName"
                              {...form.register('lastName')}
                              placeholder="Votre nom"
                              disabled={isLoading}
                            />
                          </FormControl>
                          {form.formState.errors.lastName && (
                            <FormMessage>{form.formState.errors.lastName.message}</FormMessage>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {/* Email (lecture seule) */}
                  <div className="space-y-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      L'email ne peut pas être modifié
                    </p>
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-2">
                    <FormLabel htmlFor="phone">Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        {...form.register('phone')}
                        placeholder="+33 1 23 45 67 89"
                        disabled={isLoading}
                      />
                    </FormControl>
                    {form.formState.errors.phone && (
                      <FormMessage>{form.formState.errors.phone.message}</FormMessage>
                    )}
                  </div>

                  {/* Entreprise et Poste */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormLabel htmlFor="company">Entreprise</FormLabel>
                      <FormControl>
                        <Input
                          id="company"
                          {...form.register('company')}
                          placeholder="Nom de votre entreprise"
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>

                    <div className="space-y-2">
                      <FormLabel htmlFor="jobTitle">Poste</FormLabel>
                      <FormControl>
                        <Input
                          id="jobTitle"
                          {...form.register('jobTitle')}
                          placeholder="Votre titre de poste"
                          disabled={isLoading}
                        />
                      </FormControl>
                    </div>
                  </div>

                  {/* Localisation */}
                  <div className="space-y-2">
                    <FormLabel htmlFor="location">Localisation</FormLabel>
                    <FormControl>
                      <Input
                        id="location"
                        {...form.register('location')}
                        placeholder="Ville, Pays"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        id="bio"
                        {...form.register('bio')}
                        placeholder="Parlez-nous de vous..."
                        rows={4}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Maximum 500 caractères
                    </p>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              /* Mode lecture */
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Prénom
                    </label>
                    <p className="text-sm">{user.firstName || 'Non renseigné'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nom
                    </label>
                    <p className="text-sm">{user.lastName || 'Non renseigné'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-sm">{user.email}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </label>
                    <p className="text-sm">Non renseigné</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localisation
                    </label>
                    <p className="text-sm">Non renseigné</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Onglet Compte */}
      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du compte</CardTitle>
            <CardDescription>
              Gérez votre compte et vos préférences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Mes commandes
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Moyens de paiement
              </Button>
              
              <Separator />
              
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Onglet Sécurité */}
      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>
              Gérez la sécurité de votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Changer le mot de passe
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Authentification à deux facteurs
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Onglet Notifications */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configurez vos préférences de notification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">Recevoir des emails de mise à jour</p>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notifications push</p>
                  <p className="text-sm text-muted-foreground">Recevoir des notifications sur votre appareil</p>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default ProfileContent;
