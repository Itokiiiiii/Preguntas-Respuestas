'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const [isRegistering, setIsRegistering] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            alert("Completa los campos.");
            return;
        }

        if (isRegistering) {
            console.log("nuevo usuario ", formData.username);

            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Error al registrar");
                return;
            }

            localStorage.setItem('user_name', formData.username);

            alert("Cuenta creada");
            setIsRegistering(false);

        } else {
            console.log("inicio sesiopn ", formData.username);

            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('user_name', formData.username);
                router.push('/Salon');
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfaf1] px-4 font-sans text-[#2c1e14]">
            {/* Tarjeta con estética de madera/estudio */}
            <div className="max-w-md w-full bg-[#4a3728] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b-8 border-[#2c1e14] overflow-hidden">

                <div className="p-10">
                    {/* Encabezado Dinámico */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-[#e8d2a6] tracking-tighter uppercase italic">
                            {isRegistering ? 'Únete al Club' : 'Bienvenido de Nuevo'}
                        </h1>
                        <div className="h-1 w-20 bg-[#c2a382] mx-auto mt-2 rounded-full"></div>
                        <p className="text-[#c2a382] text-sm mt-4 font-medium">
                            {isRegistering ? 'Crea tu perfil de melómano' : 'Sintoniza tu cuenta'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[#e8d2a6] text-xs uppercase tracking-widest font-bold mb-2 ml-1">
                                Usuario
                            </label>
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl bg-[#3a2a1d] border-2 border-[#5d432c] text-[#fdfaf1] focus:border-[#c2a382] focus:ring-0 outline-none transition-all placeholder-[#5d432c]"
                                placeholder="SpinettaLover777"
                            />
                        </div>

                        <div>
                            <label className="block text-[#e8d2a6] text-xs uppercase tracking-widest font-bold mb-2 ml-1">
                                Contraseña
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl bg-[#3a2a1d] border-2 border-[#5d432c] text-[#fdfaf1] focus:border-[#c2a382] focus:ring-0 outline-none transition-all placeholder-[#5d432c]"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#c2a382] hover:bg-[#d9bc91] text-[#2c1e14] font-black py-4 rounded-xl shadow-[0_4px_0_rgb(140,100,60)] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest mt-4"
                        >
                            {isRegistering ? 'Crear mi Cuenta' : 'Entrar al Estudio'}
                        </button>
                    </form>

                    {/* Selector de modo */}
                    <div className="mt-8 text-center border-t border-[#5d432c] pt-6">
                        <p className="text-[#c2a382] text-sm">
                            {isRegistering ? '¿Ya eres miembro?' : '¿Eres nuevo por aquí?'}
                        </p>
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-[#e8d2a6] font-bold underline decoration-[#c2a382] hover:text-white transition-colors mt-1"
                        >
                            {isRegistering ? 'Inicia Sesión' : 'Regístrate Gratis'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}