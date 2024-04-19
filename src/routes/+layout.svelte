<nav>
    <a href="/">Start</a> - 
    <a href="/entries">Entries in the Database</a> - 
    <a href="/print">Print</a>
</nav>
<slot />

<style>
    nav {
        display: flex;
        gap: 10px;
        background-color: white;
        margin-bottom: 10px;
        padding: 10px;
    }

    a  {
        color: black;text-decoration: underline dotted;
        text-underline-offset: 3px;
    }
</style>
