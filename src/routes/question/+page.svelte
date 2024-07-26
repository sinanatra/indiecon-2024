<script>
    import { question } from "$lib/stores/question.js";

    let q = "";
    let color = "#0011ff";
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
            <h1>Choose a color</h1>
            <input type="color" id="color" name="color" bind:value={color} />
            <h1>Cartridge</h1>
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

    h1 {
        padding-top: 20px;
        padding-bottom: 10px;
    }

    textarea {
        border-radius: 3px;
        width: 100%;
        height: 200px;
        resize: none;
        max-width: 100%;
    }

    input {
        width: 100%;
        max-width: 100%;
        font-size: 16px;
    }

    button {
        border: none;
        background-color: rgb(216, 216, 216);
        color: black;
        margin-top: 20px;
        cursor: pointer;
        font-size: 16px;
        border-radius: 5px;
    }
</style>
