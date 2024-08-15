<script>
    import { onMount } from "svelte";
    let questions = [];
    let selectedQuestionId = null;

    async function fetchQuestions() {
        const res = await fetch(`/api/question`);
        const json = await res.json();
        return json.reverse();
    }

    async function submitSelection() {
        if (!selectedQuestionId) {
            alert("Please select a question to mark as selected.");
            return;
        }

        const res = await fetch("/api/question", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: selectedQuestionId }),
        });

        if (res.ok) {
            alert("Question selected successfully.");
        } else {
            alert("Failed to select question.");
        }
    }

    onMount(async () => {
        questions = await fetchQuestions();
    });
</script>

<article class="container">
    {#if questions.length > 0}
        <h1>Select a Question to Ask</h1>
        <form on:submit|preventDefault={submitSelection} class="question-form">
            {#each questions as q}
                <div class="question-item">
                    <input
                        type="radio"
                        id={q._id}
                        name="selectedQuestion"
                        value={q._id}
                        bind:group={selectedQuestionId}
                    />
                    <label for={q._id} class="question-label"
                        >{q.question}</label
                    >
                </div>
            {/each}

            <button type="submit" class="submit-btn">Submit</button>
        </form>
    {:else}
        <p>Loading questions...</p>
    {/if}
</article>

<style>
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
    }

    .question-form {
        display: flex;
        flex-direction: column;
    }

    .question-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .question-label {
        margin-left: 10px;
        font-size: 18px;
        color: #333;
    }

    .submit-btn {
        margin-top: 20px;
        padding: 10px 15px;
        font-size: 16px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .submit-btn:hover {
        background-color: #0056b3;
    }

    p {
        text-align: center;
        font-size: 16px;
        color: #666;
    }
</style>
