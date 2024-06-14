<script>
    import { onMount } from "svelte";
    import Poster from "@components/Poster.svelte";

    let questions = [];
    let answers = [];
    let history = [];
    export let data;

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

        answers = await fetchData();

        let question = questions.find(
            (d) => d._id == data.slug.replace("history-", ""),
        );

        let datum = answers
            .filter((d) => d.question == question.question)
            .reduce((acc, entry) => {
                const { question, answer } = entry;
                const lastCluster = acc[acc.length - 1];

                if (!lastCluster || lastCluster.question !== question) {
                    acc.push({ question, data: [{ answer }] });
                } else {
                    lastCluster.data.push({ answer });
                }

                return acc;
            }, []);

        for (let index = 1; index <= datum[0].data.length; index++) {
            history = [
                ...history,
                {
                    question: datum[0].question,
                    data: datum[0].data.slice(0, index),
                },
            ];
        }
    });
</script>

<article>
    {#if history.length > 0}
        <article class="container">
            {#each history.reverse() as q, i}
                <Poster {q} {i} {questions} submitted={true} />
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
    }

    p {
        font-size: 12px;
    }
</style>
