<script>
    import { onMount } from "svelte";
    let data = [];

    async function fetchData() {
        const res = await fetch(`/api/get`);
        const json = await res.json();
        return json.reverse();
    }

    onMount(async () => {
        data = await fetchData();
        data = data.reduce((acc, entry) => {
            const { question, answer, emotion } = entry;
            const groupIndex = acc.findIndex(
                (group) => group.question === question,
            );
            if (groupIndex === -1) {
                acc.push({ question, data: [{ answer, emotion }] });
            } else {
                acc[groupIndex].data.push({ answer, emotion });
            }
            return acc;
        }, []);
    });

    function printPoster(question) {
        const posterContent = document.querySelector(
            `#poster-${question}`,
        ).innerHTML;

        document.body.innerHTML = posterContent;
        const button = document.querySelector("button"); // Find the button inside the poster
        button.style.display = "none";

        window.print();
        location.reload();
    }
</script>

<article>
    <h1>These are the entries in the DB</h1>
    {#if data.length > 0}
        <article class="container">
            {#each data as q, i}
                <div id={`poster-${i}`}>
                    <button on:click={() => printPoster(i)}>Print</button>
                    <section class="poster">
                        <div class="grid">
                            {#each q.data.slice(0, 18) as d, index}
                                {#if index === 6}
                                    <div class="item">
                                        <h1>{q.question}</h1>
                                    </div>
                                {:else}
                                    <div class="item">
                                        <p class="answer">
                                            {d.answer}
                                        </p>
                                        <div class="emotion">
                                            <!-- {d.emotion} -->
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </section>
                </div>
            {/each}
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

    button {
        position: relative;
        margin-bottom: 5px;
    }

    .container {
        display: flex;
        flex-wrap: nowrap;
        overflow: auto;
        gap: 10px;
        margin-top: 40px;
    }

    .poster {
        border-radius: 3px;
        height: 1198px;
        width: 842px;
        flex: 0 0 842px;
        padding: 10px;
        white-space: wrap;
        background-color: #cbffcb;
    }

    .item:nth-child(1) {
        background: none;
    }

    .item:nth-child(1) p {
        font-size: 1rem;
        line-height: 1rem;
    }

    .item:nth-child(7) {
        /* aspect-ratio: 1 / 1.2; */
        background: none;
        font-size: 25px;
        line-height: 25px;
    }

    .grid {
        columns: 180px;
        gap: 5px;
        counter-reset: grid;
    }

    .item + .item {
        margin-top: 5px;
    }

    .item {
        break-inside: avoid;
        aspect-ratio: 2;
        background: ghostwhite;
        padding: 1rem;
        border-radius: 0.75rem;
    }

    .answer {
        display: -webkit-box;
        -webkit-line-clamp: 10;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .emotion {
        margin-top: 10px;
        background-color: rgba(0, 0, 0, 0.141);
        height: 80px;
        border-radius: 3px;
    }

    /* .item:nth-child(3n) {
        aspect-ratio: 2;
    }

    .item:nth-child(3n - 1) {
        aspect-ratio: 2 / 3;
    } */

    p {
        font-size: 12px;
    }

    @media print {
        @page {
            size: A4;
            margin: 0;
        }

        h1 {
            font-size: 25px;
            line-height: 25px;
        }
    }
</style>
