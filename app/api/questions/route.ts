import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  const API_KEY = "AIzaSyCO2HIc6I9kh_FzWPtPGkEneQptWF0UKMo"; 

  const modelName = "gemini-2.5-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

  console.log(`🎸 Conectando con ${modelName} (Alta Cuota)...`);

  const body = {
    contents: [{
      parts: [{
        text: "Genera una pregunta de trivia sobre música en general. Responde estrictamente con un objeto JSON: genero, pregunta, options (arreglo de 4 strings), correct_answer, explanation."
      }]
    }],
    generationConfig: {
      responseMimeType: "application/json",
    }
  };

  const fetchWithRetry = async (targetUrl: string, retries = 3, delay = 2000): Promise<Response> => {
    let lastResponse: Response | null = null;

    for (let i = 0; i < retries; i++) {
      lastResponse = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (lastResponse.ok) return lastResponse;

      if (lastResponse.status === 429) {
        console.log(`⏳ Cuota temporalmente agotada. Reintento ${i + 1} en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      break;
    }
    return lastResponse!;
  };

  try {
    const response = await fetchWithRetry(url);
    const genData = await response.json();

    if (!response.ok) {
      console.error("🔴 Error final de Google:", JSON.stringify(genData, null, 2));
      return NextResponse.json({
        error: "Límite de Google alcanzado. Por favor, espera 1 minuto.",
        status: response.status
      }, { status: response.status });
    }

    const rawText = genData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Respuesta vacía");

    const parsed = JSON.parse(rawText);

    // GUARDAR EN MONGO
    const client = await clientPromise;
    const db = client.db("trivia");

    const existe = await db.collection("questions").findOne({
      pregunta: parsed.pregunta
    });

    if (existe) {
      // devolver una aleatoria de Mongo
      const random = await db.collection("questions")
        .aggregate([{ $sample: { size: 1 } }])
        .toArray();

      return NextResponse.json(random[0]);
    }

    // 👉 SOLO entra aquí si NO existe
    await db.collection("questions").insertOne({
      ...parsed,
      createdAt: new Date()
    });

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("🚨 Error crítico:", error.message);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}