import db from "$lib/db";

export const GET = async ({ request, url }) => {
    try {
        const res = await db.collection('indieData')
            .find()
            .limit(100)
            .toArray()

        return new Response(JSON.stringify(res), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};


export const POST = async ({ request }) => {
    try {
        const data = await request.json();

        if (data) {
            const collection = await db.collection('question');
            await collection.insertOne(data);

            return new Response(JSON.stringify(data), { status: 200 });
        }

        return new Response(JSON.stringify(data), { status: 422 });
    } catch (err) {
        console.log(err);
    }
};
