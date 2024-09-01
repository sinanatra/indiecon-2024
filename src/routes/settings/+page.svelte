<nav>
    <a href="/">Start</a> —
    <a href="/recent">Recent</a> —

    <a href="/posters">Posters</a> —

    <a href="/pattern">Generate Pattern</a> —

    <a href="/history">History</a>
</nav>
<nav>
    <a href="/question">Write a new question</a> —
    <a href="/ask">Select a question</a> —
</nav>

<slot />

<style>
    nav {
        font-family:
            Arial Narrow,
            Helvetica,
            sans-serif;
        display: flex;
        gap: 10px;
        background-color: rgb(254, 255, 231);
        padding: 10px;
        margin: 10px;
        border-radius: 3px;
        font-size: 3vw;
        line-height: 1.2em;
        color: black;
    }

    a {
        color: black;
        text-decoration: none;
    }
</style>
