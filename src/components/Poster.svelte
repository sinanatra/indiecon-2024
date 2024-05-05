<script>
    export let questions;
    export let q;
    export let i;

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

    function getColor(question) {
        const r = questions.find((d) => d.question == question);
        return r.color;
    }
</script>

<div id={`poster-${i}`}>
    <button on:click={() => printPoster(i)}>Print</button>
    <section
        class="poster"
        style="background-color: {getColor(q.question) || '#cbffcb'};"
    >
        <div class="grid">
            {#each q.data as d, index}
                {#if index === 6}
                    <div class="item">
                        <h1>{q.question}</h1>
                    </div>
                {:else}
                    <div class="item">
                        <p class="answer">
                            {d.answer}
                        </p>
                        <div class="tags">
                            {#if d.tags}
                                {#each d.tags as tag}
                                    <p>{tag}</p>
                                {/each}
                            {/if}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </section>
</div>

<style>
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

    .tags {
        margin-top: 10px;
        border-radius: 3px;
    }

    button {
        position: relative;
        margin-bottom: 5px;
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
