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
                const { question, answer, tags } = entry;
                const lastCluster = acc[acc.length - 1];

                if (!lastCluster || lastCluster.question !== question) {
                    acc.push({ question, data: [{ answer, tags }] });
                } else {
                    lastCluster.data.push({ answer, tags });
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

        console.log(posters);
    });
</script>

<article>
    {#if datum.question}
        {$cartridge} characters left
        <h1>{datum.question}</h1>
        <section>
            <div>
                <SubmitText
                    tags={data?.tags
                        ? data.tags.sort()
                        : ["happy", "okay", "sad"]}
                    id={data._id}
                />
            </div>
            <div>
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
    }

    div {
        min-width: 30vw;
    }
</style>
