<script>
    import MultiSelect from "svelte-multiselect";
    import { question } from "$lib/stores/question.js";
    import { cartridge } from "$lib/stores/cartridge.js";

    let text = "";
    let message = "";
    export let tags;
    export let id;
    let selectedTags;

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert("Text field cannot be empty");
            return;
        }
        // if (selectedTags.length < 2) {
        //     alert("Tags should be at least 2");
        //     return;
        // }

        const postRequest = await fetch("/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: $question,
                answer: text,
                // tags: selectedTags,
            }),
        });

        // const patchRequest = await fetch("/api/question", {
        //     method: "PATCH",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         id: id,
        //         // tags: selectedTags,
        //     }),
        // });

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
            <a href="/latest" target="_self">Check the latest entries.</a>
        </div>
    {:else}
        <section>
            <textarea
                name="answer"
                id="answer"
                bind:value={text}
                maxlength="400"
                required
            ></textarea>

            <!-- <MultiSelect
                id="tag-select"
                options={tags}
                bind:value={selectedTags}
                placeholder="Select 3 tags or add new ones.."
                allowUserOptions="append"
                required
            ></MultiSelect> -->

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

    section {
        padding-top: 20px;
        max-width: 640px;
    }

    textarea {
        border: 1px dashed;
        background-color: rgb(246, 255, 254);
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
        background-color: rgb(230, 255, 252);
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
