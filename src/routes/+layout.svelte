<nav>
    <a href="/">Start</a> —
    <a href="/recent">Recent</a> —
    <a href="/posters">Posters</a> —
    <a href="/history">History</a> 
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
        text-transform: uppercase;
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
