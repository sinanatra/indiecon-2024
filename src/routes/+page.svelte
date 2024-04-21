<script>
    import { question } from "$lib/stores/question.js";
    import SubmitText from "../components/submitText.svelte";
</script>

<article>
    <h1>{$question}</h1>
    <SubmitText />
</article>

<style>
    article {
        padding: 10px;
    }

    h1 {
        font-size: 6vw;
        line-height: 6vw;
        max-width: 1200px;
    }
</style>
