'use client';

import { useState } from 'react';

export default function TriviaPage() {
  const [correctas, setCorrectas] = useState(0);
  const [incorrectas, setIncorrectas] = useState(0);
  const [pregunta, setPregunta] = useState("Pregunta");
  const [opciones, setOpciones] = useState([
    "respuesta",
    "respuesta",
    "respuesta",
    "respuesta"
  ]);

  const manejarRespuesta = (opcion: string) => {
    if (opcion === "respuesta") {
      setCorrectas(correctas + 1);
      alert("¡Correcto! ");
    } else {
      setIncorrectas(incorrectas + 1);
      alert("Sigue intentando...");
    }
  };

  return (
    <div className="container mx-auto mt-20 text-center px-4">
      <h1 className="text-4xl font-bold mb-8">Trivia de preguntas</h1>

      {/* Contenedor de Marcador */}
      <div className="mb-6 text-center text-lg">
        <span className="mx-2">
          Correctas: <strong className="text-green-600">{correctas}</strong>
        </span>
        <span className="mx-2">
          Incorrectas: <strong className="text-red-600">{incorrectas}</strong>
        </span>
      </div>

      {/* Contenedor de Pregunta */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="text-xl mb-6 font-medium text-gray-800">
          {pregunta}
        </p>
        
        <div className="grid gap-3">
          {opciones.map((opcion, index) => (
            <button
              key={index}
              onClick={() => manejarRespuesta(opcion)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}