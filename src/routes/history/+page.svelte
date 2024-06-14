<script>
    import { onMount } from "svelte";
    import Poster from "@components/Poster.svelte";

    let data = [];
    let questions = [];

    async function fetchQuestions() {
        const res = await fetch(`/api/question`);
        const json = await res.json();
        return json.reverse();
    }

    onMount(async () => {
        questions = await fetchQuestions();
    });
</script>

<article>
    {#if questions.length > 0}
        <article class="container">
            {#each questions as q, i}
                <a href="history-{q._id}">{q.question}</a>
            {/each}
        </article>
    {:else}
        <p>Loading...</p>
    {/if}
</article>

<style>
    article {
        padding: 10px;
        background-color: white;
    }

    p {
        font-size: 12px;
    }

    a {
        display: block;
        color: blue;
    }
</style>
