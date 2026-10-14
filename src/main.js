let currentLang = 'ar';

function toggleLanguage() {
    const htmlTag = document.getElementById('htmlTag');
    const langBtn = document.getElementById('langBtn');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const disclaimer = document.getElementById('disclaimerText');
    const welcomeMsg = document.getElementById('welcomeMsg');

    if (currentLang === 'ar') {
        currentLang = 'en';
        htmlTag.dir = 'ltr';
        htmlTag.lang = 'en';
        langBtn.innerText = 'عربي';
        userInput.placeholder = 'Type your medical question...';
        sendBtn.innerText = 'Send';
        disclaimer.innerText = 'Disclaimer: For awareness only. Consult a doctor for medical advice.';
        if(welcomeMsg) welcomeMsg.innerText = 'Hello! I am your AI medical assistant. How can I help you today?';
    } else {
        currentLang = 'ar';
        htmlTag.dir = 'rtl';
        htmlTag.lang = 'ar';
        langBtn.innerText = 'English';
        userInput.placeholder = 'اكتب سؤالك الطبي هنا...';
        sendBtn.innerText = 'إرسال';
        disclaimer.innerText = 'تنبيه: هذا التطبيق للتوعية فقط ولا يغني عن استشارة الطبيب المختص.';
        if(welcomeMsg) welcomeMsg.innerText = 'أهلاً بك! أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك في استفساراتك الصحية اليوم؟';
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const inputField = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const userText = inputField.value.trim();

    if (userText === "") return;

    // Append User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-msg';
    userDiv.innerText = userText;
    chatBox.appendChild(userDiv);
    
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // AI Response Logic
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot-msg';
        
        let response = "";
        const lower = userText.toLowerCase();

        if (currentLang === 'ar') {
            if (lower.includes("صداع") || lower.includes("رأس")) response = "بالنسبة للصداع، يُنصح بالراحة في مكان هادئ وشرب الماء. إذا استمر الصداع، يرجى مراجعة الطبيب.";
            else if (lower.includes("حرارة") || lower.includes("سخونة") || lower.includes("حمى")) response = "ارتفاع الحرارة قد يشير لعدوى. يُنصح بالراحة وشرب السوائل واستشارة الطبيب إن استمر الارتفاع.";
            else if (lower.includes("مرحبا") || lower.includes("سلام")) response = "أهلاً بك! أنا جاهز للمساعدة في أي استفسار صحي.";
            else response = `شكراً لتواصلك. بالنسبة لـ "${userText}"، ننصح دائماً بمراجعة طبيب أخصائي لتشخيص حالتك بدقة.`;
        } else {
            if (lower.includes("headache")) response = "For headaches, rest in a quiet room and stay hydrated. Consult a doctor if it persists.";
            else if (lower.includes("fever") || lower.includes("temp")) response = "Fever may indicate an infection. Rest, stay hydrated, and consult a physician if it continues.";
            else if (lower.includes("hello") || lower.includes("hi")) response = "Hello! I am here to assist you with your health inquiries.";
            else response = `Thank you for reaching out. Regarding "${userText}", please consult a certified healthcare professional for an accurate diagnosis.`;
        }

        botDiv.innerText = response;
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
}
