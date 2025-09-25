'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft, Zap } from 'lucide-react';

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background orbs */}
      <div className="absolute inset-0">
        {/* Orb 1 - Suivant la souris */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, #00ff88 0%, #00ccff 50%, #9333ea 100%)`,
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: `translate(-50%, -50%)`,
          }}
        />
        
        {/* Orb 2 - Animation flottante */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full opacity-30 blur-2xl animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full" />
        </div>
        
        {/* Orb 3 - Animation lente */}
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl">
          <div className="w-full h-full bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500 rounded-full animate-bounce-slow" />
        </div>
      </div>

      {/* Glass container principal */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="liquid-glass max-w-2xl w-full text-center p-8 lg:p-12">
          
          {/* Logo animé */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full glass-orb flex items-center justify-center mb-4">
                <Zap className="w-10 h-10 text-emerald-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 animate-ping" />
            </div>
          </div>

          {/* Code d'erreur 404 avec effet liquid */}
          <div className="mb-8 relative">
            <h1 className="text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 animate-gradient-x relative z-10">
              404
            </h1>
            <div className="absolute inset-0 text-8xl lg:text-9xl font-bold text-emerald-400/20 blur-xl">
              404
            </div>
          </div>

          {/* Message principal */}
          <div className="space-y-4 mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold text-white/90">
              Page introuvable
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              Oups ! Il semblerait que cette page se soit évaporée dans le cyberespace. 
              <br className="hidden sm:block" />
              Retournons vers des horizons plus <span className="text-emerald-400 font-medium">digitaux</span> et <span className="text-cyan-400 font-medium">fada</span> !
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto glass-button group"
              >
                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Retour à l'accueil
              </Button>
            </Link>

            <Link href="/products" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto glass-button-outline group"
              >
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Explorer les produits
              </Button>
            </Link>

            <Button 
              size="lg" 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto glass-button-ghost group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Page précédente
            </Button>
          </div>

          {/* Décorations flottantes */}
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-60 animate-bounce" />
          <div className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-40 animate-pulse" />
        </div>
      </div>

      {/* Styles CSS intégrés pour les effets liquid glass */}
      <style jsx>{`
        .liquid-glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .liquid-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        .glass-orb {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .glass-button {
          background: rgba(16, 185, 129, 0.2) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: rgb(16, 185, 129) !important;
          transition: all 0.3s ease;
        }

        .glass-button:hover {
          background: rgba(16, 185, 129, 0.3) !important;
          border-color: rgba(16, 185, 129, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        .glass-button-outline {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }

        .glass-button-outline:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          transform: translateY(-2px);
        }

        .glass-button-ghost {
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8) !important;
        }

        .glass-button-ghost:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
