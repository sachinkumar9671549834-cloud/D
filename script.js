let currentState = { page: 'home', paper: '', section: '' };
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; 
let questionStates = {}; 
let bookmarkedQuestions = {}; 
let testTimer = null;
let timeLeft = 0;
let totalTestTime = 0;
let currentLanguage = 'hi'; 
window.CURRENT_TEST_DATA = null;

if (history.state === null) {
    history.replaceState({ page: 'home' }, '');
}

function loadHomeScreen(updateHistory = true) {
    clearInterval(testTimer);
    currentState = { page: 'home', paper: '' };
    if (updateHistory) history.pushState({ page: 'home' }, '');

    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="app-title">INDIAN ARMY</div>
        <div class="app-subtitle">AGNIVEER & TA EXAM PORTAL</div>

        <div class="paper-card" onclick="selectPaper('GD')">
            <div class="icon-badge">GD</div>
            <div style="flex-grow: 1;">
                <h3 style="margin:0; font-size:16px;">Army Agniveer GD</h3>
                <p style="margin:4px 0 0 0; color:#8da2bb; font-size:12px;">Full Mock Tests</p>
            </div>
            <div style="color:var(--gold); font-size:14px;">➔</div>
        </div>

        <div class="paper-card" onclick="selectPaper('Technical')">
            <div class="icon-badge">TECH</div>
            <div style="flex-grow: 1;">
                <h3 style="margin:0; font-size:16px;">Army Agniveer Technical</h3>
                <p style="margin:4px 0 0 0; color:#8da2bb; font-size:12px;">PCM स्पेशल मॉक टेस्ट</p>
            </div>
            <div style="color:var(--gold); font-size:14px;">➔</div>
        </div>

        <div class="paper-card" onclick="selectPaper('Tradesman')">
            <div class="icon-badge">TM</div>
            <div style="flex-grow: 1;">
                <h3 style="margin:0; font-size:16px;">Army Agniveer Tradesman</h3>
                <p style="margin:4px 0 0 0; color:#8da2bb; font-size:12px;">8th & 10th पास स्पेशल टेस्ट</p>
            </div>
            <div style="color:var(--gold); font-size:14px;">➔</div>
        </div>

        <div class="paper-card" onclick="selectPaper('TA')">
            <div class="icon-badge">TA</div>
            <div style="flex-grow: 1;">
                <h3 style="margin:0; font-size:16px;">Territorial Army (TA)</h3>
                <p style="margin:4px 0 0 0; color:#8da2bb; font-size:12px;">प्रादेशिक सेना विशेष फुल मॉक</p>
            </div>
            <div style="color:var(--gold); font-size:14px;">➔</div>
        </div>
    `;
}

function selectPaper(paperType, updateHistory = true) {
    currentState = { page: 'options', paper: paperType };
    if (updateHistory) history.pushState({ page: 'options', paper: paperType }, '');

    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="app-title">Army ${paperType}</div>
        <div class="options-grid">
            <div class="opt-box" onclick="goToSection('Mock Test')">
                <div style="font-size:24px; margin-bottom:8px;">📝</div>
                <div style="font-size:14px; color:#fff;">Mock Test</div>
            </div>
            <div class="opt-box" onclick="goToSection('Syllabus')">
                <div style="font-size:24px; margin-bottom:8px;">📋</div>
                <div style="font-size:14px; color:#fff;">Syllabus</div>
            </div>
        </div>
        <button class="back-btn" onclick="loadHomeScreen(true)">⏮ Back to Home</button>
    `;
}

function goToSection(sectionName, updateHistory = true) {
    const paperType = currentState.paper;
    currentState = { page: 'section', paper: paperType, section: sectionName };
    if (updateHistory) history.pushState({ page: 'section', paper: paperType, section: sectionName }, '');

    const app = document.getElementById('app');
    
    if (sectionName === 'Mock Test') {
        let gridHtml = `<div class="app-title">${paperType} - All Mock Tests</div><div class="mock-grid">`;
        for (let i = 1; i <= 50; i++) {
            let filePrefix = paperType.toLowerCase() === 'technical' ? 'tech' : paperType.toLowerCase() === 'tradesman' ? 'tm' : paperType.toLowerCase();
            gridHtml += `<div class="mock-btn" onclick="fetchAndStartTest('${filePrefix}_mock_${i}')">🚀 Mock Test - ${i.toString().padStart(2, '0')}</div>`;
        }
        gridHtml += `</div><button class="back-btn" onclick="selectPaper('${paperType}', true)">Back</button>`;
        app.innerHTML = gridHtml;
    } else {
        app.innerHTML = `
            <div class="app-title">${paperType} Syllabus</div>
            <div class="list-container">
                <div class="paper-card" style="cursor:default; flex-direction:column; align-items:flex-start; line-height:1.8;">
                    <b style="color:var(--gold);">परीक्षा पैटर्न:</b>
                    <span>• कुल प्रश्न: 50 | कुल समय: 60 मिनट</span>
                    <span>• सही उत्तर: +2 अंक | गलत उत्तर: -0.5 अंक</span>
                </div>
            </div>
            <button class="back-btn" onclick="selectPaper('${paperType}', true)">Back</button>
        `;
    }
}

function fetchAndStartTest(fileName) {
    const loaderContainer = document.getElementById('test-data-loader');
    loaderContainer.innerHTML = '';
    window.CURRENT_TEST_DATA = null;

    const script = document.createElement('script');
    script.src = `data/${fileName}.js`;
    
    script.onload = function() {
        if (window.CURRENT_TEST_DATA && window.CURRENT_TEST_DATA.length > 0) {
            startCBTTest(window.CURRENT_TEST_DATA);
        } else {
            alert("इस टेस्ट फ़ाइल में डेटा का सही फॉर्मेट नहीं है या सवाल खाली हैं!");
        }
    };

    script.onerror = function() {
        alert(`यह टेस्ट फ़ाइल (data/${fileName}.js) फ़ोल्डर में नहीं मिली! कृपया इसे बनाकर डेटा ऐड करें।`);
    };

    loaderContainer.appendChild(script);
}

function startCBTTest(questionsData) {
    currentQuestions = questionsData;
    currentQuestionIndex = 0;
    userAnswers = {};
    questionStates = {};
    bookmarkedQuestions = {};
    currentLanguage = 'hi';
    
    currentQuestions.forEach((_, idx) => {
        questionStates[idx] = idx === 0 ? 'unattempted' : 'unseen';
        bookmarkedQuestions[idx] = false;
    });

    timeLeft = 60 * 60; // 60 मिनट
    totalTestTime = timeLeft;

    clearInterval(testTimer);
    testTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(testTimer);
            autoSubmitTest();
        } else {
            updateTimerDisplay();
        }
    }, 1000);

    renderCBTInterface();
}

function renderCBTInterface() {
    currentState = { page: 'cbt_test' };
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div style="background:#111; padding:10px 15px; display:flex; justify-content:space-between; align-items:center; border-radius:8px; margin-bottom:15px; max-width:600px; margin:0 auto 15px auto;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:18px;">⏱️</span>
                <span id="cbt-timer" style="font-weight:bold; font-family:monospace; color:#fff;">60:00</span>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button onclick="toggleBookmark()" id="btn-bookmark" style="background:#222; color:#fff; border:1px solid #555; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">🔖 BookMark</button>
                <button onclick="switchLanguage('en')" id="lang-en" style="background:#222; color:#fff; border:1px solid #444; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">EN</button>
                <button onclick="switchLanguage('hi')" id="lang-hi" style="background:#e5a93b; color:#000; border:none; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold; cursor:pointer;">हिंदी</button>
                <button onclick="togglePaletteMenu()" style="background:#233565; color:#fff; border:none; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer;">☰ ग्रिड</button>
            </div>
        </div>

        <div id="question-body-container" style="background:#1c2541; padding:15px; border-radius:12px; border:1px solid #233565; min-height:220px; max-width:600px; margin:0 auto 15px auto; box-sizing:border-box;"></div>

        <div style="display:flex; justify-content:space-between; gap:5px; margin:20px auto; max-width:600px; box-sizing:border-box; padding:0 2px;">
            <button onclick="previousQuestion()" id="btn-prev" style="flex:1; background:#4b5563; color:#fff; border:none; padding:12px 2px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">⏮ Prev</button>
            <button onclick="clearAnswer()" style="flex:1; background:#ef4444; color:#fff; border:none; padding:12px 2px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">Clear</button>
            <button onclick="markForReview()" style="flex:1.2; background:#3b82f6; color:#fff; border:none; padding:12px 2px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">Mark & Rev</button>
            <button onclick="saveAndNext()" style="flex:1.5; background:#10b981; color:#fff; border:none; padding:12px 2px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">Save & Next ➔</button>
        </div>

        <div id="palette-menu" style="display:none; position:fixed; top:0; right:0; width:75%; height:100%; background:#0b132b; box-shadow:-5px 0 15px rgba(0,0,0,0.5); z-index:1000; padding:20px; box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="color:var(--gold); margin:0;">Question Palette</h3>
                <button onclick="togglePaletteMenu()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">✕</button>
            </div>
            <div id="palette-grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; max-height:60%; overflow-y:auto; margin-bottom:35px;"></div>
            <button onclick="showSubmitConfirmModal()" style="width:calc(100% - 40px); background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; font-size:14px; position:absolute; bottom:20px; left:20px; cursor:pointer;">TEST SUBMIT KAREN</button>
        </div>

        <div id="submit-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2000; justify-content:center; align-items:center; padding:20px; box-sizing:border-box;">
            <div style="background:#1c2541; padding:20px; border-radius:12px; width:100%; max-width:340px; border:1px solid #3b82f6;">
                <h3 style="color:#fff; margin-top:0; text-align:center;">क्या आप टेस्ट सबमिट करना चाहते हैं?</h3>
                <div id="modal-summary-stats" style="color:#8da2bb; font-size:13px; line-height:2; margin:15px 0; background:#0b132b; padding:10px; border-radius:6px;"></div>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <button onclick="processFinalSubmit()" style="flex:1; background:#3b82f6; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">Yes, Submit</button>
                    <button onclick="closeSubmitModal()" style="flex:1; background:#4b5563; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">No</button>
                </div>
            </div>
        </div>
    `;
    updateTimerDisplay();
    loadQuestion(currentQuestionIndex);
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    if (questionStates[index] === 'unseen') questionStates[index] = 'unattempted';

    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
        btnPrev.style.opacity = index === 0 ? "0.4" : "1";
        btnPrev.disabled = index === 0;
    }

    const btnBkmk = document.getElementById('btn-bookmark');
    if (btnBkmk) {
        btnBkmk.style.background = bookmarkedQuestions[index] ? "#e5a93b" : "#222";
        btnBkmk.style.color = bookmarkedQuestions[index] ? "#000" : "#fff";
    }

    const qBody = document.getElementById('question-body-container');
    if (!qBody) return;
    const q = currentQuestions[index];
    const data = q[currentLanguage];

    let optionsHtml = '';
    data.options.forEach((opt, i) => {
        let isSelected = userAnswers[index] === i;
        optionsHtml += `
            <div onclick="selectOption(${i})" style="background:${isSelected ? '#233565' : '#1c2541'}; border:1px solid ${isSelected ? '#e5a93b' : '#3a4f7c'}; padding:12px; margin-top:10px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:10px;">
                <div style="width:18px; height:18px; border-radius:50%; border:2px solid #fff; display:flex; justify-content:center; align-items:center; background:${isSelected ? '#e5a93b' : 'transparent'};">
                    ${isSelected ? '<div style="width:8px; height:8px; background:#000; border-radius:50%;"></div>' : ''}
                </div>
                <span style="color:#fff; font-size:14px;">${opt}</span>
            </div>
        `;
    });

    qBody.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px; color:#8da2bb;">
            <span>Question: ${index + 1}/${currentQuestions.length} ${bookmarkedQuestions[index] ? '⭐' : ''}</span>
            <span style="color:#10b981; font-weight:bold;">Correct: +2.0 | Wrong: -0.5</span>
        </div>
        <p style="color:#fff; font-size:15px; font-weight:bold; margin:5px 0 15px 0; line-height:1.5;">${data.text}</p>
        ${optionsHtml}
    `;
    renderPaletteGrid();
}

function toggleBookmark() { bookmarkedQuestions[currentQuestionIndex] = !bookmarkedQuestions[currentQuestionIndex]; loadQuestion(currentQuestionIndex); }
function previousQuestion() { if (currentQuestionIndex > 0) loadQuestion(currentQuestionIndex - 1); }
function selectOption(optIndex) { userAnswers[currentQuestionIndex] = optIndex; questionStates[currentQuestionIndex] = 'attempted'; loadQuestion(currentQuestionIndex); }
function clearAnswer() { delete userAnswers[currentQuestionIndex]; questionStates[currentQuestionIndex] = 'unattempted'; loadQuestion(currentQuestionIndex); }

function markForReview() {
    questionStates[currentQuestionIndex] = 'review';
    if (currentQuestionIndex < currentQuestions.length - 1) loadQuestion(currentQuestionIndex + 1);
    else { renderPaletteGrid(); togglePaletteMenu(); }
}

function saveAndNext() {
    if (currentQuestionIndex < currentQuestions.length - 1) loadQuestion(currentQuestionIndex + 1);
    else togglePaletteMenu();
}

function switchLanguage(lang) {
    currentLanguage = lang;
    loadQuestion(currentQuestionIndex);
}

function updateTimerDisplay() {
    const timerElem = document.getElementById('cbt-timer');
    if (!timerElem) return;
    let mins = Math.floor(timeLeft / 60); let secs = timeLeft % 60;
    timerElem.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function togglePaletteMenu() {
    const menu = document.getElementById('palette-menu');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function renderPaletteGrid() {
    const grid = document.getElementById('palette-grid');
    if (!grid) return; grid.innerHTML = '';
    currentQuestions.forEach((_, idx) => {
        let state = questionStates[idx];
        let bg = '#4b5563'; let border = 'none';
        if (state === 'unattempted') bg = '#ef4444';
        if (state === 'attempted') bg = '#3b82f6';
        if (state === 'review') bg = '#a855f7';
        if (idx === currentQuestionIndex) border = '2px solid #fff';
        grid.innerHTML += `<div onclick="togglePaletteMenu(); loadQuestion(${idx});" style="background:${bg}; border:${border}; color:#fff; width:40px; height:40px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:bold; cursor:pointer; margin:auto;">${idx + 1}</div>`;
    });
}

function showSubmitConfirmModal() {
    let attempted = 0, unattempted = 0, review = 0;
    currentQuestions.forEach((_, idx) => {
        let state = questionStates[idx];
        if (state === 'attempted') attempted++; else if (state === 'review') review++; else unattempted++;
    });
    document.getElementById('modal-summary-stats').innerHTML = `• Total: ${currentQuestions.length}<br>• Attempted: ${attempted}<br>• Unattempted: ${unattempted}<br>• Review: ${review}`;
    document.getElementById('submit-modal').style.display = 'flex';
}

function closeSubmitModal() { document.getElementById('submit-modal').style.display = 'none'; }
function autoSubmitTest() { alert("समय समाप्त!"); processFinalSubmit(); }

function processFinalSubmit() {
    clearInterval(testTimer);
    currentState = { page: 'result' };
    let correct = 0, incorrect = 0, unattempted = 0, resultHTML = '';

    currentQuestions.forEach((q, idx) => {
        const data = q[currentLanguage];
        const userAnsIndex = userAnswers[idx];
        const isCorrect = userAnsIndex === q.correct;
        if (userAnsIndex === undefined) unattempted++; else if (isCorrect) correct++; else incorrect++;

        resultHTML += `
            <div style="background:#1c2541; padding:15px; border-radius:8px; border:1px solid #233565; margin-bottom:15px; text-align:left;">
                <b>Q.${idx + 1} ${data.text}</b>
                <div style="color:${isCorrect ? '#10b981' : userAnsIndex === undefined ? '#8da2bb' : '#ef4444'}; margin-top:5px;">• आपका जवाब: ${userAnsIndex !== undefined ? data.options[userAnsIndex] : 'नहीं दिया'}</div>
                <div style="color:#10b981;">✔ सही जवाब: ${data.options[q.correct]}</div>
                <div style="margin-top:8px; font-size:13px; color:#c5d3e8; background:#0b132b; padding:8px; border-radius:4px;"><b>सॉल्यूशन:</b> ${data.sol}</div>
            </div>
        `;
    });

    document.getElementById('app').innerHTML = `
        <h2 style="color:var(--gold); text-align:center;">📋 Result Scorecard</h2>
        <div style="background:#1c2541; padding:20px; text-align:center; border-radius:12px; margin:20px auto; border:1px solid #3b82f6; max-width:600px;">
            <span style="color:#8da2bb;">TOTAL SCORE</span>
            <h1 style="color:var(--gold); margin:5px 0; font-size:42px;">${correct * 2 - incorrect * 0.5}</h1>
            <span style="color:#10b981;">Correct: ${correct}</span> | <span style="color:#ef4444;">Wrong: ${incorrect}</span> | <span>Skip: ${unattempted}</span>
        </div>
        <div style="max-width:600px; margin:0 auto;">${resultHTML}</div>
        <button onclick="loadHomeScreen(true)" style="width:100%; max-width:600px; background:var(--gold); color:#000; padding:14px; border:none; border-radius:8px; font-weight:bold; cursor:pointer; margin:20px auto; display:block;">➔ मुख्य स्क्रीन पर वापस जाएँ</button>
    `;
}

window.addEventListener('popstate', function(event) {
    if (currentState.page === 'cbt_test') {
        if (confirm("क्या आप टेस्ट छोड़ना चाहते हैं?")) loadHomeScreen(false);
        else history.pushState(null, null, window.location.pathname);
        return;
    }
    if (event.state) {
        if (event.state.page === 'home') loadHomeScreen(false);
        else if (event.state.page === 'options') selectPaper(event.state.paper, false);
        else if (event.state.page === 'section') goToSection(event.state.section, false);
    } else loadHomeScreen(false);
});

loadHomeScreen(false);
