'use client';
import React, { useState, useEffect } from 'react';

export default function GestionUsuarios() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        _id: '',
        username: '',
        password: '', // Añadimos password ya que tu DB lo usa
        role: 'user',
        score: 0
    });

    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSend = { ...formData };
        if (!dataToSend._id) delete (dataToSend as any)._id;

        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        });

        if (res.ok) {
            alert("¡Usuario actualizado!");
            setFormData({ _id: '', username: '', password: '', role: 'user', score: 0 });
            fetchUsers();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-[#4a3728] rounded-3xl p-8 mb-10 border-b-8 border-[#2c1e14]">
                <h1 className="text-[#e8d2a6] text-3xl font-black uppercase italic mb-6">
                    {formData._id ? 'Editar Músico' : 'Nuevo Registro'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="p-3 rounded-lg bg-[#3a2a1d] text-[#fdfaf1] border border-[#5d432c] outline-none"
                            placeholder="Nombre de Usuario"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                        />
                        <input
                            className="p-3 rounded-lg bg-[#3a2a1d] text-[#fdfaf1] border border-[#5d432c] outline-none"
                            placeholder="Contraseña"
                            type="text" // La dejo en text para que tú como admin las veas
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <select
                        className="w-full p-3 rounded-lg bg-[#3a2a1d] text-[#e8d2a6] border border-[#5d432c] font-bold"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="user">Oyente (User)</option>
                        <option value="admin">Productor (Admin)</option>
                    </select>

                    <button type="submit" className="w-full bg-[#c2a382] py-4 rounded-xl font-bold uppercase text-[#2c1e14]">
                        {formData._id ? 'Actualizar Datos' : 'Grabar Usuario'}
                    </button>
                </form>
            </div>

            {/* Tabla Simple */}
            <div className="bg-[#4a3728] rounded-3xl overflow-hidden border-b-8 border-[#2c1e14]">
                <table className="w-full text-left">
                    <thead className="bg-[#3a2a1d] text-[#c2a382] text-xs uppercase">
                        <tr>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Puntos</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5d432c]">
                        {users.map((u: any) => (
                            <tr key={u._id} className="text-[#fdfaf1]">
                                <td className="p-4 font-bold">{u.username}</td>
                                <td className="p-4 text-[#c2a382]">{u.score}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${
                                        u.role === 'admin' ? 'bg-[#e8d2a6] text-[#2c1e14]' : 'bg-[#2c1e14] text-[#c2a382]'
                                    }`}>
                                        {u.role || 'user'}
                                    </span>
                                </td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => setFormData(u)} className="text-[#e8d2a6] text-xs font-bold uppercase">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}