// MediGuard AI - Core Logic
function sendMessage() {
    const inputField = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const userText = inputField.value.trim();

    if (userText === "") return;

    // Display User Message
    chatBox.innerHTML += `<p><strong>You:</strong> ${userText}</p>`;
    inputField.value = "";

    // Simulate AI Medical Response
    setTimeout(() => {
        chatBox.innerHTML += `<p><strong>MediGuard AI:</strong> Thank you for your inquiry. As an AI medical assistant, I recommend consulting a certified healthcare professional for a precise diagnosis regarding "${userText}".</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}
