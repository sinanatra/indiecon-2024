<script>
    import { question } from "$lib/stores/question.js";
    import { cartridge } from "$lib/stores/cartridge.js";
    import { goto } from "$app/navigation";

    export let colour;
    let text = "";

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
            goto(`/recent`);
        } else {
            console.error("Failed to submit data.");
        }
    };
</script>

<section>
    <section style="color: {colour}">
        {#if $cartridge > 232}
            <textarea
                name="answer"
                id="answer"
                bind:value={text}
                maxlength="116"
                required
                style="color: {colour}"
            ></textarea>
            <!-- the max length == same as one line -->

            {#if text.length > 0}
                <button on:click={handleSubmit}>Submit</button>
            {:else}
                <button disabled>Submit</button>
            {/if}
        {:else}
            <textarea
                bind:value={text}
                maxlength="116"
                required
                style="color: {colour}"
                disabled
            ></textarea>
            <!-- the max length == same as one line -->

            <button disabled>Submit</button>
        {/if}
    </section>
</section>

<style>
    :global(div.multiselect) {
        background: white !important;
        border: none !important;
        border-radius: 3px !important;
        width: 100%;
    }

    textarea {
        border: 1px dashed rgb(54, 54, 54);
        background-color: rgb(248, 248, 248);
        border-radius: 3px;
        width: 100%;
        height: 300px;
        resize: none;
        max-width: 100%;
        font-family: "Recursive", monospace;
        font-size: 36px;
        outline: none !important;
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
        padding: 5px 10px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        /* width: 100%;
        min-height: 80px; */
        font-size: 40px;
        border-radius: 5px;
    }

    button:not(:disabled):hover {
        background-color: blue;
        color: white;
    }

    *:disabled {
        color: rgb(105, 105, 105);
        cursor: not-allowed;
    }
</style>
