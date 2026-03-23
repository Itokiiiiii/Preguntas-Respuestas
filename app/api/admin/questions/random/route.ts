import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("trivia");

        const randomQuestion = await db.collection("questions")
            .aggregate([{ $sample: { size: 1 } }])
            .toArray();

        if (!randomQuestion || randomQuestion.length === 0) {
            return NextResponse.json({ error: "DB vacía" }, { status: 404 });
        }

        return NextResponse.json(randomQuestion[0]);
    } catch (error) {
        return NextResponse.json({ error: "Error en servidor" }, { status: 500 });
    }
}