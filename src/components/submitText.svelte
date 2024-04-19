<script>
    let text = "";
    let emotion = "";

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
        } else {
            console.error("Error submitting data");
        }
    };
</script>

<section>
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
</section>
