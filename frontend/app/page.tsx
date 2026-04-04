'use client';
import { useAuth } from './hooks/useAuth';
export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  return (
    <main className="p-10">
      {user ? (
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
          <img src={user.image} alt="Profil" className="w-12 h-12 rounded-full" />
          <div>
            <h1 className="text-xl font-bold">Bienvenue, {user.name} !</h1>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold">Vous n\'êtes pas connecté</h1>
          <a href="http://localhost:5000/api/auth/google" className="text-blue-500 underline">
            Se connecter avec Google
          </a>
        </div>
      )}
    </main>
  );
}