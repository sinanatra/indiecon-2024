<script>
    import SubmitText from "../components/submitText.svelte";
    import { onMount } from "svelte";
    import { question } from "$lib/stores/question.js";

    let data = [];
    let tags = [];
    async function fetchData() {
        const res = await fetch(`/api/question`);
        const json = await res.json();
        return json.reverse();
    }

    onMount(async () => {
        data = await fetchData();
        data = data[0];
        $question = data.question;
    });
</script>

<article>
    {#if data.question}
        <h1>{data.question}</h1>
        <SubmitText
            tags={data?.tags ? data.tags.sort() : ["happy", "okay", "sad"]}
            id={data._id}
        />
    {/if}
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
