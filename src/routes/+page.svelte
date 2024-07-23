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
        {$cartridge} characters left
        <h1>{datum.question}</h1>
        <section>
            <div style="min-width:70vw">
                <SubmitText id={data._id} colour={datum.color}/>
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
                    <Poster {q} {i} questions={data} />
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

    .answers {
        border: 1px dashed;
        padding: 10px;
        height: fit-content;
        background-color: rgb(248, 248, 248);
    }

    .answers div {
        counter-reset: answ;
    }

    .answers div p {
        margin-bottom: 8px;
        counter-increment: answ;
    }

    .answers div p::before {
        content: counter(answ) ". ";
    }

    .title {
        font-weight: bold;
        margin-bottom: 10px;
    }
</style>
