import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// OBTENER USUARIOS (Para el Panel Admin)
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("trivia");
        const users = await db.collection("users").find({}).toArray();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
    }
}

// CREAR O ACTUALIZAR (Tu lógica de registro + Admin)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("trivia");

        // CASO A: ACTUALIZAR
        if (body._id) {
            const { _id, ...updateData } = body;
            await db.collection("users").updateOne(
                { _id: new ObjectId(_id) },
                { $set: updateData }
            );
            return NextResponse.json({ success: true, message: "Usuario actualizado" });
        }

        // CASO B: REGISTRO NUEVO
        const existingUser = await db.collection("users").findOne({
            username: body.username
        });

        if (existingUser) {
            return NextResponse.json({ error: "El músico ya está en la banda (Usuario ya existe)" }, { status: 400 });
        }

        await db.collection("users").insertOne({
            username: body.username,
            password: body.password || "123456",
            email: body.email || "",
            role: body.role || "user",
            score: body.score || 0,
            createdAt: new Date()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}

// 3. ELIMINAR (Para el Panel Admin)
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

        const client = await clientPromise;
        const db = client.db("trivia");

        let query: any;

        try {
            query = { _id: new ObjectId(id) };
        } catch (e) {
            query = { _id: id };
        }

        const result = await db.collection("users").deleteOne(query as any);

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
    }
}