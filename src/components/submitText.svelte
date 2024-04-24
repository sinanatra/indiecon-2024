<script>
    import { question } from "$lib/stores/question.js";

    let text = "";
    let emotion = "";
    let message = "";

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert("Text field cannot be empty");
            return;
        }
        if (emotion < 1 || emotion > 5) {
            alert("Emotion must be between 1 and 5");
            return;
        }

        const response = await fetch("/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: $question,
                answer: text,
                emotion: parseInt(emotion),
            }),
        });

        if (response.ok) {
            console.log("Data submitted successfully");
            message = "Data submitted successfully";
        } else {
            console.error("Error submitting data");
        }
    };
</script>

<section>
    {#if message}
        <div class="message">
            <p>{message}</p>
            <a href="/latest" target="_self">Check the latest entries.</a>
        </div>
    {:else}
        <section>
            <textarea
                name="answer"
                id="answer"
                bind:value={text}
                maxlength="320"
            ></textarea>
            <input
                type="number"
                name="emotion"
                id="emotion"
                bind:value={emotion}
                min="1"
                max="5"
            />
            <button on:click={handleSubmit}>Submit</button>
        </section>
    {/if}
</section>

<style>
    .message {
        background-color: yellow;
        padding: 10px;
        border-radius: 3px;
    }


    section {
        padding-top: 20px;
        max-width: 640px;
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

    button:hover {
        background-color: blue;
        color: white;
    }
</style>
