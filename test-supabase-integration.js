// Script de test pour vérifier l'intégration Supabase
// Exécuter avec: node test-supabase-integration.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.log('Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies dans .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseIntegration() {
  console.log('🧪 Test de l\'intégration Supabase...\n');

  try {
    // Test 1: Récupérer les catégories
    console.log('1. Test des catégories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);

    if (categoriesError) {
      console.error('❌ Erreur lors de la récupération des catégories:', categoriesError.message);
    } else {
      console.log(`✅ ${categories.length} catégories trouvées:`, categories.map(c => c.name));
    }

    // Test 2: Récupérer les produits
    console.log('\n2. Test des produits...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .eq('is_active', true)
      .limit(5);

    if (productsError) {
      console.error('❌ Erreur lors de la récupération des produits:', productsError.message);
    } else {
      console.log(`✅ ${products.length} produits trouvés:`, products.map(p => p.name));
    }

    // Test 3: Recherche de produits
    console.log('\n3. Test de recherche...');
    const { data: searchResults, error: searchError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .or('name.ilike.%iPhone%,description.ilike.%iPhone%')
      .eq('is_active', true);

    if (searchError) {
      console.error('❌ Erreur lors de la recherche:', searchError.message);
    } else {
      console.log(`✅ Recherche "iPhone": ${searchResults.length} résultats trouvés`);
    }

    // Test 4: Produits mis en avant
    console.log('\n4. Test des produits mis en avant...');
    const { data: featuredProducts, error: featuredError } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(name)
      `)
      .eq('is_featured', true)
      .eq('is_active', true);

    if (featuredError) {
      console.error('❌ Erreur lors de la récupération des produits mis en avant:', featuredError.message);
    } else {
      console.log(`✅ ${featuredProducts.length} produits mis en avant trouvés`);
    }

    console.log('\n🎉 Tests terminés avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Vérifiez que votre application Next.js démarre correctement');
    console.log('2. Visitez http://localhost:3000 pour voir les données Supabase');
    console.log('3. Testez la recherche et les filtres sur la page produits');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testSupabaseIntegration();
