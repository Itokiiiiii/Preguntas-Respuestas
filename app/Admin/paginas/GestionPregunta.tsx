'use client';
import React, { useState, useEffect } from 'react';

export default function GestionPreguntas() {
    const [questions, setQuestions] = useState([]);
    const [formData, setFormData] = useState({
        _id: '',
        pregunta: '',
        options: ['', '', '', ''],
        correct_answer: '',
        genero: '',
        explanation: ''
    });

    const fetchQuestions = async () => {
        const res = await fetch('/api/admin/questions');
        const data = await res.json();
        setQuestions(data);
    };

    useEffect(() => { fetchQuestions(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSend = { ...formData };

        if (!dataToSend._id || dataToSend._id === '') {
            delete (dataToSend as any)._id;
        }

        const res = await fetch('/api/admin/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        });

        if (res.ok) {
            alert("¡Disco grabado con éxito!");
            setFormData({ _id: '', pregunta: '', options: ['', '', '', ''], correct_answer: '', genero: '', explanation: '' });
            fetchQuestions();
        } else {
            const err = await res.json();
            alert(err.error);
        }
    };

    const deleteQuestion = async (id: string) => {
        if (!confirm("¿Borrar esta pista del álbum?")) return;
        await fetch(`/api/admin/questions?id=${id}`, { method: 'DELETE' });
        fetchQuestions();
    };

    return (
        <div className="min-h-screen bg-[#fdfaf1] p-8 font-sans text-[#2c1e14]">
            <div className="max-w-4xl mx-auto">

                <div className="bg-[#4a3728] rounded-3xl p-8 mb-10 shadow-2xl border-b-8 border-[#2c1e14]">
                    <h1 className="text-[#e8d2a6] text-3xl font-black uppercase italic mb-6">
                        {formData._id ? 'Editando Pista' : 'Gestion de Preguntas'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Pregunta */}
                        <textarea
                            className="w-full p-4 rounded-xl bg-[#3a2a1d] text-[#fdfaf1] border-2 border-[#5d432c] outline-none focus:border-[#c2a382] resize-none"
                            placeholder="Escribe la pregunta aquí..."
                            rows={2}
                            value={formData.pregunta}
                            onChange={e => setFormData({ ...formData, pregunta: e.target.value })}
                            required
                        />

                        {/* Opciones */}
                        <div className="grid grid-cols-2 gap-4">
                            {formData.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-[#c2a382] font-bold">{i + 1}.</span>
                                    <input
                                        className="flex-1 p-3 rounded-lg bg-[#3a2a1d] text-[#fdfaf1] border border-[#5d432c]"
                                        placeholder={`Opción ${i + 1}`}
                                        value={opt}
                                        onChange={e => {
                                            const newOpts = [...formData.options];
                                            newOpts[i] = e.target.value;
                                            setFormData({ ...formData, options: newOpts });
                                        }}
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* SELECTOR DE RESPUESTA CORRECTA */}
                            <div>
                                <label className="block text-[#e8d2a6] text-xs font-bold uppercase mb-2 ml-1">Respuesta Ganadora</label>
                                <select
                                    className="w-full p-3 rounded-lg bg-[#3a2a1d] text-[#e8d2a6] border border-[#5d432c] outline-none font-bold"
                                    value={formData.correct_answer}
                                    onChange={e => setFormData({ ...formData, correct_answer: e.target.value })}
                                    required
                                >
                                    <option value="">-- Elige la correcta --</option>
                                    {formData.options.map((opt, i) => (
                                        opt && <option key={i} value={opt}>Opción {i + 1}: {opt.substring(0, 20)}...</option>
                                    ))}
                                </select>
                            </div>

                            {/* GÉNERO */}
                            <div>
                                <label className="block text-[#e8d2a6] text-xs font-bold uppercase mb-2 ml-1">Género Musical</label>
                                <input
                                    className="w-full p-3 rounded-lg bg-[#3a2a1d] text-[#e8d2a6] border border-[#5d432c]"
                                    placeholder="Ej: Rock Progresivo"
                                    value={formData.genero}
                                    onChange={e => setFormData({ ...formData, genero: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* EXPLICACIÓN */}
                        <div>
                            <label className="block text-[#e8d2a6] text-xs font-bold uppercase mb-2 ml-1">Explicación (Storytelling)</label>
                            <textarea
                                className="w-full p-4 rounded-xl bg-[#3a2a1d] text-[#fdfaf1] border-2 border-[#5d432c] outline-none focus:border-[#c2a382] resize-none"
                                placeholder="¿Por qué esta es la respuesta? Cuéntale algo al usuario..."
                                rows={2}
                                value={formData.explanation}
                                onChange={e => setFormData({ ...formData, explanation: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="w-full bg-[#c2a382] py-4 rounded-xl font-bold uppercase tracking-widest text-[#2c1e14] shadow-[0_4px_0_rgb(140,100,60)] active:translate-y-1 active:shadow-none transition-all mt-4">
                            {formData._id ? 'Actualizar Master' : 'Grabar en el Álbum'}
                        </button>

                        {formData._id && (
                            <button type="button" onClick={() => setFormData({ _id: '', pregunta: '', options: ['', '', '', ''], correct_answer: '', genero: '', explanation: '' })} className="w-full text-[#e8d2a6] text-sm underline mt-2 hover:text-white transition-colors">Descartar Edición</button>
                        )}
                    </form>
                </div>

                {/*tabla de preguntas*/}

                <div className="bg-[#4a3728] rounded-3xl overflow-hidden shadow-xl border-b-8 border-[#2c1e14]">
                    <div className="p-6 border-b border-[#5d432c]">
                        <h2 className="text-[#e8d2a6] font-bold uppercase tracking-widest text-sm">Archivo de Preguntas</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#3a2a1d] text-[#c2a382] text-xs uppercase">
                                <tr>
                                    <th className="p-4">Pregunta</th>
                                    <th className="p-4">Género</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#5d432c]">
                                {questions.map((q: any) => (
                                    <tr key={q._id} className="hover:bg-[#533f2f] transition-colors">
                                        <td className="p-4 text-[#fdfaf1] font-medium text-sm">{q.pregunta}</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-[#2c1e14] text-[#c2a382] rounded text-[10px] uppercase font-bold">{q.genero}</span></td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => { setFormData(q); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[#e8d2a6] hover:text-white text-xs font-bold uppercase">Editar</button>
                                            <button onClick={() => deleteQuestion(q._id)} className="text-red-400 hover:text-red-200 text-xs font-bold uppercase">Borrar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}