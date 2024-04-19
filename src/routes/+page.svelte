<script>
    import { onMount } from "svelte";
    let data = [];

    async function fetchData() {
        const res = await fetch(`/api/get`);
        const json = await res.json();

        return json;
    }

    onMount(async () => {
        data = await fetchData();
    });
</script>

<article>
    <h1>This is the setup</h1>
    {#if data.length > 0}
        {#each data as d}
            <p>
                {d._id}
            </p>
        {/each}
    {:else}
        <p>Loading...</p>
    {/if}
</article>

<style>
    article {
        padding: 10px;
    }
</style>
