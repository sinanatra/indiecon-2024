<script>
    import { onMount } from "svelte";

    export let questions;
    export let q;
    export let i;

    let noise3D;
    const density = "▀|/:÷×+-=?*· ";

    noise3D = function () {
        return 0;
    };

    function printPoster(question) {
        const posterContent = document.querySelector(
            `#poster-${question}`,
        ).innerHTML;
        document.body.innerHTML = posterContent;
        const button = document.querySelector("button");
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

    function getNoiseCharacter(x, y, t) {
        // const s = 0.03;
        // const noiseValue = noise3D(x * s, (y * s) / 1.5, t);
        // const i = Math.floor((noiseValue * 0.5 + 0.5) * density.length);

        const s = 0.06;
        const noiseValue = noise3D(x * s, (y * s) / 0.5, t);
        const i = Math.floor((noiseValue * 0.1 + 0.1) * density.length);
        // return density[i];

        return density[Math.min(Math.max(i, 0), density.length - 1)];
    }

    let combinedArray = [];
    let t = 0;

    function generateCombinedArray() {
        combinedArray = [
            ...q.data.map((d, idx) => ({
                type: "text",
                content: `${d.answer}・`,
                id: `text-${idx}-${d.answer}`,
            })),
            // here
            ...Array(loremChar)
                .fill()
                .map((_, idx) => ({
                    type: "empty",
                    content: "",
                    id: `empty-${idx}`,
                })),
        ];

        shuffleArray(combinedArray);

        combinedArray = combinedArray.map((item, index) => {
            if (item.type === "empty") {
                const x = index % 99;
                const y = Math.floor(index / 99);
                item.content = getNoiseCharacter(x, y, t);
            }
            return item;
        });
    }

    onMount(() => {
        // :)
        fetch(
            "https://raw.githubusercontent.com/blindman67/SimplexNoiseJS/master/simplexNoise.js",
        )
            .then((e) => e.text())
            .then((e) => {
                const openSimplexNoise = new Function("return " + e)();
                noise3D = openSimplexNoise(Date.now()).noise3D;
                generateCombinedArray();
            });
    });
</script>

<div id={`poster-${i}`}>
    <button on:click={() => printPoster(i)}>Print</button>
    <section class="poster">
        <p>{getCartridge(q.question)} characters for a collective poster.</p>
        <h1>{q.question}</h1>

        <div class="results">
            {#each combinedArray as item (item.id)}
                {#if item.type === "text"}
                    <span class="text">{item.content}</span>
                {:else}
                    <span class="empty">{item.content}</span>
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
        margin-top: 10px;
        word-break: break-all;
    }

    .empty {
        color: rgb(200, 200, 200);
        /* opacity: 0.4; */
    }

    button {
        position: relative;
        margin-bottom: 5px;
    }

    h1 {
        font-weight: bold;
    }
    
    @media print {
        @page {
            size: A4;
            margin: 0;
        }

        .poster {
            border: none;
        }

        h1 {
            font-size: 25px;
            line-height: 25px;
        }
    }
</style>
