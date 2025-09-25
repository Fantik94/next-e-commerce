import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Bouton retour en haut à gauche */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" asChild>
          <Link href="/register">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'inscription
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">

        <Card>
          <CardHeader className="space-y-1 pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="DigitalFADA.shop Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <CardTitle className="text-3xl text-center">
              Conditions d'utilisation
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardHeader>

          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-sm">
              
              <section>
                <h2 className="text-lg font-semibold mb-3">1. Acceptance des conditions</h2>
                <p>
                  En accédant et en utilisant DigitalFADA.shop, vous acceptez d'être lié par ces conditions d'utilisation. 
                  Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">2. Description du service</h2>
                <p>
                  DigitalFADA.shop est une plateforme de commerce électronique spécialisée dans la vente de produits 
                  technologiques et multimédias. Nous proposons une large gamme d'appareils électroniques, 
                  d'accessoires et de services associés.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">3. Compte utilisateur</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Vous devez fournir des informations exactes et complètes lors de la création de votre compte</li>
                  <li>Vous êtes responsable de maintenir la confidentialité de vos identifiants</li>
                  <li>Vous devez nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
                  <li>Un seul compte par personne est autorisé</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">4. Commandes et paiements</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Toutes les commandes sont soumises à acceptation et disponibilité</li>
                  <li>Les prix sont indiqués en euros toutes taxes comprises</li>
                  <li>Le paiement doit être effectué au moment de la commande</li>
                  <li>Nous nous réservons le droit d'annuler toute commande en cas de suspicion de fraude</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">5. Livraison</h2>
                <p>
                  Les délais de livraison sont indicatifs et peuvent varier selon la disponibilité des produits 
                  et votre localisation. Nous nous efforçons de respecter les délais annoncés mais ne pouvons 
                  être tenus responsables en cas de retard.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">6. Retours et remboursements</h2>
                <p>
                  Conformément à la réglementation en vigueur, vous disposez d'un délai de 14 jours pour retourner 
                  tout article non conforme ou défectueux. Les frais de retour sont à votre charge sauf en cas 
                  de défaut de conformité.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">7. Propriété intellectuelle</h2>
                <p>
                  Tous les contenus présents sur DigitalFADA.shop (textes, images, logos, designs) sont protégés 
                  par les droits d'auteur et ne peuvent être reproduits sans autorisation écrite préalable.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">8. Limitation de responsabilité</h2>
                <p>
                  DigitalFADA.shop ne peut être tenu responsable des dommages indirects, accessoires ou 
                  consécutifs résultant de l'utilisation de notre service ou de l'impossibilité de l'utiliser.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">9. Modification des conditions</h2>
                <p>
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications 
                  entrent en vigueur dès leur publication sur le site. Il vous incombe de consulter 
                  régulièrement cette page.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">10. Contact</h2>
                <p>
                  Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter à : 
                  <a href="mailto:legal@digitalfada.shop" className="text-primary hover:underline ml-1">
                    legal@digitalfada.shop
                  </a>
                </p>
              </section>

            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t">
              <Button className="flex-1" asChild>
                <Link href="/register">
                  J'accepte et je continue l'inscription
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">
                  Retourner à l'accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
