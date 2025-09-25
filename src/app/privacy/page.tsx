import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
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
              Politique de confidentialité
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardHeader>

          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-sm">
              
              <section>
                <h2 className="text-lg font-semibold mb-3">1. Introduction</h2>
                <p>
                  DigitalFADA.shop s'engage à protéger votre vie privée. Cette politique explique comment nous 
                  collectons, utilisons et protégeons vos informations personnelles conformément au RGPD 
                  (Règlement Général sur la Protection des Données).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">2. Données collectées</h2>
                <h3 className="font-medium mb-2">Informations que vous nous fournissez :</h3>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Nom, prénom et adresse email lors de la création de compte</li>
                  <li>Adresses de livraison et de facturation</li>
                  <li>Informations de paiement (traitées de manière sécurisée par nos partenaires)</li>
                  <li>Historique des commandes et préférences</li>
                </ul>
                
                <h3 className="font-medium mb-2">Données collectées automatiquement :</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Adresse IP et informations de navigation</li>
                  <li>Cookies et technologies similaires</li>
                  <li>Données d'utilisation du site (pages visitées, durée des sessions)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">3. Utilisation des données</h2>
                <p className="mb-3">Nous utilisons vos données pour :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Traiter vos commandes et assurer la livraison</li>
                  <li>Gérer votre compte client et fournir un support</li>
                  <li>Personnaliser votre expérience d'achat</li>
                  <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                  <li>Améliorer nos services et analyser les tendances</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">4. Base légale du traitement</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Exécution du contrat :</strong> traitement des commandes, livraison</li>
                  <li><strong>Intérêt légitime :</strong> amélioration du service, sécurité</li>
                  <li><strong>Consentement :</strong> marketing, cookies non essentiels</li>
                  <li><strong>Obligation légale :</strong> comptabilité, lutte contre la fraude</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">5. Partage des données</h2>
                <p className="mb-3">Nous pouvons partager vos données avec :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nos partenaires de livraison pour l'expédition des commandes</li>
                  <li>Les processeurs de paiement pour les transactions</li>
                  <li>Nos prestataires techniques (hébergement, analytics)</li>
                  <li>Les autorités légales si requis par la loi</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Nous ne vendons jamais vos données personnelles à des tiers.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">6. Vos droits</h2>
                <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Accès :</strong> consulter les données que nous détenons sur vous</li>
                  <li><strong>Rectification :</strong> corriger des informations inexactes</li>
                  <li><strong>Effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Limitation :</strong> restreindre le traitement de vos données</li>
                  <li><strong>Portabilité :</strong> récupérer vos données dans un format structuré</li>
                  <li><strong>Opposition :</strong> vous opposer au traitement pour motifs légitimes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">7. Cookies</h2>
                <p>
                  Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez gérer vos 
                  préférences de cookies via les paramètres de votre navigateur. Certains cookies sont 
                  essentiels au fonctionnement du site.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">8. Sécurité</h2>
                <p>
                  Nous mettons en place des mesures techniques et organisationnelles appropriées pour 
                  protéger vos données contre la perte, l'utilisation abusive, l'accès non autorisé, 
                  la divulgation, l'altération ou la destruction.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">9. Conservation des données</h2>
                <p>
                  Nous conservons vos données personnelles uniquement le temps nécessaire aux finalités 
                  pour lesquelles elles ont été collectées, conformément à nos obligations légales et 
                  réglementaires.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold mb-3">10. Contact</h2>
                <p>
                  Pour exercer vos droits ou pour toute question concernant cette politique, contactez-nous :
                </p>
                <ul className="list-none space-y-1 mt-2">
                  <li>Email : <a href="mailto:privacy@digitalfada.shop" className="text-primary hover:underline">privacy@digitalfada.shop</a></li>
                  <li>Délégué à la Protection des Données : <a href="mailto:dpo@digitalfada.shop" className="text-primary hover:underline">dpo@digitalfada.shop</a></li>
                </ul>
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
