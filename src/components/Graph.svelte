<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";

    export let q;

    let svgElement;
    let width;
    let height;

    onMount(() => {
        const data = q.data;

        // Extract all tags with their connections
        const links = [];
        const tags = new Set();

        data.forEach((item) => {
            item.tags.forEach((tag, index) => {
                tags.add(tag);
                for (let i = index + 1; i < item.tags.length; i++) {
                    links.push({ source: tag, target: item.tags[i] });
                }
            });
        });

        const nodes = Array.from(tags).map((tag) => ({ id: tag }));

        const simulation = d3
            .forceSimulation(nodes)
            .force(
                "link",
                d3
                    .forceLink(links)
                    .id((d) => d.id)
                    .distance(600),
            )
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const svg = d3
            .select(svgElement)
            .attr("viewBox", [0, 0, width, height]);

        const link = svg
            .append("g")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.6)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("stroke-width", 1)
            .attr("fill", "none");

        const node = svg
            .append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text((d) => d.id)
            .style("fill", "#000")
            .style("font-size", "24px")
            .style("text-anchor", "middle")
            .style("cursor", "pointer")
            .call(drag(simulation));

        node.append("title").text((d) => d.id);

        // Drag functionality
        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        simulation.on("tick", () => {
            link.attr("d", function (d) {
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dr = Math.sqrt(dx * dx + dy * dy);
                return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
            });

            node.attr("x", (d) => d.x).attr("y", (d) => d.y);
        });
    });
</script>

<header>
    <h1>{q.question}</h1>
</header>
<section bind:clientWidth={width} bind:clientHeight={height}>
    <svg bind:this={svgElement}></svg>
</section>

<style>
    header {
        height: 25px;
    }
    section {
        width: 100%;
        height: calc(100% - 25px);
        /* min-height: 1000px; */
        /* min-width: 800px; */
    }
</style>
