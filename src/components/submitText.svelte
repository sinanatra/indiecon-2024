<script>
    import { question } from "$lib/stores/question.js";

    let text = "";
    let message = "";

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert("Text field cannot be empty");
            return;
        }

        const postRequest = await fetch("/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: $question,
                answer: text,
            }),
        });

        const responses = await Promise.all([postRequest]);
        const success = responses.every((response) => response.ok);

        if (success) {
            console.log("Data submitted successfully.");
            message = "Data submitted successfully.";
        } else {
            console.error("Failed to submit data.");
            message = "Failed to submit data.";
        }
    };
</script>

<section>
    {#if message}
        <div class="message">
            <p>{message}</p>
            <a href="/archive" target="_self"
                >Check the latest entries and print it.</a
            >
        </div>
    {:else}
        <section>
            <textarea
                name="answer"
                id="answer"
                bind:value={text}
                maxlength="107"
                required
            ></textarea>
            <!-- the max length == same as one line -->

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

    :global(div.multiselect) {
        background: white !important;
        border: none !important;
        border-radius: 3px !important;
        width: 100%;
    }

    textarea {
        border: 1px dashed;
        background-color: rgb(248, 248, 248);
        border-radius: 3px;
        width: 100%;
        height: 150px;
        resize: none;
        max-width: 100%;
        font-size: 18px;
    }

    input {
        border: none;
        width: 100%;
        max-width: 100%;
        font-size: 16px;
    }

    button {
        border: none;
        background-color: rgb(248, 248, 248);
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
