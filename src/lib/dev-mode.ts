// Mode développement ultra-rapide
export const DEV_MODE = {
  // Utiliser des images locales en dev pour éviter les 404
  USE_LOCAL_IMAGES: process.env.NODE_ENV === 'development',
  
  // Images locales de remplacement
  LOCAL_IMAGES: {
    tech: '/images/placeholder-tech.svg',
    fallback: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDUwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgcng9IjgiIGZpbGw9IiNlNWU3ZWIiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTYwIiByPSIzMCIgZmlsbD0iI2QxZDVkYiIvPgo8cGF0aCBkPSJNMjM1IDE1MCBMMJUICGN5cIDI2NSBMMjY1IDE1MCIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8dGV4dCB4PSIyNTAiIHk9IjE5MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZiNzI4MCIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj4KICAgIFRlY2ggUHJvZHVjdAogIDwvdGV4dD4KICA8cmVjdCB4PSIxMCIgeT0iMjcwIiB3aWR0aD0iNDgwIiBoZWlnaHQ9IjIwIiByeD0iNCIgZmlsbD0iI2U1ZTdlYiIvPgogIDxyZWN0IHg9IjEwIiB5PSIyNzAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjMTBiOTgxIi8+Cjwvc3ZnPg=='
  },
  
  // Performance monitoring
  LOG_PERFORMANCE: process.env.NODE_ENV === 'development',
  
  // Cache settings
  CACHE_IMAGES: true,
};

// Fonction pour obtenir l'URL d'image optimale selon l'environnement
export function getOptimalImageUrl(originalUrl: string): string {
  if (DEV_MODE.USE_LOCAL_IMAGES) {
    // En développement, on utilise des images locales pour éviter les 404
    return DEV_MODE.LOCAL_IMAGES.tech;
  }
  
  // En production, on utilise les vraies images avec optimisations
  return originalUrl;
}
