<script>
    import { question } from "$lib/stores/question.js";

    let q = "";
    let color = "#cbffcb";

    const handleSubmit = async () => {
        // question.set(q);
        const response = await fetch("/api/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: q, color }),
        });
        if (!response.ok) {
            console.error("Error writing question message", {
                status: response.status,
                message: await response.text(),
            });

            return;
        }
    };
</script>

<article>
    <section>
        <h1>Write a Question to ask.</h1>
        <textarea name="question" id="question" bind:value={q}></textarea>
        <h3>Choose a color</h3>
        <input type="color" id="body" name="body" bind:value={color} />
        <button on:click={handleSubmit}>Submit</button>
    </section>
</article>

<style>
    article {
        padding: 10px;
        background-color: gainsboro;
        height: 100vh;
    }

    section {
        max-width: 900px;
    }

    textarea {
        border: none;
        background-color: white;
        border-radius: 3px;
        width: 100%;
        height: 200px;
        resize: none;
        max-width: 100%;
    }

    input {
        border: none;
        width: 100%;
        max-width: 100%;
        font-size: 16px;
    }

    button {
        border: none;
        background-color: white;
        color: black;
        margin-top: 5px;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
    }
</style>
