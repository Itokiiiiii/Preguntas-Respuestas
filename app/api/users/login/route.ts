import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("trivia");

    const user = await db.collection("users").findOne({
        username: body.username,
        password: body.password
    });

    if (!user) {
        return NextResponse.json({ success: false });
    }

    return NextResponse.json({ success: true, user });
}