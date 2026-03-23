import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// OBTENER TODAS LAS PREGUNTAS
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("trivia");
        const questions = await db.collection("questions").find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(questions);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
    }
}

// GUARDAR O ACTUALIZAR (POST)
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const client = await clientPromise;
        const db = client.db("trivia");

        // Lógica que pediste: Verificar si ya existe por el texto de la pregunta
        const existe = await db.collection("questions").findOne({ pregunta: data.pregunta });

        if (existe && !data._id) { // Si existe y no estamos editando una vieja
            return NextResponse.json({ error: "Esa pregunta ya existe en el disco." }, { status: 400 });
        }

        if (data._id) {
            // Actualizar existente
            const { _id, ...updateData } = data;
            await db.collection("questions").updateOne(
                { _id: new ObjectId(_id) },
                { $set: updateData }
            );
            return NextResponse.json({ message: "Sintonía actualizada" });
        } else {
            // Insertar nueva
            await db.collection("questions").insertOne({
                ...data,
                createdAt: new Date()
            });
            return NextResponse.json({ message: "Guardado en el club" });
        }
    } catch (error) {
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}

// ELIMINAR (DELETE)
export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("trivia");
    await db.collection("questions").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Eliminado" });
}