<script>
    import SubmitText from "../components/submitText.svelte";
    import { onMount } from "svelte";
    import { question } from "$lib/stores/question.js";
    import { cartridge } from "$lib/stores/cartridge.js";
    import PatternPoster from "@components/PatternPoster.svelte";
    let data = [];
    let questions = [];
    let posters = [];
    let datum = "";
    const day = 0;

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

    function getAscii(question) {
        const r = data.find((d) => d.question == question);
        return r?.ascii;
    }

    onMount(async () => {
        questions = await fetchAll();
        data = await fetchData();

        posters = questions
            .filter(
                (d) =>
                    d.question == data.find((d) => d.selected == true).question,
            )
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

        datum = data.find((d) => d.selected == true);
        $question = datum.question;

        let noiseCharArray = [];

        try {
            const ascii = getAscii($question);

            if (ascii) {
                noiseCharArray = JSON.parse(ascii);
            } else {
                noiseCharArray = [];
            }
        } catch (error) {
            noiseCharArray = [];
        }

        let remainingChar = questions
            .filter((d) => d.question == $question)
            .map((d) => d.answer.length)
            .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );

        let fixedCharCount = 0;

        const fixedChars = new Set(["▚", "░"]);

        if (noiseCharArray.length > 0) {
            fixedCharCount = noiseCharArray.filter((char) =>
                fixedChars.has(char),
            ).length;
        }

        $cartridge =
            datum.cartridge - remainingChar - fixedCharCount > 0
                ? datum.cartridge - remainingChar - fixedCharCount
                : 0;
    });
</script>

<article>
    {#if datum.question}
        <div class="left">
            <div class="intro">
                <p>
                    For each response submitted, you will receive a unique
                    printed poster to take home.
                    <br />
                    However, please note that once we reach the maximum number of
                    total characters submitted, <br />we will stop printing
                    posters.
                </p>
                <p>
                    To ensure everyone gets a chance to receive a poster, aim to
                    write a balanced response. <br />Avoid writing too little to
                    prevent paper waste, and avoid writing too much to conserve
                    ink and allow others to participate.
                </p>
            </div>
            <div class="question">
                <p style="color: {datum.color};">
                    {$cartridge} characters left
                </p>
                <h1>{datum.question}</h1>
            </div>
            <div class="editor">
                <SubmitText id={data._id} colour={datum.color} />
            </div>
        </div>

        <section class="right">
            <div class="answers">
                <p class="recent">Recent answers:</p>
                <div class="ans">
                    {#each posters as q, i}
                        {#each q.data.slice(0, 5) as a}
                            <p>{a.answer}</p>
                        {/each}
                    {/each}
                </div>
            </div>

            <div class="poster">
                {#each posters as q, i}
                    <PatternPoster
                        {q}
                        {i}
                        questions={data}
                        staticPoster={true}
                    />
                {/each}
            </div>
        </section>
    {/if}
</article>

<style>
    article {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .left,
    .right {
        flex: 1;
        width: calc(50vw - 100px);
        padding: 10px;
        font-size: 12px;
    }

    .right {
        background-color: rgb(255, 255, 241);
    }

    .poster {
        overflow: hidden;
    }

    .intro {
        color: rgb(121, 121, 121);
        height: fit-content;
        display: flex;
        justify-items: stretch;
        /* justify-content: space-between; */
        gap: 10px;
    }

    .intro > * {
        flex: 1;
    }

    .recent {
        padding-bottom: 10px;
    }

    .question {
        padding: 20px 0 40px 0;
    }

    .answers {
        color: rgb(121, 121, 121);
        padding-bottom: 40px;
    }

    .ans p {
        counter-increment: ans;
    }

    .ans p::before {
        content: counter(ans, upper-alpha) "";
        padding-right: 5px;
    }

    h1 {
        font-family: Helvetica, sans-serif;
        font-size: 32px;
        line-height: 36px;
        max-width: 700px;
        break-inside: avoid;
        margin-bottom: 10px;
        display: block;
        word-break: break-word !important;
        height: 100px;
    }

    .intro p {
        margin-bottom: 1rem;
    }
</style>
