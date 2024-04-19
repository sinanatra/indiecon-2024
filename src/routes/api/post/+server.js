import db from "$lib/db"

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        if (data.answer && data.answer != null) {
            const collection = await db.collection('indieData');
            collection.insertOne(data);
            return new Response(JSON.stringify(data), { status: 200 })
        }
        else {
            return new Response(JSON.stringify(data), { status: 422 })
        }

    } catch (err) {
        console.log(err)
    }
}