<script>
    import SubmitText from "../components/submitText.svelte";
    import { onMount } from "svelte";
    import { question } from "$lib/stores/question.js";
    import { cartridge } from "$lib/stores/cartridge.js";
    import Poster from "@components/Poster.svelte";
    let data = [];
    let questions = [];
    let posters = [];
    let datum = "";
    async function fetchData() {
        const res = await fetch(`/api/question`);
        const json = await res.json();
        return json.reverse();
    }

    async function fetchAll() {
        const res = await fetch(`/api/getAll`);
        const json = await res.json();
        return json.reverse();
    }

    onMount(async () => {
        questions = await fetchAll();
        data = await fetchData();

        posters = questions
            .filter((d) => d.question == data[0].question)
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

        datum = data[0];
        $question = datum.question;

        let remainingChar = questions
            .filter((d) => d.question == $question)
            .map((d) => d.answer.length)
            .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );
        $cartridge =
            datum.cartridge - remainingChar > 0
                ? datum.cartridge - remainingChar
                : 0;
    });
</script>

<article>
    {#if datum.question}
        <div style="color: {datum.color};" class="intro">
            <p>
                For each response submitted, you will receive a unique printed
                poster to take home.
            </p>

            <p>
                However, please note that once we reach the maximum number of
                total characters submitted, we will stop printing posters.
            </p>
            <p>
                To ensure everyone gets a chance to receive a poster, aim to
                write a balanced response. Avoid writing too little to prevent
                paper waste, and avoid writing too much to conserve ink and
                allow others to participate.
            </p>
        </div>
        <p>
            {$cartridge} characters left
        </p>
        <h1>{datum.question}</h1>

        <section>
            <div style="min-width:70vw">
                <SubmitText id={data._id} colour={datum.color} />
            </div>

            <!-- <div class="answers" style="min-width:20vw">
                <p class="title">Recent answers:</p>
                <div>
                    {#each posters as q, i}
                        {#each q.data.slice(0, 10) as a}
                            <p>{a.answer}</p>
                        {/each}
                    {/each}
                </div>
            </div>-->
            <div style="min-width:30vw">
                {#each posters as q, i}
                    <Poster {q} {i} questions={data} staticPoster={true}/>
                {/each}
            </div>
        </section>
    {/if}
</article>

<style>
    article {
        padding: 10px;
    }

    section {
        display: flex;
        gap: 20px;
        flex-wrap: nowrap;
        overflow: auto;
        margin-top: 20px;
    }

    .intro {
        margin-bottom: 2rem;
        max-width: 640px;
        font-size: 1rem;
    }
    
    .intro p {
        margin-bottom: 1rem;
    }
</style>
