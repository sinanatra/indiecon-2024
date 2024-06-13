<script>
    import SubmitText from "../components/submitText.svelte";
    import { onMount } from "svelte";
    import { question } from "$lib/stores/question.js";
    import { cartridge } from "$lib/stores/cartridge.js";

    let data = [];
    let tags = [];
    async function fetchData() {
        const res = await fetch(`/api/question`);
        const json = await res.json();
        return json.reverse();
    }

    onMount(async () => {
        data = await fetchData();
        data = data[0];
        $question = data.question;
        // $cartridge = data.cartridge;
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
        background-color: rgb(225, 255, 253);
        /* width: 100vw; */
        height: 100vh;
    }

    div {
        max-width: 680px;
    }
</style>
