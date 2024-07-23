<script>
    import { onMount } from "svelte";

    export let questions;
    export let q;
    export let i;
    export let submitted;

    let noise3D;
    let gradient = "▚▀▒░#@/*+=-:·";
    // gradient = "█▉▊▋▌▍▎▏";
    // gradient = "█▊▋▌▓▒░▍▎▏";
    gradient = "█▍▎▏▚▀▓▒░#@/*+=-:·";

    let gradientOpacities = {};
    const minOpacity = 0.1;
    const maxOpacity = 0.9;
    const gradientLength = gradient.length;
    gradient.split("").reverse().forEach((char, index) => {
        gradientOpacities[char] =
            maxOpacity -
            (index * (maxOpacity - minOpacity)) / (gradientLength - 1);
    });

    noise3D = function () {
        return 0;
    };

    function printPoster(question) {
        const posterContent = document.querySelector(
            `#poster-${question}`,
        ).innerHTML;
        document.body.innerHTML = posterContent;
        const buttons = document.querySelectorAll("button");
        buttons.forEach((button) => {
            button.style.display = "none";
        });

        window.print();
        location.assign("/");
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
        .map((d) => d.answer.trim().length + 1)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const loremChar =
        Number(getCartridge(q.question)) - characters > 0
            ? Number(getCartridge(q.question)) - characters
            : 0;

    let scale = Math.random() * (0.5 - 0.1) + 0.1;
    let s = Math.random() * (0.09 - 0.03) + 0.01;

    function getNoiseCharacter(x, y, t) {
        const noiseValue = noise3D(x * s, (y * s) / 0.5, t);
        const i = Math.floor((noiseValue * scale + scale) * gradient.length);
        return gradient[Math.min(Math.max(i, 0), gradient.length - 1)];
    }

    let combinedArray = [];
    let t = 0;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let change = false;
    function changeLayout() {
        change = !change;
        generateCombinedArray();
    }

    function reDraw() {
        scale = Math.random() * (0.5 - 0.1) + 0.1;
        s = Math.random() * (0.09 - 0.03) + 0.01;
        generateCombinedArray();
    }

    function generateCombinedArray() {
        combinedArray = [
            ...q.data.map((d, idx) => ({
                type: "text",
                content: `${d.answer.trim()}`,
                id: `text-${idx}-${d.answer.trim()}`,
            })),
            ...Array(loremChar)
                .fill()
                .map((_, idx) => ({
                    type: "empty",
                    content: "",
                    id: `empty-${idx}`,
                })),
        ];

        if (!change) {
            shuffleArray(combinedArray);
        }

        combinedArray = combinedArray.flatMap((item, index) => {
            if (item.type === "text") {
                return item.content.split("").map((char, charIdx) => {
                    const x = (index + charIdx) % 105;
                    const y = Math.floor((index + charIdx) / 105);
                    const noiseChar = getNoiseCharacter(x, y, t);
                    return {
                        type: "char",
                        content: char,
                        noiseChar: noiseChar,
                        opacity: gradientOpacities[noiseChar],
                        id: `char-${index}-${charIdx}`,
                    };
                });
            } else {
                const x = index % 105;
                const y = Math.floor(index / 105);
                item.content = getNoiseCharacter(x, y, t);
                item.opacity = gradientOpacities[item.content];
                return [item];
            }
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
        <button on:click={() => reDraw()}>Change Pattern</button>
        <button on:click={() => changeLayout()}
            >{change ? "Shuffle Text" : "Sort text"}</button
        >
    {/if}
    <section class="poster">
        <p>{getCartridge(q.question)} characters for a collective poster.</p>
        <p class="head">{q.question}</p>

        <div class="results" style="--theme-color: {getColor(q.question)}">
            {#each combinedArray as item (item.id)}
                {#if item.type === "char"}
                    <span class="word" style="display:inline-block;">
                        <span class="text noise">{item.noiseChar}</span>
                        <span
                            style="font-variation-settings: 'wght'{item.opacity *
                                1000};"
                            class="text">{item.content}</span
                        >
                    </span>
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
        height: 1198px; /* a4 */
        width: 842px; /* a4 */
        height: 1684px; /* longer */
        flex: 0 0 842px;
        padding: 10px;
        white-space: wrap;
        border: 1px dashed;
        margin-bottom: 10px;
        font-size: 13px;
        line-height: 13px;
        font-family: "sono", monospace;
        word-break: break-all !important;
        user-select: none;
    }

    .results {
        margin-top: 10px;
        align-items: center;
    }

    .metadata {
        margin-top: 20px;
        padding-top: 10px;
    }

    .text {
        color: #252525;
    }

    .noise {
        opacity: .3;
        color: var(--theme-color);
        /* color: #9f9f9f; */
    }

    /* .text:after {
        content: "▚";
        content: "░";
        content: "*";
        color: var(--theme-color);
    } */

    .empty {
        color: rgb(200, 200, 200);
    }

    button {
        position: relative;
        margin-bottom: 20px;
        cursor: pointer;
    }

    .head {
        font-weight: bold;
    }

    .word {
        display: inline;
        min-width: 1ch;
        position: relative;
        mix-blend-mode: multiply;
    }

    .word > * {
        position: absolute;
        top: -1.3ch;
    }

    @media print {
        @page {
            size: A4;
            size: 8.77in 17.54in;
            margin: 0;
        }

        .poster {
            border: none;
        }
    }

    @font-face {
        font-family: "sono";
        src: url("./fonts/sono.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
    }
</style>
