'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StorageDebugProps {
  productId: string;
}

export function StorageDebug({ productId }: StorageDebugProps) {
  const [buckets, setBuckets] = useState<any[]>([]);
  const [productFiles, setProductFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testStorage = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test 1: Lister les buckets
      const { data: bucketsData, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        setError(`Erreur buckets: ${bucketsError.message}`);
        return;
      }

      setBuckets(bucketsData || []);
      console.log('Buckets:', bucketsData);

      // Test 2: Lister les fichiers du produit
      const { data: filesData, error: filesError } = await supabase.storage
        .from('products')
        .list(productId, { limit: 100 });

      if (filesError) {
        setError(`Erreur fichiers: ${filesError.message}`);
        return;
      }

      setProductFiles(filesData || []);
      console.log('Fichiers du produit:', filesData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      testStorage();
    }
  }, [productId]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Debug Storage - Produit: {productId}</CardTitle>
        <Button onClick={testStorage} disabled={loading}>
          {loading ? 'Test en cours...' : 'Tester Storage'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Buckets */}
        <div>
          <h3 className="font-semibold mb-2">Buckets disponibles:</h3>
          {buckets.length > 0 ? (
            <ul className="space-y-1">
              {buckets.map((bucket, index) => (
                <li key={index} className="text-sm">
                  <strong>{bucket.name}</strong> - 
                  Public: {bucket.public ? 'Oui' : 'Non'} - 
                  Taille max: {bucket.file_size_limit} bytes
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucun bucket trouvé</p>
          )}
        </div>

        {/* Fichiers du produit */}
        <div>
          <h3 className="font-semibold mb-2">Fichiers du produit:</h3>
          {productFiles.length > 0 ? (
            <ul className="space-y-1">
              {productFiles.map((file, index) => (
                <li key={index} className="text-sm">
                  <strong>{file.name}</strong> - 
                  Taille: {file.metadata?.size || 'N/A'} bytes - 
                  Type: {file.metadata?.mimetype || 'N/A'}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucun fichier trouvé pour ce produit</p>
          )}
        </div>

        {/* URLs générées */}
        {productFiles.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">URLs générées:</h3>
            <ul className="space-y-1">
              {productFiles.map((file, index) => {
                const { data } = supabase.storage
                  .from('products')
                  .getPublicUrl(`${productId}/${file.name}`);
                
                return (
                  <li key={index} className="text-sm">
                    <a 
                      href={data.publicUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {file.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Erreur:</strong> {error}
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-blue-100 border border-blue-300 rounded text-blue-700">
          <h4 className="font-semibold mb-2">Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Créez le bucket "products" dans Supabase Storage</li>
            <li>Créez un dossier avec l'ID du produit: {productId}</li>
            <li>Uploadez des images dans ce dossier</li>
            <li>Vérifiez que le bucket est public</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
