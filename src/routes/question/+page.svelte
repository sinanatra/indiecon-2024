<script>
    import { question } from "$lib/stores/question.js";

    let q = "";

    const handleSubmit = async () => {
        $question = q;
    };
</script>

<article>
    <h1>Write a Question to ask.</h1>
    <textarea name="question" id="question" bind:value={q}></textarea>
    <button on:click={handleSubmit}>Submit</button>
</article>

<style>
    article {
        padding: 10px;
    }
</style>
