// Script de test pour vérifier la connexion Supabase Storage
// Exécuter avec: node test-storage-connection.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Lire le fichier .env.local manuellement
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('❌ Impossible de lire le fichier .env.local');
    console.log('Assurez-vous que le fichier .env.local existe et contient:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=votre_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle');
    process.exit(1);
  }
}

const env = loadEnvFile();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorageConnection() {
  console.log('🧪 Test de la connexion Supabase Storage...\n');

  try {
    // Test 1: Lister les buckets
    console.log('1. Test des buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erreur lors de la récupération des buckets:', bucketsError.message);
    } else {
      console.log('✅ Buckets trouvés:', buckets.map(b => b.name));
      
      const productsBucket = buckets.find(b => b.name === 'products');
      if (productsBucket) {
        console.log('✅ Bucket "products" trouvé');
        console.log('   - Public:', productsBucket.public);
        console.log('   - Taille limite:', productsBucket.file_size_limit);
      } else {
        console.log('❌ Bucket "products" non trouvé');
        console.log('   Créez le bucket "products" dans Supabase Storage');
      }
    }

    // Test 2: Lister le contenu du bucket products
    console.log('\n2. Test du contenu du bucket products...');
    const { data: files, error: filesError } = await supabase.storage
      .from('products')
      .list('', { limit: 10 });

    if (filesError) {
      console.error('❌ Erreur lors de la récupération des fichiers:', filesError.message);
    } else {
      console.log('✅ Fichiers/dossiers trouvés:', files.length);
      files.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size ? file.metadata.size + ' bytes' : 'dossier'})`);
      });
    }

    // Test 3: Tester avec un ID de produit spécifique
    console.log('\n3. Test avec un ID de produit...');
    const testProductId = '31954d1d-e1f2-46eb-ba0d-2a448f842191';
    const { data: productFiles, error: productError } = await supabase.storage
      .from('products')
      .list(testProductId, { limit: 10 });

    if (productError) {
      console.error('❌ Erreur lors de la récupération des images du produit:', productError.message);
    } else {
      console.log(`✅ Images trouvées pour le produit ${testProductId}:`, productFiles.length);
      productFiles.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size ? file.metadata.size + ' bytes' : 'dossier'})`);
      });
    }

    // Test 4: Générer une URL publique
    if (productFiles && productFiles.length > 0) {
      console.log('\n4. Test de génération d\'URL publique...');
      const firstFile = productFiles[0];
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(`${testProductId}/${firstFile.name}`);
      
      console.log('✅ URL générée:', urlData.publicUrl);
    }

    console.log('\n🎉 Tests terminés !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Si le bucket "products" n\'existe pas, créez-le dans Supabase Storage');
    console.log('2. Uploadez des images dans le dossier de votre produit');
    console.log('3. Vérifiez que le bucket est public');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testStorageConnection();