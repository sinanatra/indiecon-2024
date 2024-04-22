<nav>
    <a href="/">Start</a> -
    <a href="/latest">Latest Entries</a>-
    <a href="/archive">Posters Archive</a>
</nav>
<slot />

<style>
    nav {
        display: flex;
        gap: 10px;
        background-color: white;
        padding: 10px;
    }

    a {
        color: black;
        text-decoration: underline dotted;
        text-underline-offset: 3px;
    }
</style>
