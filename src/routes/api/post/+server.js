import db from "$lib/db";

export const POST = async ({ request }) => {
    try {
        const data = await request.json();

        if (data.question && data.answer && data.emotion >= 1 && data.emotion <= 5) {
            const collection = await db.collection('indieData');
            await collection.insertOne(data);
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Invalid data" }), { status: 422 });
        }
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
};