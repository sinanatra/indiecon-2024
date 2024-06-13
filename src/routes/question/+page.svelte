<script>
    import { question } from "$lib/stores/question.js";

    let q = "";
    let color = "#cbffcb";
    let cartridge = 8000;
    let message = "";

    const handleSubmit = async () => {
        // question.set(q);
        const response = await fetch("/api/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: q, color, cartridge }),
        });
        if (!response.ok) {
            console.error("Error writing question message", {
                status: response.status,
                message: await response.text(),
            });

            return;
        } else {
            message = "Data submitted successfully";
        }
    };
</script>

<article>
    {#if message}
        <div class="message">
            <p>{message}</p>
            <a href="/" target="_self">Go back to the home.</a>
        </div>
    {:else}
        <section>
            <h1>Write a Question to ask.</h1>
            <textarea name="question" id="question" bind:value={q}></textarea>
            <h3>Choose a color</h3>
            <input type="color" id="color" name="color" bind:value={color} />
            <h3>Cartridge</h3>
            <input
                type="number"
                id="number"
                name="number"
                bind:value={cartridge}
            />
            <button on:click={handleSubmit}>Submit</button>
        </section>
    {/if}
</article>

<style>
    article {
        padding: 10px;
        background-color: gainsboro;
        height: 100vh;
    }

    .message {
        background-color: yellow;
        padding: 10px;
        border-radius: 3px;
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
