import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import preguntas from '@/lib/datosSemilla.json';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("trivia");

        await db.collection("questions").deleteMany({});

        // Insertar las preguntas del archivo JSON
        await db.collection("questions").insertMany(preguntas);

        return NextResponse.json({ 
            success: true, 
            message: `${preguntas.length} preguntas cargadas correctamente.` 
        });
    } catch (error) {
        return NextResponse.json({ error: "Error al sembrar datos" }, { status: 500 });
    }
}