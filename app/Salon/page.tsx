'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TopUsuarios {
  id: string;
  usuario: string;
  score: number;
}

export default function HomePage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<TopUsuarios[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para el usuario actual
  const [stats, setStats] = useState({ nombre: 'Melómano', score: 0 });

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');

    const fetchRanking = async () => {
      try {
        const res = await fetch('/api/users/ranking');
        const data = await res.json();

        setLeaderboard(data);

        // Buscar el usuario actual en el ranking
        if (savedName) {
          const usuarioActual = data.find(
            (u: TopUsuarios) => u.usuario === savedName
          );

          setStats({
            nombre: savedName,
            score: usuarioActual ? usuarioActual.score : 0
          });
        }

      } catch (error) {
        console.log("Error al cargar ranking");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf1] text-[#2c1e14] font-sans p-6 relative">

      {/* CUADRO DE SCORE (Esquina superior derecha) */}
      <div className="absolute top-6 right-6 bg-[#4a3728] p-3 rounded-xl border-b-4 border-[#2c1e14] shadow-lg flex flex-col items-end">
        <span className="text-[#c2a382] text-[10px] font-black uppercase tracking-tighter">Usuario Actual</span>
        <span className="text-[#e8d2a6] font-bold leading-none">{stats.nombre}</span>
        <div className="mt-1 bg-[#3a2a1d] px-2 py-0.5 rounded text-green-400 font-mono text-sm">
          Score: {stats.score}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b-4 border-[#4a3728] pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic text-[#4a3728]">
              El Salón de la Fama
            </h1>
            <p className="text-[#a68663] font-medium">Los melómanos con más aciertos</p>
          </div>
          <button
            onClick={() => router.push('/Trivia')}
            className="bg-[#c2a382] hover:bg-[#4a3728] hover:text-[#e8d2a6] text-[#2c1e14] px-6 py-3 rounded-full font-bold transition-all shadow-lg transform hover:-translate-y-1"
          >
            ¡Empezar Trivia!
          </button>
        </header>

        <div className="bg-[#4a3728] rounded-3xl p-1 shadow-2xl overflow-hidden">
          <div className="bg-[#3a2a1d] p-6">
            <h2 className="text-[#e8d2a6] text-xl font-bold mb-6 flex items-center gap-2">
              Ranking Global
            </h2>

            {isLoading ? (
              <p className="text-[#c2a382] animate-pulse">Afinando los datos...</p>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between bg-[#4a3728] p-4 rounded-xl border border-[#5d432c] hover:border-[#c2a382] transition-colors group">
                    <div className="flex items-center gap-4">
                      <span className={`text-xl font-black w-8 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-600' : 'text-[#c2a382]'}`}>
                        #{index + 1}
                      </span>
                      <p className="text-[#e8d2a6] font-bold text-lg group-hover:text-white">{user.usuario}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#c2a382] font-black text-2xl">{user.score}</p>
                      <p className="text-[#5d432c] text-[10px] font-bold uppercase">Puntos</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center">
          <button onClick={() => router.push('/Login')} className="text-[#a68663] text-sm hover:underline">
            Cerrar Sesión
          </button>
        </footer>
      </div>
    </div>
  );
}