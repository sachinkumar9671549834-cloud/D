// ऐप स्टेट मैनेजमेंट
let currentState = { page: 'home', paper: '', section: '' };

// टेस्ट इंजन वैरियेबल्स
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; 
let questionStates = {}; 
let bookmarkedQuestions = {}; 
let testTimer = null;
let timeLeft = 0;
let currentLanguage = 'hi'; 

// सैंपल प्रश्न बैंक
const sampleQuestionsGD = [
    { qNo: 1, en: { text: "Who was the first Prime Minister of India?", options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Dr. Rajendra Prasad"], sol: "Jawaharlal Nehru was the first PM." }, hi: { text: "भारत के प्रथम प्रधानमंत्री कौन थे?", options: ["महात्वा गांधी", "जवाहरलाल नेहरू", "सुभाष चंद्र बोस", "डॉ. राजेंद्र प्रसाद"], sol: "जवाहरलाल नेहरू भारत के पहले प्रधानमंत्री थे।" }, correct: 1 },
    { qNo: 2, en: { text: "What is the chemical formula of Water?", options: ["CO2", "H2O", "O2", "NaCl"], sol: "Water is H2O." }, hi: { text: "पानी का रासायनिक सूत्र क्या है?", options: ["CO2", "H2O", "O2", "NaCl"], sol: "पानी का सूत्र H2O है।" }, correct: 1 },
    { qNo: 3, en: { text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], sol: "Mars is the Red Planet." }, hi: { text: "किस ग्रह को लाल ग्रह के नाम से जाना जाता है?", options: ["पृथ्वी", "मंगल", "शुक्र", "बृहस्पति"], sol: "मंगल को लाल ग्रह कहा जाता है।" }, correct: 1 }
];

function loadHomeScreen(updateHistory = true) {
    clearInterval(testTimer);
    currentState = { page: 'home' };
    if (updateHistory) history.pushState({ page: 'home' }, '');
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="text-align:center; color:var(--gold); margin:20px 0; font-size:24px; font-weight:bold;">INDIAN ARMY</div>
        <div onclick="selectPaper('GD')" style="background:#1c2541; padding:15px; margin:10px auto; border-radius:8px; border:1px solid #233565; cursor:pointer;">
            <h3 style="margin:0; color:#fff;">Army Agniveer GD</h3>
        </div>
    `;
}

function selectPaper(paperType) {
    currentState = { page: 'section', paper: paperType };
    history.pushState(currentState, '');
    startCBTTest();
}

function startCBTTest() {
    currentQuestions = sampleQuestionsGD;
    currentQuestionIndex = 0;
    userAnswers = {};
    questionStates = {};
    bookmarkedQuestions = {};
    timeLeft = 5 * 60;
    clearInterval(testTimer);
    testTimer = setInterval(() => { timeLeft--; if(timeLeft <= 0) processFinalSubmit(); updateTimerDisplay(); }, 1000);
    renderCBTInterface();
}

function renderCBTInterface() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="background:#111; padding:10px; display:flex; justify-content:space-between; align-items:center; border-radius:8px; margin-bottom:15px;">
            <span id="cbt-timer" style="color:#fff; font-family:monospace;">05:00</span>
            <div style="display:flex; gap:5px;">
                <button onclick="toggleBookmark()" id="btn-bookmark" style="padding:4px; font-size:10px;">🔖 BookMark</button>
                <button onclick="togglePaletteMenu()" style="padding:4px; font-size:10px;">☰ ग्रिड</button>
            </div>
        </div>
        <div id="question-body-container" style="background:#1c2541; padding:15px; border-radius:12px; border:1px solid #233565;"></div>
        
        <!-- चारों बटन एक लाइन में जैसा आपने मांगा -->
        <div style="display:flex; justify-content:space-between; gap:5px; margin-top:20px;">
            <button onclick="previousQuestion()" style="flex:1; background:#4b5563; color:#fff; border:none; padding:10px 2px; border-radius:6px; font-size:11px;">⏮ Prev</button>
            <button onclick="clearAnswer()" style="flex:1; background:#ef4444; color:#fff; border:none; padding:10px 2px; border-radius:6px; font-size:11px;">Clear</button>
            <button onclick="markForReview()" style="flex:1.3; background:#3b82f6; color:#fff; border:none; padding:10px 2px; border-radius:6px; font-size:11px;">Mark & Rev</button>
            <button onclick="saveAndNext()" style="flex:1.5; background:#10b981; color:#fff; border:none; padding:10px 2px; border-radius:6px; font-size:11px;">Save & Next ➔</button>
        </div>
        <div id="palette-menu" style="display:none; position:fixed; top:0; right:0; width:80%; height:100%; background:#0b132b; padding:20px;">
            <div id="palette-grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px;"></div>
            <button onclick="processFinalSubmit()" style="width:100%; margin-top:20px; background:red; color:#fff;">SUBMIT</button>
        </div>
    `;
    loadQuestion(0);
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const q = currentQuestions[index];
    const data = q[currentLanguage];
    const qBody = document.getElementById('question-body-container');
    
    let optionsHtml = data.options.map((opt, i) => `
        <div onclick="selectOption(${i})" style="padding:10px; margin:5px 0; border:1px solid ${userAnswers[index] === i ? 'var(--gold)' : '#3a4f7c'}; border-radius:6px;">
            ${opt}
        </div>
    `).join('');
    
    qBody.innerHTML = `<p>${data.text}</p>${optionsHtml}`;
}

function toggleBookmark() {
    bookmarkedQuestions[currentQuestionIndex] = !bookmarkedQuestions[currentQuestionIndex];
    alert(bookmarkedQuestions[currentQuestionIndex] ? "बुकमार्क किया गया" : "बुकमार्क हटाया गया");
}

function previousQuestion() { if(currentQuestionIndex > 0) loadQuestion(currentQuestionIndex - 1); }
function selectOption(i) { userAnswers[currentQuestionIndex] = i; loadQuestion(currentQuestionIndex); }
function clearAnswer() { delete userAnswers[currentQuestionIndex]; loadQuestion(currentQuestionIndex); }
function markForReview() { questionStates[currentQuestionIndex] = 'review'; saveAndNext(); }
function saveAndNext() { if(currentQuestionIndex < currentQuestions.length - 1) loadQuestion(currentQuestionIndex + 1); else togglePaletteMenu(); }
function togglePaletteMenu() { const m = document.getElementById('palette-menu'); m.style.display = m.style.display === 'none' ? 'block' : 'none'; }
function updateTimerDisplay() { document.getElementById('cbt-timer').innerText = Math.floor(timeLeft/60) + ":" + (timeLeft%60).toString().padStart(2, '0'); }

function processFinalSubmit() {
    clearInterval(testTimer);
    let correct = 0, incorrect = 0, unattempted = 0, qHtml = '';
    
    currentQuestions.forEach((q, idx) => {
        const isCorrect = userAnswers[idx] === q.correct;
        if(userAnswers[idx] === undefined) unattempted++;
        else if(isCorrect) correct++;
        else incorrect++;
        
        qHtml += `<div style="margin-bottom:10px; padding:10px; border-bottom:1px solid #333;">
            <p>Q${idx+1}: ${q[currentLanguage].text}</p>
            <p style="color:#10b981;">✔ सही: ${q[currentLanguage].options[q.correct]}</p>
            <p style="color:var(--gold);">💡 हल: ${q[currentLanguage].sol}</p>
        </div>`;
    });

    document.getElementById('app').innerHTML = `
        <h2>Analysis</h2>
        <div style="background:#1c2541; padding:20px; border-radius:10px;">
            <p>Correct: ${correct} | Wrong: ${incorrect} | Unattempted: ${unattempted}</p>
            <h3>Solutions:</h3>
            ${qHtml}
        </div>
        <button onclick="location.reload()" style="width:100%; padding:15px; background:var(--gold);">होम पर वापस जाएँ</button>
    `;
}

loadHomeScreen();
