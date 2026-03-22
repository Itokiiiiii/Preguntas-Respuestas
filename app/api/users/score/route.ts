import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("trivia");

    await db.collection("users").updateOne(
        { username: body.username },
        { $set: { score: body.score } }
    );

    return NextResponse.json({ success: true });
}