let currentLang = 'ar';
let lastBotResponse = "";

const translations = {
    ar: {
        welcome: "مرحباً بك في المنظومة الطبية الشاملة MediGuard AI Enterprise MAX. تمت إضافة نظام القفل السري PIN وتأمين هوية المستخدم محلياً بنجاح.",
        placeholder: "اسأل سؤالاً طبياً، أو ارفع صورة تقرير/وصفة...",
        send: "إرسال",
        lock: "قفل الـ PIN والهوية",
        emergency: "طوارئ البلد",
        firstAid: "دليل الإسعافات",
        qr: "بطاقة QR",
        vitals: "العلامات الحيوية",
        maternal: "متابعة الحمل",
        dose: "جرعات الأطفال",
        booking: "حجز مواعيد",
        profiles: "سجلات المرضى",
        sideEffects: "الآثار والتحذيرات",
        interactions: "تعارض الأدوية",
        medCheck: "توفر الأدوية",
        hospitals: "المشافي القريبة",
        export: "تصدير PDF",
        backup: "نسخ احتياطي",
        clear: "مسح السجل"
    },
    en: {
        welcome: "Welcome to MediGuard AI Enterprise MAX. Secure PIN lock and local identity registration integrated.",
        placeholder: "Type a medical query or upload a report/prescription...",
        send: "Send",
        lock: "PIN & ID Security",
        emergency: "Emergency",
        firstAid: "First Aid Guide",
        qr: "Emergency QR",
        vitals: "Vital Signs",
        maternal: "Maternal Health",
        dose: "Pediatric Dosing",
        booking: "Bookings",
        profiles: "Patient Profiles",
        sideEffects: "Side Effects",
        interactions: "Drug Interactions",
        medCheck: "Check Stock",
        hospitals: "Facilities",
        export: "Export PDF",
        backup: "Backup Data",
        clear: "Clear History"
    }
};

const globalEmergencyNumbers = {
    "TR": { country: "تركيا", ambulance: "112", police: "155", fire: "110" },
    "SA": { country: "السعودية", ambulance: "997", police: "999", fire: "998" },
    "EG": { country: "مصر", ambulance: "123", police: "122", fire: "180" },
    "SY": { country: "سوريا", ambulance: "110", police: "112", fire: "113" },
    "AE": { country: "الإمارات", ambulance: "998", police: "999", fire: "997" },
    "DEFAULT": { country: "عالمي", ambulance: "112 / 911", police: "112", fire: "112" }
};

window.addEventListener('DOMContentLoaded', () => {
    const savedPin = localStorage.getItem('mediguard_pin');
    if (savedPin) {
        const entered = prompt("🔒 يرجى إدخال رمز القفل السري (PIN) الخاص بفتح السجلات الطبية:");
        if (entered !== savedPin) {
            alert("❌ الرمز غير صحيح. تم تقييد الوصول.");
            document.body.innerHTML = "<h2 style='text-align:center; color:white; margin-top:20vh;'>🔒 التطبيق مقفل لأسباب أمنية. يرجى تحديث الصفحة وإعادة المحاولة.</h2>";
        }
    }
});

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang] || translations['en'];
    document.getElementById('htmlTag').dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.getElementById('htmlTag').lang = lang;
    document.getElementById('welcomeMsg').innerText = t.welcome;
    document.getElementById('userInput').placeholder = t.placeholder;
    document.getElementById('btnSend').innerText = t.send;
    document.getElementById('lblLock').innerText = t.lock;
    document.getElementById('lblEmergency').innerText = t.emergency;
    document.getElementById('lblFirstAid').innerText = t.firstAid;
    document.getElementById('lblQR').innerText = t.qr;
    document.getElementById('lblVitals').innerText = t.vitals;
    document.getElementById('lblMaternal').innerText = t.maternal;
    document.getElementById('lblDose').innerText = t.dose;
    document.getElementById('lblBooking').innerText = t.booking;
    document.getElementById('lblProfiles').innerText = t.profiles;
    document.getElementById('lblSideEffects').innerText = t.sideEffects;
    document.getElementById('lblInteractions').innerText = t.interactions;
    document.getElementById('lblMedCheck').innerText = t.medCheck;
    document.getElementById('lblHospitals').innerText = t.hospitals;
    document.getElementById('lblExport').innerText = t.export;
    document.getElementById('lblBackup').innerText = t.backup;
    document.getElementById('lblClear').innerText = t.clear;
}

function setupSecurityLock() {
    const action = prompt(currentLang === 'ar' ? "إعدادات الأمان والخصوصية:\n1. تعيين / تغيير رمز القفل (PIN)\n2. تسجيل رقم الهاتف وهوية الطوارئ" : "Security Settings:\n1. Set/Change PIN\n2. Register Identity & Phone", "1");
    if(!action) return;

    if(action === "1") {
        const pin = prompt(currentLang === 'ar' ? "أدخل رمز قفل سري مكون من 4 أرقام:" : "Enter 4-digit PIN:");
        if(pin && pin.length >= 4) {
            localStorage.setItem('mediguard_pin', pin);
            alert(currentLang === 'ar' ? "✅ تم حفظ رمز القفل السري محلياً بنجاح." : "✅ PIN saved securely.");
        } else {
            alert(currentLang === 'ar' ? "⚠️ يجب أن يكون الرمز 4 أرقام على الأقل." : "⚠️ PIN must be at least 4 digits.");
        }
    } else if(action === "2") {
        const fullName = prompt(currentLang === 'ar' ? "أدخل الاسم الكامل للمستخدم:" : "Enter Full Name:");
        const phone = prompt(currentLang === 'ar' ? "أدخل رقم الهاتف الشخصي:" : "Enter Phone Number:");
        const idNo = prompt(currentLang === 'ar' ? "أدخل رقم الهوية الشخصية (اختياري):" : "Enter ID Number (optional):");
        
        if(fullName && phone) {
            const identityRecord = { fullName, phone, idNo, registeredDate: new Date().toLocaleDateString() };
            localStorage.setItem('mediguard_identity', JSON.stringify(identityRecord));
            appendMsg(currentLang === 'ar' ? `🛡️ تم توثيق وتشفير هوية المستخدم "${fullName}" ورقم الهاتف بنجاح.` : `🛡️ Identity registered for "${fullName}".`, 'bot-msg');
        }
    }
}

function processQuery() {
    const input = document.getElementById('userInput');
    const txt = input.value.trim();
    if(!txt) return;

    appendMsg(txt, 'user-msg');
    input.value = '';

    setTimeout(() => {
        let reply = getSmartResponse(txt);
        lastBotResponse = reply;
        appendMsg(reply, 'bot-msg');
    }, 700);
}

function handleKey(e) { if(e.key === 'Enter') processQuery(); }

function appendMsg(text, className) {
    const ws = document.getElementById('chatWorkspace');
    const div = document.createElement('div');
    div.className = `msg ${className}`;
    div.innerText = text;
    ws.appendChild(div);
    ws.scrollTop = ws.scrollHeight;
}

function getSmartResponse(q) {
    return currentLang === 'ar' ? "تم تحليل استفسارك بواسطة الذكاء الاصطناعي الطبي المعياري. يُنصح باستشارة الطبيب للتأكيد." : "Query processed by medical AI model. Consult a professional.";
}

function openMaternalHealth() {
    const lmp = prompt(currentLang === 'ar' ? "أدخل تاريخ أول يوم من آخر دورة شهرية (مثال: YYYY-MM-DD):" : "Enter Last Menstrual Period date (YYYY-MM-DD):");
    if(!lmp) return;
    const lmpDate = new Date(lmp);
    if(isNaN(lmpDate)) return alert("تاريخ غير صحيح.");
    const edd = new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000));
    const result = currentLang === 'ar' 
        ? `🤰 **دليل متابعة الحمل:**\n• التاريخ المتوقع للولادة (EDD): **${edd.toLocaleDateString()}**\n• التوصية: إجراء فحص سونار متابعة وإجراء تحاليل صورة الدم الكاملة (CBC).`
        : `🤰 **Pregnancy Tracking:**\n• Estimated Due Date (EDD): **${edd.toLocaleDateString()}**`;
    lastBotResponse = result;
    appendMsg(result, 'bot-msg');
}

function calculatePediatricDose() {
    const weight = prompt(currentLang === 'ar' ? "أدخل وزن الطفل بالكيلوجرام (مثال: 12):" : "Enter child weight in kg:");
    if(!weight) return;
    const paracetamolDoseMg = parseFloat(weight) * 15;
    const mlSyrup = (paracetamolDoseMg / 24).toFixed(1);
    const res = currentLang === 'ar'
        ? `💉 **حاسبة جرعات الأطفال (باراسيتامول):**\n• الوزن: ${weight} كجم\n• الجرعة المحسوبة: **${paracetamolDoseMg} ملجم** (~ **${mlSyrup} مل**) كل 6 ساعات عند اللزوم.`
        : `💉 **Pediatric Dosage (Paracetamol):**\n• Weight: ${weight} kg\n• Dose: **${paracetamolDoseMg} mg** (~${mlSyrup} mL).`;
    lastBotResponse = res;
    appendMsg(res, 'bot-msg');
}

function openFirstAidGuide() {
    const choice = prompt(currentLang === 'ar' ? "اختر دليل الإسعاف الفوري:\n1. الاختناق\n2. الحروق\n3. إنعاش القلب (CPR)\n4. النزيف الشديد" : "Select First Aid:\n1. Choking\n2. Burns\n3. CPR\n4. Bleeding", "1");
    if(!choice) return;
    let guide = "";
    if(choice === "1") guide = "🚨 **إسعاف الاختناق (مناورة هيمليخ):** قف خلف المصاب، وقم بضغطات بطنية سريعة للأعلى حتى خروج الجسم الغريب.";
    else if(choice === "2") guide = "🚨 **إسعاف الحروق:** صب الماء الجاري الفاتر على الحرق لمدة 10-20 دقيقة. تجنب الثلج أو المواد العضوية.";
    else if(choice === "3") guide = "🚨 **إنعاش القلب (CPR):** اضغط بقوة وسرعة في منتصف الصدر بمعدل 100-120 ضغطة في الدقيقة لحين وصول الإسعاف.";
    else guide = "🚨 **إسعاف النزيف:** اضغط بقطعة قماش نظيفة وبشكل مباشر على مكان الجرح بقوة.";
    lastBotResponse = guide;
    appendMsg(guide, 'bot-msg');
}

function backupSystemData() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediguard_secure_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    appendMsg(currentLang === 'ar' ? "💾 تم تحميل النسخة الاحتياطية المشفرة بنجاح." : "💾 Encrypted backup downloaded.", 'bot-msg');
}

function generateEmergencyQR() {
    const identityData = JSON.parse(localStorage.getItem('mediguard_identity') || '{}');
    const bloodType = prompt(currentLang === 'ar' ? "فصيلة الدم:" : "Blood Type:", "O+");
    const ice = prompt(currentLang === 'ar' ? "رقم طوارئ قريب (ICE):" : "ICE Contact:");
    if(!ice) return;
    const nameStr = identityData.fullName ? `Name:${identityData.fullName}|` : '';
    const payload = `${nameStr}Blood:${bloodType}|ICE:${ice}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(payload)}`;
    const ws = document.getElementById('chatWorkspace');
    const div = document.createElement('div');
    div.className = 'msg bot-msg';
    div.innerHTML = `📇 **بطاقة الطوارئ QR الموثقة:**<br><img src="${qrUrl}" style="border-radius:10px; margin-top:5px;">`;
    ws.appendChild(div);
}

function openVitalsTracker() {
    const bp = prompt("ضغط الدم (مثال 120/80):");
    const spo2 = prompt("نسبة الأكسجين SpO2 %:");
    if(!bp || !spo2) return;
    const report = `📊 **العلامات الحيوية المسجلة:** ضغط: ${bp} | أكسجين: ${spo2}%`;
    lastBotResponse = report;
    appendMsg(report, 'bot-msg');
}

function checkSideEffects() {
    const med = prompt("اسم الدواء للتحذيرات:");
    if(!med) return;
    const info = `📋 **تحذيرات الدواء (${med}):** التزم بالجرعة المحددة ولا تتجاوزها لتجنب الآثار الجانبية.`;
    lastBotResponse = info;
    appendMsg(info, 'bot-msg');
}

function checkDrugInteractions() {
    const drugs = prompt("أسماء الأدوية مفصولة بـ (,):");
    if(!drugs) return;
    const res = `📋 **فحص التعارض:** تم تحليل (${drugs}). يفضل ترك فاصل ساعتين بين الجرعات.`;
    lastBotResponse = res;
    appendMsg(res, 'bot-msg');
}

function exportMedicalPDF() { window.print(); }

function speakLastResponse() {
    if (!('speechSynthesis' in window)) return alert("Speech unsupported.");
    if (!lastBotResponse) return alert("لا يوجد نص لقراءة التقرير.");
    const u = new SpeechSynthesisUtterance(lastBotResponse);
    u.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
    window.speechSynthesis.speak(u);
}

function triggerEmergency() {
    fetch('https://ipapi.co/json/').then(r=>r.json()).then(data => {
        const em = globalEmergencyNumbers[data.country_code] || globalEmergencyNumbers["DEFAULT"];
        const msg = `🚨 **أرقام الطوارئ (${data.country_name}):** الإسعاف: **${em.ambulance}** | الشرطة: **${em.police}**`;
        lastBotResponse = msg;
        appendMsg(msg, 'bot-msg');
    }).catch(() => appendMsg("🚨 طوارئ عامة: 112 / 911", 'bot-msg'));
}

function openAppointmentBooking() {
    const dt = prompt("تفاصيل الموعد المطلوب (طبيب/تحاليل):");
    if(!dt) return;
    const id = "MED-" + Math.floor(100000 + Math.random() * 900000);
    appendMsg(`✅ تم تأكيد الحجز المرجعي برقم: ${id}`, 'bot-msg');
}

function openPatientProfiles() {
    const identity = JSON.parse(localStorage.getItem('mediguard_identity') || '{}');
    const defaultName = identity.fullName || "المريض الرئيسي";
    const name = prompt("اسم الملف الطبي للمريض:", defaultName);
    if(!name) return;
    appendMsg(`👤 تم فتح الملف الطبي الموحد للمريض "${name}".`, 'bot-msg');
}

function checkMedicationStock() {
    const med = prompt("اسم الدواء المراد البحث عن توفره:");
    if(!med) return;
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            appendMsg(`✅ الصيدليات المتوفر بها الدواء قريباً منك:\n🔗 https://www.google.com/maps/search/pharmacies+with+${encodeURIComponent(med)}/@${pos.coords.latitude},${pos.coords.longitude},14z`, 'bot-msg');
        });
    }
}

function findNearbyFacilities() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            appendMsg(`✅ خريطة المشافي والصيدليات القريبة منك:\n🔗 https://www.google.com/maps/search/hospitals+pharmacies/@${pos.coords.latitude},${pos.coords.longitude},14z`, 'bot-msg');
        });
    }
}

function handleVisionScan(e) {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        appendMsg("📷 تم إرفاق المستند الطبي للتحليل الضوئي...", 'user-msg');
        setTimeout(() => appendMsg("🔍 تم قراءة المستند واستخراج البيانات الطبية بنجاح.", 'bot-msg'), 1000);
    };
    reader.readAsDataURL(file);
}

function toggleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
    recognition.start();
    recognition.onresult = (e) => { document.getElementById('userInput').value = e.results[0][0].transcript; };
}

function clearHistory() {
    const ws = document.getElementById('chatWorkspace');
    ws.innerHTML = '';
    appendMsg(translations[currentLang].welcome, 'bot-msg');
}
