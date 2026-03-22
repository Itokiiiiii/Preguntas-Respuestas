'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { generarPregunta } from '@/lib/tilin';

export default function TriviaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [datos, setDatos] = useState<any>(null);
    const [correctas, setCorrectas] = useState(0);
    const [incorrectas, setIncorrectas] = useState(0);
    const [respondido, setRespondido] = useState(false);
    const [preguntaActual, setPreguntaActual] = useState(1);
    const [errorAPI, setErrorAPI] = useState(false);

    const yaSePidioPregunta = useRef(false);

    const cargarNuevaPregunta = async () => {
        if (preguntaActual >= 10) {

            const username = localStorage.getItem('user_name');

            if (username) {
                // Guardar en local
                localStorage.setItem(`score_${username}`, correctas.toString());

                // Guardar en Mongo
                await fetch('/api/users/score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username,
                        score: correctas
                    })
                });
            }

            router.push('/Salon');
            return;
        }
        setLoading(true);
        setRespondido(false);
        setErrorAPI(false);

        const nuevaPregunta = await generarPregunta();

        if (nuevaPregunta && !nuevaPregunta.error) {
            setDatos(nuevaPregunta);
            setPreguntaActual(prev => prev + 1);
        } else {
            setErrorAPI(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (yaSePidioPregunta.current) return;
        yaSePidioPregunta.current = true;

        const iniciar = async () => {
            setLoading(true);
            setErrorAPI(false);
            const primera = await generarPregunta();

            if (primera && !primera.error) {
                setDatos(primera);
            } else {
                setErrorAPI(true);
            }
            setLoading(false);
        };
        iniciar();
    }, []);

    const manejarRespuesta = (opcion: string) => {
        if (respondido) return;
        setRespondido(true);

        if (opcion === datos.correct_answer) {
            setCorrectas(prev => prev + 1);
        } else {
            setIncorrectas(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfaf1] p-6 text-[#2c1e14]">
            <div className="max-w-2xl mx-auto">

                <p className="text-center mb-2 font-black text-[#a68663] uppercase text-xs tracking-widest">
                    Track {preguntaActual} de 10
                </p>

                <div className="flex justify-around mb-8 bg-[#4a3728] p-4 rounded-2xl border-b-4 border-[#2c1e14] text-[#e8d2a6] font-bold shadow-xl">
                    <span>Correctas: <span className="text-green-400">{correctas}</span></span>
                    <span>Incorrectas: <span className="text-red-400">{incorrectas}</span></span>
                </div>

                <div className="bg-[#4a3728] rounded-3xl p-8 shadow-2xl border-t-8 border-[#5d432c] min-h-[400px]">
                    {loading ? (
                        <div className="text-center text-[#e8d2a6] py-20 animate-pulse font-bold uppercase">
                            Sintonizando Gemini 2.5...
                        </div>
                    ) : errorAPI ? (
                        <div className="text-center text-red-400 py-20 font-bold">
                            <p>Hubo una interferencia en la conexión (o límite de cuota).</p>
                            <p className="text-sm mt-2 mb-4 text-[#c2a382]">Espera 1 minuto y vuelve a intentar.</p>
                            <button onClick={cargarNuevaPregunta} className="bg-[#c2a382] text-[#2c1e14] px-6 py-2 rounded-full uppercase text-xs">
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-[#c2a382] text-xs font-bold mb-2 uppercase tracking-widest italic">
                                {datos?.genero || 'Música General'}
                            </p>
                            <h2 className="text-[#e8d2a6] text-2xl font-bold mb-8 leading-tight">
                                {datos?.pregunta}
                            </h2>

                            <div className="grid gap-3">
                                {Array.isArray(datos?.options) ? (
                                    datos.options.map((opcion: string, index: number) => (
                                        <button
                                            key={index}
                                            disabled={respondido}
                                            onClick={() => manejarRespuesta(opcion)}
                                            className={`w-full py-4 px-6 rounded-xl font-bold text-left transition-all border-b-4 
                                                ${!respondido
                                                    ? 'bg-[#3a2a1d] text-[#e8d2a6] border-[#2c1e14] hover:bg-[#5d432c]'
                                                    : opcion === datos.correct_answer
                                                        ? 'bg-green-600 text-white border-green-800'
                                                        : 'bg-[#3a2a1d] text-[#5d432c] border-[#2c1e14] opacity-50'
                                                }`}
                                        >
                                            {opcion}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-[#e8d2a6] italic text-center">Datos corruptos, pulsa siguiente.</p>
                                )}
                            </div>

                            {respondido && (
                                <div className="mt-8 text-center">
                                    <p className="text-[#c2a382] mb-4 italic text-sm">{datos.explanation}</p>
                                    <button
                                        onClick={cargarNuevaPregunta}
                                        className="bg-[#c2a382] text-[#2c1e14] px-8 py-3 rounded-full font-black uppercase text-xs hover:bg-white transition-all shadow-lg"
                                    >
                                        {preguntaActual >= 10 ? "Finalizar Trivia" : "Siguiente Pregunta"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <button
                    onClick={() => router.push('/Salon')}
                    className="mt-8 block mx-auto text-[#a68663] font-bold hover:underline"
                >
                    ← Abandonar Sesión
                </button>
            </div>
        </div>
    );
}