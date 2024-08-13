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
        {#if $cartridge > 113}
            <textarea
                name="answer"
                id="answer"
                bind:value={text}
                maxlength="113"
                required
                style="color: {colour}"
            ></textarea>
            <!-- the max length == same as one line -->

            <button on:click={handleSubmit}>Submit</button>
        {:else}
            <textarea
                bind:value={text}
                maxlength="113"
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
        border: 1px dashed;
        background-color: rgb(248, 248, 248);
        border-radius: 3px;
        width: 100%;
        height: 350px;
        resize: none;
        max-width: 100%;
        font-family: sono, monospace;
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
        cursor: pointer;
        font-size: 24px;
        border-radius: 5px;
    }

    button:not(:disabled):hover {
        background-color: blue;
        color: white;
    }

    *:disabled{
        cursor: not-allowed;
    }
</style>
