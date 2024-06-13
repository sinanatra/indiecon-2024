<script>
    import SubmitText from "../components/submitText.svelte";
    import { onMount } from "svelte";
    import { question } from "$lib/stores/question.js";
    import { cartridge } from "$lib/stores/cartridge.js";

    let data = [];
    let questions = [];

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
        data = data[0];
        $question = data.question;

        let remainingChar = questions
            .filter((d) => d.question == $question)
            .map((d) => d.answer.length)
            .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );
        $cartridge =
            data.cartridge - remainingChar > 0
                ? data.cartridge - remainingChar
                : 0;
    });
</script>

<article>
    {#if data.question}
        <div>
            {$cartridge} characters left
            <h1>{data.question}</h1>
            <SubmitText
                tags={data?.tags ? data.tags.sort() : ["happy", "okay", "sad"]}
                id={data._id}
            />
        </div>
    {/if}
</article>

<style>
    article {
        padding: 10px;
    }

    div {
        max-width: 680px;
    }
</style>
