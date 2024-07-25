<script>
    import { onMount } from "svelte";
    import Poster from "@components/Poster.svelte";

    let questions = [];
    let answers = [];
    let history = [];
    let currentIndex = 1;
    let intervalId;
    let ms = 100;
    let question = "";
    let datum = [];

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

    function startInterval() {
        intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % history.length;
        }, ms);
    }

    function stopInterval() {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }

    $: {
        if (history.length > 0) {
            stopInterval();
            startInterval();
        }
    }

    onMount(async () => {
        questions = await fetchQuestions();
        answers = await fetchData();

        question = questions.find(
            (d) => d._id == data.slug.replace("history-", ""),
        );

        datum = answers
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

        history = [];
        for (let index = 1; index <= datum[0].data.length; index++) {
            history.push({
                question: datum[0].question,
                data: datum[0].data.reverse().slice(0, index),
            });
        }
    });

    $: splitData = {
        question: question.question,
        data: datum[0]?.data.slice(0, currentIndex),
    };
</script>

<article>
    {#if question && splitData && datum}
        <article class="container">
            <Poster q={splitData} i={currentIndex} {questions} />
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
