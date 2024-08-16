<script>
    import { onMount } from "svelte";
    import Poster from "@components/Poster.svelte";

    let data = [];
    let questions = [];

    async function fetchData() {
        const res = await fetch(`/api/getAll`);
        const json = await res.json();
        return json.reverse();
    }

    async function fetchQuestions() {
        const res = await fetch(`/api/question`);
        const json = await res.json();
        return json.reverse();
    }

    onMount(async () => {
        questions = await fetchQuestions();
        data = await fetchData();

        const questionMap = new Map();
        for (const entry of data) {
            const { question, answer } = entry;
            if (!questionMap.has(question)) {
                questionMap.set(question, { question, data: [] });
            }
            questionMap.get(question).data.push({ answer });
        }

        data = Array.from(questionMap.values());
    });

    // $: console.log(data)
</script>

<article>
    {#if data.length > 0}
        <article class="container">
            {#each data as q, i}
                <Poster
                    {q}
                    {i}
                    {questions}
                    submitted={true}
                    staticPoster={true}
                    back={true}
                />
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

    .container {
        display: flex;
        flex-wrap: nowrap;
        overflow: auto;
        gap: 10px;
        /* margin-top: 40px; */
    }

    p {
        font-size: 12px;
    }
</style>
