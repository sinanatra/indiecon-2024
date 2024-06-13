<script>
    import { onMount } from "svelte";

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

    function getCartridge(question) {
        const r = questions.find((d) => d.question == question);
        return r?.cartridge;
    }

    const characters = q.data
        .map((d) => d.answer.length + 1) // Include the ". " after each answer
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const loremChar =
        Number(getCartridge(q.question)) - characters > 0
            ? Number(getCartridge(q.question)) - characters
            : 0;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let combinedArray = [];

    onMount(() => {
        combinedArray = [
            ...q.data.map((d) => ({ type: "text", content: `${d.answer}・` })),
            ...Array(loremChar).fill({ type: "empty", content: "" }),
        ];

        shuffleArray(combinedArray);
    });
</script>

<div id={`poster-${i}`}>
    <button on:click={() => printPoster(i)}>Print</button>
    <section class="poster">
        <p>{getCartridge(q.question)} characters for a collective poster.</p>
        <h1>{q.question}</h1>

        <div class="results">
            {#each combinedArray as item}
                {#if item.type === "text"}
                    <span class="text">{item.content}</span>
                {:else}
                    <span class="empty"></span>
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
        border: 1px dashed;
        margin-bottom: 10px;
        font-size: 14px;
        line-height: 14px;
        font-family: monospace;
    }
    .results {
        margin-top: 20px;
        word-break: break-all;
    }

    .results span:first-of-type::before {
        content: "";
        padding-right: 0;
    }

    .empty::before {
        content: "+";
        opacity: 0.2;
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
