import db from "$lib/db";
import { ObjectId } from 'mongodb';

export const GET = async ({ request, url }) => {
    try {
        const res = await db.collection('question')
            .find()
            .limit(20)
            .toArray();

        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

export const POST = async ({ request }) => {
    try {
        const data = await request.json();

        if (data.question.length > 3) {
            const collection = await db.collection('question');
            await collection.insertOne({ ...data, selected: false }); // Default to not selected
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Invalid data" }), { status: 422 });
        }
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
};

export const PATCH = async ({ request }) => {
    try {
        const data = await request.json();

        if (!data.id) {
            return new Response(JSON.stringify({ error: "No ID provided" }), { status: 400 });
        }

        const collection = await db.collection('question');

        // First, unset the selected flag for all questions
        await collection.updateMany({}, { $set: { selected: false } });

        // Then, set the selected flag for the chosen question
        const result = await collection.updateOne(
            { _id: new ObjectId(data.id) },
            { $set: { selected: true } }
        );

        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ message: "No changes made or document not found" }), { status: 204 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
};
