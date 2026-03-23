import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("trivia");

    const existingUser = await db.collection("users").findOne({
        username: body.username
    });

    if (existingUser) {
        return NextResponse.json({ error: "Usuario ya existe" }, { status: 400 });
    }

    // Al insertar, ahora forzamos el campo 'role'
    await db.collection("users").insertOne({
        username: body.username,
        password: body.password,
        role: "user",
        score: 0,
        createdAt: new Date()
    });

    return NextResponse.json({ success: true });
}