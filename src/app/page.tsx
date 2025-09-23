import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import { products, categories } from '@/data/products';

export default function Home() {
  // Récupération des produits mis en avant
  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);
  const newProducts = products.filter(product => product.isNew).slice(0, 3);

  return (
    <div className="space-y-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                L'e-commerce 
                <span className="text-primary"> moderne</span> 
                qui vous ressemble
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Découvrez notre sélection de produits de qualité, 
                avec une expérience d'achat simple et sécurisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Découvrir nos produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Voir les promotions
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Produit populaire</span>
                    <Badge variant="secondary">Nouveau</Badge>
                  </div>
                  <h3 className="text-xl font-bold">iPhone 15 Pro</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(127 avis)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">1 229€</span>
                    <span className="text-lg text-gray-500 line-through">1 299€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Livraison gratuite</h3>
              <p className="text-gray-600">Livraison gratuite dès 50€ d'achat partout en France</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Paiement sécurisé</h3>
              <p className="text-gray-600">Vos données sont protégées avec un cryptage SSL</p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Support 24/7</h3>
              <p className="text-gray-600">Notre équipe est disponible pour vous aider</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Nos catégories</h2>
            <p className="text-xl text-gray-600">Trouvez exactement ce que vous cherchez</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-4xl mb-4">
                    {category.name === 'Électronique' && '📱'}
                    {category.name === 'Mode' && '👔'}
                    {category.name === 'Maison & Jardin' && '🏠'}
                    {category.name === 'Sport & Loisirs' && '⚽'}
                  </div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                  <Badge variant="outline">{category.productCount} produits</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Produits mis en avant */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Produits populaires</h2>
              <p className="text-xl text-gray-600 mt-2">Nos coups de cœur du moment</p>
            </div>
            <Button variant="outline">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2" variant="destructive">
                        Promo
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">{product.price}€</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}€</span>
                        )}
                      </div>
                      <Button size="sm">Ajouter</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Dernières nouveautés</h2>
            <p className="text-xl text-gray-600">Soyez les premiers à découvrir nos derniers produits</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {newProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      Nouveau
                    </Badge>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-xl">{product.name}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{product.price}€</span>
                      <Button>Découvrir</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-bold">Prêt à commencer ?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits et découvrez une nouvelle façon de faire du shopping en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Créer un compte
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Explorer le catalogue
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}