<script>
    import { onMount } from "svelte";
    let charleng = 116; // 105
    export let questions;
    export let q;
    export let i;
    export let submitted;
    export let staticPoster;

    let noiseCharArray = [];

    let noise3D;
    let gradient = "▚▀▒░#@/*+=-:·";
    gradient = "█▍▎▏▚▀▓▒░#@■□▪▫/*+=-:·";
    // gradient = "█▍▎▏▚▀▓▉▊▋▌▍▎▏■□▪▫#@&%$O0o+=~-^:,._`'·";
    // gradient = "█▍▎▏▚▀▓▒░#@■□▪▫/*+=-:·";
    const fixedChars = new Set(["░", "▓"]);

    let gradientOpacities = {};
    const minOpacity = 0.0;
    const maxOpacity = 1.0;
    const gradientLength = gradient.length;

    gradient.split("").forEach((char, index) => {
        gradientOpacities[char] =
            maxOpacity -
            (index * (maxOpacity - minOpacity)) / (gradientLength - 1);
    });

    noise3D = function () {
        return 0;
    };

    function copyPoster(question) {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = JSON.stringify(logArray);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    function getAscii(question) {
        const r = questions.find((d) => d.question == question);
        return r?.ascii;
    }

    function getCartridge(question) {
        const r = questions.find((d) => d.question == question);
        return r?.cartridge;
    }

    function getColor(question) {
        const r = questions.find((d) => d.question == question);
        return r?.color;
    }

    let fixedCharCount = 0;

    if (noiseCharArray.length > 0) {
        fixedCharCount = noiseCharArray.filter((char) =>
            fixedChars.has(char),
        ).length;
    }

    $: characters = q.data
        .map((d) => d.answer.trim().length + 1)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    $: loremChar =
        Number(getCartridge(q.question)) - characters - fixedCharCount > 0
            ? Number(getCartridge(q.question)) - characters - fixedCharCount
            : 0;

    let scale = Math.random() * (0.9 - 0.1) + 0.1;
    let s = Math.random() * (0.09 - 0.01) + 0.03;

    // scale = .5;
    // s = 0.07;

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
        scale =
            loremChar > getCartridge(q.question) / 2
                ? Math.random() * (0.9 - 0.1) + 0.2
                : Math.random() * (0.5 - 0.1) + 0.2;
        s =
            loremChar > getCartridge(q.question) / 2
                ? Math.random() * (0.09 - 0.01) + 0.05
                : Math.random() * (0.09 - 0.03) + 0.01;
        generateCombinedArray();
    }

    let logArray = [];

    function generateCombinedArray() {
        combinedArray = [
            ...q.data.map((d, idx) => ({
                type: "text",
                content: `${d.answer.trim()}`,
                id: `text-${idx}-${d.answer.trim()}`,
            })),
            ...Array(loremChar + fixedCharCount)
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

        let cumulativeLength = 0;
        let noiseIndex = 0;

        combinedArray = combinedArray.flatMap((item, index) => {
            if (item.type === "text") {
                const result = [];
                let textIndex = 0; // Reset textIndex for each new text item

                while (textIndex < item.content.length) {
                    const x = cumulativeLength % charleng;
                    const y = Math.floor(cumulativeLength / charleng);

                    const noiseChar =
                        noiseCharArray.length > 0
                            ? noiseCharArray[noiseIndex++]
                            : getNoiseCharacter(x, y, t);

                    if (!fixedChars.has(noiseChar)) {
                        result.push({
                            type: "char",
                            content: item.content[textIndex],
                            noiseChar: noiseChar,
                            opacity: gradientOpacities[noiseChar],
                            id: `char-${index}-${textIndex}-${item.id}`,
                        });
                        textIndex++;
                    } else {
                        result.push({
                            type: "empty",
                            content: noiseChar,
                            fixed: true,
                            opacity: gradientOpacities[noiseChar],
                            id: `fixed-${index}-${cumulativeLength}-${x}-${y}`,
                        });
                    }
                    logArray.push(noiseChar);
                    cumulativeLength++;
                }
                return result;
            } else {
                const x = cumulativeLength % charleng;
                const y = Math.floor(cumulativeLength / charleng);
                const noiseChar =
                    noiseCharArray.length > 0
                        ? noiseCharArray[noiseIndex++]
                        : getNoiseCharacter(x, y, t);

                const uniqueId = `empty-${index}-${cumulativeLength}-${x}-${y}`;
                item.content = noiseChar;
                item.fixed = fixedChars.has(noiseChar);
                item.opacity = gradientOpacities[noiseChar];
                item.id = uniqueId;

                logArray.push(noiseChar);
                cumulativeLength++;
                return [item];
            }
        });

        console.log(logArray);

        combinedArray.forEach((item, index) => {
            if (!item.id) {
                item.id = `item-${index}`;
            }
        });
    }

    onMount(() => {
        if (noiseCharArray.length === 0) {
            fetch("simplex.js")
                .then((e) => e.text())
                .then((e) => {
                    const openSimplexNoise = new Function("return " + e)();
                    noise3D = openSimplexNoise(Date.now()).noise3D;
                    generateCombinedArray();
                });
        } else {
            generateCombinedArray(); // If noiseCharArray is provided, just generate the combined array
        }
    });

    $: {
        if (!staticPoster && i) {
            reDraw();
        }
    }

    function mapValue(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }
</script>

<div id={`poster-${i}`}>
    {#if submitted}
        <button on:click={() => copyPoster(i)}>Copy</button>
    {/if}
    <section class="poster">
        <div class="results" style="--theme-color: {getColor(q.question)}">
            {#each combinedArray as item (item.id)}
                {#if item.content}
                    {#if item.type === "char"}
                        <span class="word" style="display:inline-block;">
                            <span
                                style="opacity: {item.opacity}; font-variation-settings: 'wght'{mapValue(
                                    item.opacity,
                                    minOpacity,
                                    maxOpacity,
                                    300,
                                    1000,
                                )};"
                                class="text">{item.noiseChar}</span
                            >
                        </span>
                    {:else}
                        <span
                            class="empty {item.fixed ? 'fixed' : ''}"
                            style="color: {item.fixed
                                ? getColor(q.question)
                                : ''};">{item.content}</span
                        >
                    {/if}
                {/if}
            {/each}
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
        white-space: wrap;
        font-size: 12px;
        line-height: 12px;
        font-family: "Recursive", monospace;
        word-break: break-all !important;
        user-select: none;
    }

    .results {
        align-items: center;
    }

    .metadata {
        margin-top: 20px;
        padding-top: 10px;
    }

    .fixed {
        /* visibility: hidden; */
    }

    .empty,
    .text {
        color: rgb(222, 222, 222);
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
        min-width: 1ch;
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

        .fixed {
            visibility: hidden;
        }
    }

    @font-face {
        font-family: "sono";
        src: url("fonts/sono.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
    }
</style>
