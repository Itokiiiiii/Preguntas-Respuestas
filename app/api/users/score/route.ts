import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const client = await clientPromise;
        const db = client.db("trivia");

        await db.collection("users").updateOne(
            { username: body.username },
            { 
                $inc: { score: body.score }
            }
        );

        return NextResponse.json({ success: true, message: "Puntaje acumulado" });
    } catch (error) {
        return NextResponse.json({ error: "Error al sumar puntaje" }, { status: 500 });
    }
}