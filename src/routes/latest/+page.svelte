<script>
    import { onMount } from "svelte";
    import Poster from "@components/Poster.svelte";
    let data = [];
    let questions = [];

    async function fetchData() {
        const res = await fetch(`/api/get`);
        const json = await res.json();
        return json;
    }

    async function fetchQuestions() {
        const res = await fetch(`/api/question`);
        const json = await res.json();
        return json.reverse();
    }

    onMount(async () => {
        questions = await fetchQuestions();

        data = await fetchData();
        data = data.reduce((acc, entry) => {
            const { question, answer, tags } = entry;
            const groupIndex = acc.findIndex(
                (group) => group.question === question,
            );
            if (groupIndex === -1) {
                acc.push({ question, data: [{ answer, tags }] });
            } else {
                acc[groupIndex].data.push({ answer, tags });
            }
            return acc;
        }, []);
    });
</script>

<article>
    <!-- <h2>Here are displayed the last few entries per poster.</h2> -->
    {#if data.length > 0 && questions.length > 0}
        <article class="container">
            {#each data as q, i}
                {#each q.data as q, l}
                    <div>
                        {q.answer}
                    </div>
                    <!-- <Poster {q} {i} {questions} /> -->
                {/each}
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

    button {
        position: relative;
        margin-bottom: 5px;
    }

    .container {
        display: flex;
        flex-wrap: nowrap;
        flex-wrap: wrap;
        overflow: auto;
        gap: 10px;
        /* margin-top: 40px; */
    }

    div {
        width: 320px;
        height: fit-content;
        background-color: rgb(246, 255, 254);
        padding: 5px;
    }
</style>
