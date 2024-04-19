<script>
    let text = "";
    let emotion = "";
    let message = "";

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert("Text field cannot be empty");
            return;
        }
        if (emotion < 1 || emotion > 5) {
            alert("Emotion must be between 1 and 5");
            return;
        }

        const response = await fetch("/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer: text, emotion: parseInt(emotion) }),
        });

        if (response.ok) {
            console.log("Data submitted successfully");
            message = "Data submitted successfully";
        } else {
            console.error("Error submitting data");
        }
    };
</script>

<section>
    {#if message}
        <div class="message">
            <p>{message}</p>
            <a href="/" target="_self">Please Refresh the page</a>
        </div>
    {:else}
        <textarea name="answer" id="answer" bind:value={text}></textarea>
        <input
            type="number"
            name="emotion"
            id="emotion"
            bind:value={emotion}
            min="1"
            max="5"
        />
        <button on:click={handleSubmit}>Submit</button>
    {/if}
</section>

<style>
    .message {
        background-color: yellow;
        padding: 10px;
        border-radius: 3px;
    }
</style>
