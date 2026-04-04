'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // On stocke le token pour que le navigateur s'en souvienne
      localStorage.setItem('token', token);
      
      // Petite redirection vers l'accueil
      router.push('/');
    } else {
      // En cas de problème, retour au login
      router.push('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-lg">Finalisation de la connexion...</p>
      </div>
    </div>
  );
}