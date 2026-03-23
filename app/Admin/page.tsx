'use client';
import React, { useState } from 'react';
import GestionPreguntas from './paginas/GestionPregunta';
import GestionUsuarios from './paginas/GestionUsuarios';

export default function AdminDashboard() {
    const [view, setView] = useState<'menu' | 'preguntas' | 'usuarios'>('menu');

    return (
        <div className="min-h-screen bg-[#fdfaf1] font-sans text-[#2c1e14]">
            {/* Barra de Navegación */}
            <nav className="bg-[#4a3728] p-6 border-b-8 border-[#2c1e14] shadow-lg">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1
                        className="text-[#e8d2a6] text-2xl font-black uppercase italic cursor-pointer tracking-tighter"
                        onClick={() => setView('menu')}
                    >
                        Panel de administación <span className="text-[#c2a382]"></span>
                    </h1>

                    <div className="space-x-4">
                        <button
                            onClick={() => setView('preguntas')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${view === 'preguntas' ? 'bg-[#c2a382] text-[#2c1e14]' : 'text-[#e8d2a6] hover:bg-[#3a2a1d]'
                                }`}
                        >
                            Preguntas
                        </button>
                        <button
                            onClick={() => setView('usuarios')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${view === 'usuarios' ? 'bg-[#c2a382] text-[#2c1e14]' : 'text-[#e8d2a6] hover:bg-[#3a2a1d]'
                                }`}
                        >
                            Usuarios
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-8">
                {/* Lógica de intercambio de vistas */}
                {view === 'menu' && (
                    <div className="text-center py-20">
                        <h2 className="text-5xl font-black text-[#4a3728] uppercase mb-4 italic">Panel de Control</h2>
                        <p className="text-[#c2a382] font-medium mb-12 italic">Selecciona una sección para empezar a grabar datos</p>
                    </div>
                )}

                {view === 'preguntas' && <GestionPreguntas />}
                {view === 'usuarios' && <GestionUsuarios />}
            </main>
        </div>
    );
}