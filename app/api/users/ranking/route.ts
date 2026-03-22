import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
    const client = await clientPromise;
    const db = client.db("trivia");

    const users = await db
        .collection("users")
        .find({})
        .sort({ score: -1 })
        .limit(10)
        .toArray();

    const formatted = users.map((u: any) => ({
        id: u._id.toString(),
        usuario: u.username,
        score: u.score || 0
    }));

    return NextResponse.json(formatted);
}