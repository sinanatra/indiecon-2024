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
    <h1>These are the entries in the DB</h1>
    {#if data.length > 0}
        <article class="container">
            {#each data as d}
                <section>
                    <p>
                        {d._id}
                    </p>
                    <h2>
                        {d.answer}
                    </h2>
                    <h1>
                        {d.emotion}
                    </h1>
                </section>
            {/each}
        </article>
    {:else}
        <p>Loading...</p>
    {/if}
</article>

<style>
    article {
        padding: 10px;
    }

    .container {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    section {
        min-height: 150px;
        max-width: 250px;
        border-radius: 3px;
        background-color: white;
        padding: 10px;
    }

    p {
        font-size: 12px;
    }
</style>
