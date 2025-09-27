'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Star, 
  StarOff,
  Building,
  User,
  Phone,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useAddresses, type Address, type CreateAddressData } from '@/hooks/useAddresses';
import { sanitizeInput } from '@/lib/auth-validation';

// Schema pour les adresses
const addressSchema = z.object({
  type: z.enum(['shipping', 'billing', 'both']),
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  company: z
    .string()
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères')
    .optional(),
  street: z
    .string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères'),
  streetComplement: z
    .string()
    .max(100, 'Le complément d\'adresse ne peut pas dépasser 100 caractères')
    .optional(),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères'),
  postalCode: z
    .string()
    .min(4, 'Le code postal doit contenir au moins 4 caractères')
    .max(10, 'Le code postal ne peut pas dépasser 10 caractères'),
  country: z
    .string()
    .min(2, 'Le pays doit contenir au moins 2 caractères')
    .max(50, 'Le pays ne peut pas dépasser 50 caractères'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || /^[\d\s\-\+\(\)\.]{10,}$/.test(val), 'Format de téléphone invalide'),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  isLoading: boolean;
}

function AddressCard({ address, onEdit, onDelete, onSetDefault, isLoading }: AddressCardProps) {
  const typeLabels = {
    shipping: 'Livraison',
    billing: 'Facturation',
    both: 'Livraison & Facturation'
  };

  return (
    <Card className={`relative ${address.isDefault ? 'ring-2 ring-primary' : ''}`}>
      {address.isDefault && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
          Par défaut
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {address.firstName} {address.lastName}
          </CardTitle>
          <span className="text-xs bg-muted px-2 py-1 rounded">
            {typeLabels[address.type]}
          </span>
        </div>
        {address.company && (
          <CardDescription className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            {address.company}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="text-sm">
          <div className="flex items-start gap-1">
            <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
            <div>
              <p>{address.street}</p>
              {address.streetComplement && (
                <p className="text-muted-foreground">{address.streetComplement}</p>
              )}
              <p>{address.postalCode} {address.city}</p>
              <p className="text-muted-foreground">{address.country}</p>
            </div>
          </div>
        </div>
        
        {address.phone && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            {address.phone}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
            disabled={isLoading}
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Modifier
          </Button>
          
          {!address.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.id)}
              disabled={isLoading}
            >
              <Star className="h-3 w-3 mr-1" />
              Par défaut
            </Button>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(address.id)}
            disabled={isLoading}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AddressManager() {
  const {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'shipping',
      firstName: '',
      lastName: '',
      company: '',
      street: '',
      streetComplement: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
      isDefault: false,
    },
  });

  const openForm = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      form.reset({
        type: address.type,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company || '',
        street: address.street,
        streetComplement: address.streetComplement || '',
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone || '',
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      form.reset({
        type: 'shipping',
        firstName: '',
        lastName: '',
        company: '',
        street: '',
        streetComplement: '',
        city: '',
        postalCode: '',
        country: 'France',
        phone: '',
        isDefault: false,
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
    form.reset();
  };

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);

    try {
      const sanitizedData: CreateAddressData = {
        type: data.type,
        firstName: sanitizeInput(data.firstName),
        lastName: sanitizeInput(data.lastName),
        company: data.company ? sanitizeInput(data.company) : undefined,
        street: sanitizeInput(data.street),
        streetComplement: data.streetComplement ? sanitizeInput(data.streetComplement) : undefined,
        city: sanitizeInput(data.city),
        postalCode: sanitizeInput(data.postalCode),
        country: sanitizeInput(data.country),
        phone: data.phone ? sanitizeInput(data.phone) : undefined,
        isDefault: data.isDefault,
      };

      let result;
      if (editingAddress) {
        result = await updateAddress(editingAddress.id, sanitizedData);
      } else {
        result = await createAddress(sanitizedData);
      }

      if (result.success) {
        closeForm();
        console.log(`✅ Adresse ${editingAddress ? 'mise à jour' : 'créée'} !`);
      } else {
        console.error('❌ Erreur:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('Une erreur inattendue s\'est produite.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      return;
    }

    const result = await deleteAddress(addressId);
    if (result.success) {
      console.log('✅ Adresse supprimée !');
    } else {
      console.error('❌ Erreur:', result.error);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    const result = await setDefaultAddress(addressId);
    if (result.success) {
      console.log('✅ Adresse définie par défaut !');
    } else {
      console.error('❌ Erreur:', result.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Mes adresses</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos adresses de livraison et de facturation
          </p>
        </div>
        <Button onClick={() => openForm()} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une adresse
        </Button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Liste des adresses */}
      {isLoading && addresses.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">Aucune adresse</h4>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Vous n'avez pas encore d'adresse enregistrée.
            </p>
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter votre première adresse
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={openForm}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Formulaire d'ajout/modification */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
            </CardTitle>
            <CardDescription>
              Remplissez les informations de votre adresse
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Type d'adresse */}
                <div className="space-y-2">
                  <FormLabel htmlFor="type">Type d'adresse</FormLabel>
                  <FormControl>
                    <select
                      id="type"
                      {...form.register('type')}
                      disabled={isSubmitting}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="shipping">Livraison</option>
                      <option value="billing">Facturation</option>
                      <option value="both">Livraison & Facturation</option>
                    </select>
                  </FormControl>
                  {form.formState.errors.type && (
                    <FormMessage>{form.formState.errors.type.message}</FormMessage>
                  )}
                </div>

                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="firstName">Prénom</FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        {...form.register('firstName')}
                        placeholder="Votre prénom"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {form.formState.errors.firstName && (
                      <FormMessage>{form.formState.errors.firstName.message}</FormMessage>
                    )}
                  </div>

                  <div className="space-y-2">
                    <FormLabel htmlFor="lastName">Nom</FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        {...form.register('lastName')}
                        placeholder="Votre nom"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {form.formState.errors.lastName && (
                      <FormMessage>{form.formState.errors.lastName.message}</FormMessage>
                    )}
                  </div>
                </div>

                {/* Entreprise */}
                <div className="space-y-2">
                  <FormLabel htmlFor="company">Entreprise (optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      id="company"
                      {...form.register('company')}
                      placeholder="Nom de votre entreprise"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {form.formState.errors.company && (
                    <FormMessage>{form.formState.errors.company.message}</FormMessage>
                  )}
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <FormLabel htmlFor="street">Adresse</FormLabel>
                  <FormControl>
                    <Input
                      id="street"
                      {...form.register('street')}
                      placeholder="Numéro et nom de rue"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {form.formState.errors.street && (
                    <FormMessage>{form.formState.errors.street.message}</FormMessage>
                  )}
                </div>

                {/* Complément d'adresse */}
                <div className="space-y-2">
                  <FormLabel htmlFor="streetComplement">Complément d'adresse (optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      id="streetComplement"
                      {...form.register('streetComplement')}
                      placeholder="Appartement, étage, bâtiment..."
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {form.formState.errors.streetComplement && (
                    <FormMessage>{form.formState.errors.streetComplement.message}</FormMessage>
                  )}
                </div>

                {/* Ville et Code postal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="postalCode">Code postal</FormLabel>
                    <FormControl>
                      <Input
                        id="postalCode"
                        {...form.register('postalCode')}
                        placeholder="75001"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {form.formState.errors.postalCode && (
                      <FormMessage>{form.formState.errors.postalCode.message}</FormMessage>
                    )}
                  </div>

                  <div className="space-y-2">
                    <FormLabel htmlFor="city">Ville</FormLabel>
                    <FormControl>
                      <Input
                        id="city"
                        {...form.register('city')}
                        placeholder="Paris"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {form.formState.errors.city && (
                      <FormMessage>{form.formState.errors.city.message}</FormMessage>
                    )}
                  </div>
                </div>

                {/* Pays */}
                <div className="space-y-2">
                  <FormLabel htmlFor="country">Pays</FormLabel>
                  <FormControl>
                    <Input
                      id="country"
                      {...form.register('country')}
                      placeholder="France"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {form.formState.errors.country && (
                    <FormMessage>{form.formState.errors.country.message}</FormMessage>
                  )}
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <FormLabel htmlFor="phone">Téléphone (optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      placeholder="+33 1 23 45 67 89"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {form.formState.errors.phone && (
                    <FormMessage>{form.formState.errors.phone.message}</FormMessage>
                  )}
                </div>

                {/* Adresse par défaut */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    {...form.register('isDefault')}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <FormLabel htmlFor="isDefault" className="text-sm font-normal">
                    Définir comme adresse par défaut
                  </FormLabel>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Enregistrement...' : editingAddress ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AddressManager;
