<!-- <slot /> -->
<nav>
    <a href="/">Start</a> —
    <a href="/recent">Recent</a> —

    <a href="/posters">Posters</a> —

    <a href="/pattern">Generate Pattern</a> —

    <a href="/history">History</a>
</nav>
<nav>
    <a href="/question">Write a new question</a> -
    <a href="/ask">Select a question</a> -
</nav>

<slot />

<style>
    nav {
        display: flex;
        gap: 10px;
        background-color: rgb(254, 255, 231);
        padding: 10px;
        margin: 10px;
        border-radius: 3px;
        /* text-transform: uppercase; */
        /* position: sticky;
        top: 10px; */
        /* z-index: 10; */
    }

    a {
        color: black;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline dotted;
        text-underline-offset: 4px;
    }
</style>
