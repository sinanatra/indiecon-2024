<script>
    import { question } from "$lib/stores/question.js";

    let q = "";

    const handleSubmit = async () => {
        $question = q;
    };
</script>

<section>
    <textarea name="question" id="question" bind:value={q}></textarea>
    <button on:click={handleSubmit}>Submit</button>
</section>

<style>
    .message {
        background-color: yellow;
        padding: 10px;
        border-radius: 3px;
    }
</style>
