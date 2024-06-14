<script>
    import { onMount } from "svelte";

    export let questions;
    export let q;
    export let i;
    export let submitted;

    let noise3D;
    // const gradient = "█▓▒░|/:÷×+-=?*·";
    const gradient = "▚▀▒░|/=?*·";
    // const gradient = "▅▄▃▂▁";

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

    function getColor(question) {
        const r = questions.find((d) => d.question == question);
        return r?.color;
    }

    const characters = q.data
        .map((d) => d.answer.length + 1)
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

    const scale = Math.random() * (0.5 - 0.1) + 0.1;
    const s = Math.random() * (0.09 - 0.01) + 0.01;

    function getNoiseCharacter(x, y, t) {
        const noiseValue = noise3D(x * s, (y * s) / 0.5, t);
        const i = Math.floor((noiseValue * scale + scale) * gradient.length);
        return gradient[Math.min(Math.max(i, 0), gradient.length - 1)];
    }

    let combinedArray = [];
    let t = 0;

    function generateCombinedArray() {
        combinedArray = [
            ...q.data.map((d, idx) => ({
                type: "text",
                content: `${d.answer}`,
                id: `text-${idx}-${d.answer}`,
            })),
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
                const x = index % 107;
                const y = Math.floor(index / 107);
                item.content = getNoiseCharacter(x, y, t);
            }
            return item;
        });
    }

    onMount(() => {
        fetch("simplex.js")
            .then((e) => e.text())
            .then((e) => {
                const openSimplexNoise = new Function("return " + e)();
                noise3D = openSimplexNoise(Date.now()).noise3D;
                generateCombinedArray();
            });
    });
</script>

<div id={`poster-${i}`}>
    {#if submitted}
        <button on:click={() => printPoster(i)}>Print</button>
    {/if}
    <section class="poster">
        <p>{getCartridge(q.question)} characters for a collective poster.</p>
        <p class="head">{q.question}</p>

        <div class="results" style="--theme-color: {getColor(q.question)}">
            {#each combinedArray as item (item.id)}
                {#if item.type === "text"}
                    <span class="text">{item.content}</span>
                {:else}
                    <span class="empty" style="color:{getColor(q.question)}"
                        >{item.content}</span
                    >
                {/if}
            {/each}
        </div>
        <div class="metadata">
            <p>{q.data.length} participations.</p>
            <p>{characters} characters used.</p>
            <p>{loremChar} characters left.</p>
        </div>
        <div class="metadata">
            <p>Froh!</p>
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
        font-size: 13px;
        line-height: 13px;
        font-family: monospace;
    }

    .results {
        margin-top: 10px;
        word-break: break-all;
        align-items: center;
    }

    .metadata {
        margin-top: 20px;
        padding-top: 10px;
    }

    .text {
        color: rgb(31, 31, 31);
        /* color: var(--theme-color); */
        /* opacity: 0.5; */
    }

    .text:after {
        content: "·";
        color: var(--theme-color);
    }
    .empty {
        color: rgb(200, 200, 200);
        user-select: none;
    }

    button {
        position: relative;
        margin-bottom: 20px;
    }

    .head {
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
    }
</style>
