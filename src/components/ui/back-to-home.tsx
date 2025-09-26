'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackToHomeProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackToHome({ 
  href = '/', 
  label = 'Retour à l\'accueil',
  className = ''
}: BackToHomeProps) {
  return (
    <div className={`absolute top-6 left-6 z-10 ${className}`}>
      <Button variant="ghost" asChild>
        <Link href={href}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {label}
        </Link>
      </Button>
    </div>
  );
}

export default BackToHome;
