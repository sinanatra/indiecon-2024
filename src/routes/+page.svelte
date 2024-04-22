<script>
    import SubmitText from "../components/submitText.svelte";
    import { onMount } from "svelte";

    let data = [];

    async function fetchData() {
        const res = await fetch(`/api/question`);
        const json = await res.json();
        return json.reverse();
    }

    onMount(async () => {
        data = await fetchData();
        data = data[0].question;
    });
</script>

<article>
    <h1>{data}</h1>
    <SubmitText />
</article>

<style>
    article {
        padding: 10px;
    }

    h1 {
        font-size: 6vw;
        line-height: 6vw;
        max-width: 1200px;
    }
</style>
