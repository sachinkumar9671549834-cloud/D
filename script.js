// ऐप स्टेट मैनेजमेंट
let currentState = { page: 'home', paper: '', section: '' };

// टेस्ट इंजन वैरियेबल्स
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; 
let questionStates = {}; 
let bookmarkedQuestions = {}; // { qIndex: true/false }
let testTimer = null;
let timeLeft = 0;
let totalTestTime = 0;
let currentLanguage = 'hi'; 

// सैंपल प्रश्न बैंक (विस्तृत सॉल्यूशन के साथ)
const sampleQuestionsGD = [
    {
        qNo: 1,
        en: {
            text: "Who was the first Prime Minister of India?",
            options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Dr. Rajendra Prasad"],
            sol: "Jawaharlal Nehru was the first Prime Minister of independent India, serving from 1947 to 1964."
        },
        hi: {
            text: "भारत के प्रथम प्रधानमंत्री कौन थे?",
            options: ["महात्वा गांधी", "जवाहरलाल नेहरू", "सुभाष चंद्र बोस", "डॉ. राजेंद्र प्रसाद"],
            sol: "जवाहरलाल नेहरू स्वतंत्र भारत के पहले प्रधानमंत्री थे, जिन्होंने 1947 से 1964 तक देश की सेवा की।"
        },
        correct: 1
    },
    {
        qNo: 2,
        en: {
            text: "What is the chemical formula of Water?",
            options: ["CO2", "H2O", "O2", "NaCl"],
            sol: "The chemical formula of water is H2O, meaning it contains two Hydrogen atoms and one Oxygen atom."
        },
        hi: {
            text: "पानी का रासायनिक सूत्र क्या है?",
            options: ["CO2", "H2O", "O2", "NaCl"],
            sol: "पानी का रासायनिक सूत्र H2O hai, जिसका अर्थ है कि इसमें दो हाइड्रोजन परमाणु और एक ऑक्सीजन परमाणु होता है।"
        },
        correct: 1
    },
    {
        qNo: 3,
        en: {
            text: "Which planet is known as the Red Planet?",
            options: ["Earth", "Mars", "Venus", "Jupiter"],
            sol: "Mars is known as the Red Planet because of the iron oxide (rust) on its surface, giving it a reddish appearance."
        },
        hi: {
            text: "किस ग्रह को लाल ग्रह के नाम से जाना जाता है?",
            options: ["पृथ्वी", "मंगल", "शुक्र", "बृहस्पति"],
            sol: "मंगल को लाल ग्रह कहा जाता है क्योंकि इसकी सतह पर आयरन ऑक्साइड (जंग) की अधिकता है, जो इसे लाल रंग देती है।"
        },
        correct: 1
    }
];

if (history.state === null) {
    history.replaceState({ page: 'home' }, '');
}

function loadHomeScreen(updateHistory = true) {
    clearInterval(testTimer);
    currentState = { page: 'home', paper: '' };
    if (updateHistory) history.pushState({ page: 'home' }, '');

    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="app-title" style="text-align:center; font-weight:bold; color:var(--gold); margin-top:20px; font-size:24px;">INDIAN ARMY</div>
        <div class="app-subtitle" style="text-align:center; color:#fff; font-size:12px; margin-bottom:20px; letter-spacing:2px;">AGNIVEER EXAM PORTAL</div>

        <div class="paper-card" onclick="selectPaper('GD')" style="background:#1c2541; padding:15px; margin:10px auto; border-radius:8px; display:flex; align-items:center; cursor:pointer; border:1px solid #233565;">
            <div class="icon-badge" style="background:var(--gold); color:#000; padding:5px 10px; border-radius:4px; font-weight:bold; margin-right:15px;">GD</div>
            <div style="flex-grow: 1;">
                <h3 style="margin:0; font-size:16px; color:#fff;">Army Agniveer GD</h3>
                <p style="margin:4px 0 0 0; color:#8da2bb; font-size:12px;">Full Mock, Subjects, Syllabus</p>
            </div>
            <div style="color:var(--gold); font-size:14px;">चुनें ➔</div>
        </div>

        <div class="paper-card" onclick="selectPaper('Tradesman')" style="background:#1c2541; padding:15px; margin:10px auto; border-radius:8px; display:flex; align-items:center; cursor:pointer; border:1px solid #233565;">
            <div class="icon-badge" style="background:var(--gold); color:#000; padding:5px 10px; border-radius:4px; font-weight:bold; margin-right:15px;">TM</div>
            <div style="flex-grow: 1;">
                <h3 style="margin:0; font-size:16px; color:#fff;">Army Agniveer Tradesman</h3>
                <p style="margin:4px 0 0 0; color:#8da2bb; font-size:12px;">8th & 10th पास विशेष टेस्ट</p>
            </div>
            <div style="color:var(--gold); font-size:14px;">चुनें ➔</div>
        </div>

        <div class="paper-card" onclick="selectPaper('Technical')" style="background:#1c2541; padding:15px; margin:10px auto; border-radius:8px; display:flex; align-items:center; cursor:pointer; border:1px solid #233565;">
            <div class="icon-badge" style="background:var(--gold); color:#000; padding:5px 10px; border-radius:4px; font-weight:bold; margin-right:15px;">TECH</div>
            <div style="flex-grow: 1;">
                <h3 style="margin:0; font-size:16px; color:#fff;">Army Agniveer Technical</h3>
                <p style="margin:4px 0 0 0; color:#8da2bb; font-size:12px;">PCM और टेक्निकल विशेष टेस्ट</p>
            </div>
            <div style="color:var(--gold); font-size:14px;">चुनें ➔</div>
        </div>
    `;
}

function selectPaper(paperType, updateHistory = true) {
    clearInterval(testTimer);
    currentState = { page: 'options', paper: paperType };
    if (updateHistory) history.pushState({ page: 'options', paper: paperType }, '');

    const app = document.getElementById('app');
    if (!app) return;
    let badgeText = paperType === 'GD' ? 'GD' : paperType === 'Tradesman' ? 'TM' : 'TECH';
    
    app.innerHTML = `
        <div class="paper-card active" style="background:#233565; padding:15px; margin-top:10px; border-radius:8px; display:flex; align-items:center; border:1px solid var(--gold);">
            <div class="icon-badge" style="background:var(--gold); color:#000; padding:5px 10px; border-radius:4px; font-weight:bold; margin-right:15px;">${badgeText}</div>
            <div style="flex-grow: 1;">
                <h3 style="margin:0; font-size:16px; color:#fff;">Army Agniveer ${paperType}</h3>
            </div>
        </div>

        <div class="options-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:20px;">
            <div class="opt-box" onclick="goToSection('Mock Test')" style="background:#1c2541; padding:20px; text-align:center; border-radius:8px; cursor:pointer; border:1px solid #3a4f7c;">
                <div class="opt-icon" style="font-size:24px; margin-bottom:8px;">📝</div>
                <div class="opt-title" style="color:#fff; font-size:14px;">Mock Test</div>
            </div>
            <div class="opt-box" onclick="goToSection('Prev. Paper')" style="background:#1c2541; padding:20px; text-align:center; border-radius:8px; cursor:pointer; border:1px solid #3a4f7c;">
                <div class="opt-icon" style="font-size:24px; margin-bottom:8px;">📚</div>
                <div class="opt-title" style="color:#fff; font-size:14px;">Prev. Paper</div>
            </div>
            <div class="opt-box" onclick="goToSection('Subject Mock')" style="background:#1c2541; padding:20px; text-align:center; border-radius:8px; cursor:pointer; border:1px solid #3a4f7c;">
                <div class="opt-icon" style="font-size:24px; margin-bottom:8px;">🎯</div>
                <div class="opt-title" style="color:#fff; font-size:14px;">Subject Mock</div>
            </div>
            <div class="opt-box" onclick="goToSection('Syllabus')" style="background:#1c2541; padding:20px; text-align:center; border-radius:8px; cursor:pointer; border:1px solid #3a4f7c;">
                <div class="opt-icon" style="font-size:24px; margin-bottom:8px;">📋</div>
                <div class="opt-title" style="color:#fff; font-size:14px;">Syllabus</div>
            </div>
        </div>
    `;
}

function goToSection(sectionName, updateHistory = true) {
    const paperType = currentState.paper;
    currentState = { page: 'section', paper: paperType, section: sectionName };
    if (updateHistory) history.pushState({ page: 'section', paper: paperType, section: sectionName }, '');

    const app = document.getElementById('app');
    if (!app) return;
    let html = `<h2 style="color:var(--gold); margin:15px 0; font-size:18px;">Army Agniveer ${paperType} - ${sectionName}</h2>`;

    if (sectionName === 'Mock Test') {
        html += `
            <div class="list-container">
                <div class="list-item" onclick="startCBTTest('GD_MOCK_1')" style="background:#1c2541; padding:15px; margin-bottom:10px; border-radius:8px; color:#fff; cursor:pointer; border:1px solid #233565;">🚀 Full Mock Test - 01 (असली टेस्ट इंटरफ़ेस)</div>
                <div class="list-item" onclick="alert('जल्द आ रहा है...')" style="background:#1c2541; padding:15px; margin-bottom:10px; border-radius:8px; color:#fff; cursor:pointer; border:1px solid #233565;">🚀 Full Mock Test - 02</div>
            </div>
        `;
    } else if (sectionName === 'Syllabus') {
        let isTech = paperType === 'Technical';
        html += `
            <div style="background:#1c2541; padding:15px; border-radius:12px; font-size:14px; line-height:1.6; border:1px solid #233565; color:#fff;">
                <b style="color:var(--gold);">परीक्षा पैटर्न (${paperType}):</b><br>
                • कुल प्रश्न: 50 | कुल अंक: ${isTech ? '200' : '100'}<br>
                • सही उत्तर: ${isTech ? '+4' : '+2'} अंक<br>
                <b style="color:#ef4444;">• नेगेटिव मार्किंग: ${isTech ? '-1' : '-0.5'} अंक</b>
            </div>
        `;
    } else {
        html += `<div class="list-container"><div class="list-item" style="background:#1c2541; padding:15px; border-radius:8px; color:#fff; text-align:center;">जल्द आ रहा है...</div></div>`;
    }
    app.innerHTML = html;
}

function startCBTTest(testId) {
    currentQuestions = sampleQuestionsGD; 
    currentQuestionIndex = 0;
    userAnswers = {};
    questionStates = {};
    bookmarkedQuestions = {};
    currentLanguage = 'hi';
    
    currentQuestions.forEach((_, idx) => {
        questionStates[idx] = idx === 0 ? 'unattempted' : 'unseen';
        bookmarkedQuestions[idx] = false;
    });

    timeLeft = 5 * 60; 
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
    if (!app) return;
    
    app.innerHTML = `
        <!-- टॉप बार -->
        <div style="background:#111; padding:10px 15px; display:flex; justify-content:space-between; align-items:center; border-radius:8px; margin-bottom:15px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:18px;">⏱️</span>
                <span id="cbt-timer" style="font-weight:bold; font-family:monospace; color:#fff;">05:00</span>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button onclick="toggleBookmark()" id="btn-bookmark" style="background:#222; color:#fff; border:1px solid #555; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">🔖 BookMark</button>
                <button onclick="switchLanguage('en')" id="lang-en" style="background:#222; color:#fff; border:1px solid #444; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">EN</button>
                <button onclick="switchLanguage('hi')" id="lang-hi" style="background:#e5a93b; color:#000; border:none; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold; cursor:pointer;">हिंदी</button>
                <button onclick="togglePaletteMenu()" style="background:#233565; color:#fff; border:none; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer;">☰ ग्रिड</button>
            </div>
        </div>

        <div id="question-body-container" style="background:#1c2541; padding:15px; border-radius:12px; border:1px solid #233565; min-height:220px; margin-bottom:15px;">
        </div>

        <!-- 🎯 अपडेटेड बटन लेआउट: चारों बटन्स (Previous के साथ) अब एक ही कतार में सुंदर ढंग से सेट हैं -->
        <div style="display:flex; justify-content:space-between; gap:5px; margin-top:20px; width:100%; box-sizing:border-box; padding:0 2px;">
            <button onclick="previousQuestion()" id="btn-prev" style="flex:1; background:#4b5563; color:#fff; border:none; padding:12px 2px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; text-align:center; white-space:nowrap; display:flex; align-items:center; justify-content:center; gap:2px;">⏮ Prev</button>
            <button onclick="clearAnswer()" style="flex:1; background:#ef4444; color:#fff; border:none; padding:12px 2px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; text-align:center; white-space:nowrap;">Clear</button>
            <button onclick="markForReview()" style="flex:1.2; background:#3b82f6; color:#fff; border:none; padding:12px 2px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; text-align:center; white-space:nowrap;">Mark & Rev</button>
            <button onclick="saveAndNext()" style="flex:1.5; background:#10b981; color:#fff; border:none; padding:12px 2px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer; text-align:center; white-space:nowrap; display:flex; align-items:center; justify-content:center; gap:2px;">Save & Next ➔</button>
        </div>

        <div id="palette-menu" style="display:none; position:fixed; top:0; right:0; width:75%; height:100%; background:#0b132b; box-shadow:-5px 0 15px rgba(0,0,0,0.5); z-index:1000; padding:20px; box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="color:var(--gold); margin:0;">Question Palette</h3>
                <button onclick="togglePaletteMenu()" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">✕</button>
            </div>
            <div id="palette-grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; max-height:60%; overflow-y:auto; margin-bottom:35px;">
            </div>
            <button onclick="showSubmitConfirmModal()" style="width:100%; background:#ef4444; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; font-size:14px; position:absolute; bottom:20px; left:0; width:calc(100% - 40px); margin:0 20px; cursor:pointer;">TEST SUBMIT KAREN</button>
        </div>

        <div id="submit-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2000; justify-content:center; align-items:center; padding:20px; box-sizing:border-box;">
            <div style="background:#1c2541; padding:20px; border-radius:12px; width:100%; max-width:340px; border:1px solid #3b82f6;">
                <h3 style="color:#fff; margin-top:0; text-align:center;">Are you sure?</h3>
                <div id="modal-summary-stats" style="color:#8da2bb; font-size:13px; line-height:2; margin:15px 0; background:#0b132b; padding:10px; border-radius:6px;">
                </div>
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
    if (questionStates[index] === 'unseen') {
        questionStates[index] = 'unattempted';
    }

    // Previous बटन की ओपेसिटी एडजस्टमेंट
    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
        btnPrev.style.opacity = index === 0 ? "0.4" : "1";
        btnPrev.disabled = index === 0;
    }

    // बुकमार्क बटन को अपडेट करना
    const btnBkmk = document.getElementById('btn-bookmark');
    if (btnBkmk) {
        if (bookmarkedQuestions[index]) {
            btnBkmk.style.background = "#e5a93b";
            btnBkmk.style.color = "#000";
        } else {
            btnBkmk.style.background = "#222";
            btnBkmk.style.color = "#fff";
        }
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

function toggleBookmark() {
    bookmarkedQuestions[currentQuestionIndex] = !bookmarkedQuestions[currentQuestionIndex];
    loadQuestion(currentQuestionIndex);
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

function selectOption(optIndex) {
    userAnswers[currentQuestionIndex] = optIndex;
    questionStates[currentQuestionIndex] = 'attempted';
    loadQuestion(currentQuestionIndex);
}

function clearAnswer() {
    delete userAnswers[currentQuestionIndex];
    questionStates[currentQuestionIndex] = 'unattempted';
    loadQuestion(currentQuestionIndex);
}

function markForReview() {
    questionStates[currentQuestionIndex] = 'review';
    if (currentQuestionIndex < currentQuestions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        renderPaletteGrid();
        togglePaletteMenu();
    }
}

function saveAndNext() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        togglePaletteMenu(); 
    }
}

function switchLanguage(lang) {
    currentLanguage = lang;
    const elEn = document.getElementById('lang-en');
    const elHi = document.getElementById('lang-hi');
    if(elEn && elHi) {
        elEn.style.background = lang === 'en' ? '#e5a93b' : '#222';
        elEn.style.color = lang === 'en' ? '#000' : '#fff';
        elHi.style.background = lang === 'hi' ? '#e5a93b' : '#222';
        elHi.style.color = lang === 'hi' ? '#000' : '#fff';
    }
    loadQuestion(currentQuestionIndex);
}

function updateTimerDisplay() {
    const timerElem = document.getElementById('cbt-timer');
    if (!timerElem) return;
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    timerElem.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function togglePaletteMenu() {
    const menu = document.getElementById('palette-menu');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function renderPaletteGrid() {
    const grid = document.getElementById('palette-grid');
    if (!grid) return;
    grid.innerHTML = '';
    currentQuestions.forEach((_, idx) => {
        let state = questionStates[idx];
        let bg = '#4b5563'; 
        let border = 'none';
        if (state === 'unattempted') bg = '#ef4444';
        if (state === 'attempted') bg = '#3b82f6';
        if (state === 'review') bg = '#a855f7';
        
        if (bookmarkedQuestions[idx]) border = '2px dashed #e5a93b';
        if (idx === currentQuestionIndex) border = '2px solid #fff';

        grid.innerHTML += `
            <div onclick="togglePaletteMenu(); loadQuestion(${idx});" style="background:${bg}; border:${border}; color:#fff; width:40px; height:40px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:bold; font-size:14px; cursor:pointer; margin:auto;">
                ${idx + 1}
            </div>
        `;
    });
}

function showSubmitConfirmModal() {
    let attempted = 0, unattempted = 0, review = 0;
    currentQuestions.forEach((_, idx) => {
        let state = questionStates[idx];
        if (state === 'attempted') attempted++;
        else if (state === 'review') review++;
        else unattempted++;
    });

    const mStats = document.getElementById('modal-summary-stats');
    if(mStats) {
        mStats.innerHTML = `
            • Total Questions: ${currentQuestions.length}<br>
            • Attempted: ${attempted}<br>
            • Unattempted: ${unattempted}<br>
            • Marked for Review: ${review}
        `;
    }
    const sModal = document.getElementById('submit-modal');
    if(sModal) sModal.style.display = 'flex';
}

function closeSubmitModal() {
    const sModal = document.getElementById('submit-modal');
    if(sModal) sModal.style.display = 'none';
}

function autoSubmitTest() {
    clearInterval(testTimer);
    alert("समय समाप्त! आपका टेस्ट आटोमेटिक सबमिट हो रहा है।");
    processFinalSubmit();
}

function processFinalSubmit() {
    clearInterval(testTimer);
    currentState = { page: 'result' };
    
    let correct = 0, incorrect = 0, unattempted = 0;
    let correctHTML = '', incorrectHTML = '', unattemptedHTML = '', bookmarkHTML = '';
    
    currentQuestions.forEach((q, idx) => {
        const data = q[currentLanguage];
        const userAnsIndex = userAnswers[idx];
        const isCorrect = userAnsIndex === q.correct;
        
        let chosenText = userAnsIndex !== undefined ? data.options[userAnsIndex] : 'आपने उत्तर नहीं दिया';
        let correctText = data.options[q.correct];

        let qBlockHTML = `
            <div style="background:#0b132b; padding:15px; border-radius:8px; border:1px solid #233565; margin-bottom:15px; font-size:14px;">
                <b style="color:#fff;">Q.${idx + 1} ${data.text}</b>
                <div style="margin-top:8px; color:${isCorrect ? '#10b981' : userAnsIndex === undefined ? '#8da2bb' : '#ef4444'};">
                    • आपका उत्तर: ${chosenText}
                </div>
                <div style="color:#10b981; margin-top:2px;">
                    ✔ सही उत्तर: ${correctText}
                </div>
                <div style="background:#1c2541; padding:10px; border-radius:6px; margin-top:10px; color:#c5d3e8; border-left:3px solid var(--gold); font-size:13px; line-height:1.5;">
                    <b style="color:var(--gold);">सॉल्यूशन:</b> ${data.sol}
                </div>
            </div>
        `;

        if (userAnsIndex === undefined) {
            unattempted++;
            unattemptedHTML += qBlockHTML;
        } else if (isCorrect) {
            correct++;
            correctHTML += qBlockHTML;
        } else {
            incorrect++;
            incorrectHTML += qBlockHTML;
        }

        if (bookmarkedQuestions[idx]) {
            bookmarkHTML += qBlockHTML;
        }
    });

    let positiveMarks = correct * 2;
    let negativeMarks = incorrect * 0.5;
    let finalScore = positiveMarks - negativeMarks;
    let accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
        <h2 style="color:var(--gold); text-align:center; margin-top:10px;">📋 Scorecard Analysis</h2>
        
        <div style="background:#1c2541; border-radius:12px; padding:20px; border:1px solid #3b82f6; text-align:center; margin-bottom:20px;">
            <div style="font-size:14px; color:#8da2bb;">SCORE</div>
            <div style="font-size:36px; font-weight:bold; color:var(--gold); margin:5px 0;">${finalScore} <span style="font-size:16px; color:#fff;">/ ${currentQuestions.length * 2}</span></div>
            <div style="font-size:12px; color:#ef4444;">(Correct: +${positiveMarks} | Wrong: -${negativeMarks})</div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
            <div style="background:#1c2541; padding:15px; border-radius:10px; border:1px solid #233565; text-align:center;">
                <div style="font-size:20px;">🎯</div>
                <div style="font-size:12px; color:#8da2bb; margin:4px 0;">Accuracy</div>
                <div style="font-size:16px; font-weight:bold; color:#fff;">${accuracy}%</div>
            </div>
            <div style="background:#1c2541; padding:15px; border-radius:10px; border:1px solid #233565; text-align:center;">
                <div style="font-size:20px;">📝</div>
                <div style="font-size:12px; color:#8da2bb; margin:4px 0;">Qs. Attempted</div>
                <div style="font-size:16px; font-weight:bold; color:#fff;">${correct + incorrect} / ${currentQuestions.length}</div>
            </div>
        </div>

        <div style="background:#1c2541; padding:15px; border-radius:10px; border:1px solid #233565; font-size:14px; line-height:2; margin-bottom:25px; color:#fff;">
            <div style="display:flex; justify-content:space-between;"><span style="color:#10b981;">✔ Correct Qs:</span><b style="color:#10b981;">${correct}</b></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:#ef4444;">✖ Incorrect Qs:</span><b style="color:#ef4444;">${incorrect}</b></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:#8da2bb;">⚪ Unattempted Qs:</span><b>${unattempted}</b></div>
        </div>

        <hr style="border:1px solid #233565; margin:30px 0;">
        <h3 style="color:var(--gold); margin-bottom:15px;">🔍 Detailed Solution & Analysis</h3>
        
        <div style="background:#1c2541; border-radius:12px; padding:15px; border:1px solid #233565; margin-bottom:25px;">
            <h4 style="color:#10b981; margin:5px 0 10px 0; border-bottom:1px solid #233565; padding-bottom:5px;">✔ Correct Answers (${correct})</h4>
            ${correctHTML || '<p style="color:#8da2bb; font-size:12px;">कोई प्रश्न सही नहीं हुआ।</p>'}
            
            <h4 style="color:#ef4444; margin:20px 0 10px 0; border-bottom:1px solid #233565; padding-bottom:5px;">✖ Wrong Answers (${incorrect})</h4>
            ${incorrectHTML || '<p style="color:#8da2bb; font-size:12px;">कोई गलत प्रश्न नहीं है।</p>'}
            
            <h4 style="color:#8da2bb; margin:20px 0 10px 0; border-bottom:1px solid #233565; padding-bottom:5px;">⚪ Not Attempted (${unattempted})</h4>
            ${unattemptedHTML || '<p style="color:#8da2bb; font-size:12px;">सभी प्रश्नों के उत्तर दिए गए हैं।</p>'}
        </div>

        <h3 style="color:var(--gold); margin-bottom:15px;">📌 Your Bookmarked Questions</h3>
        <div style="background:#1c2541; border-radius:12px; padding:15px; border:1px solid #233565; margin-bottom:30px;">
            ${bookmarkHTML || '<p style="color:#8da2bb; font-size:12px;">इस टेस्ट में आपने कोई भी प्रश्न बुकमार्क नहीं किया था।</p>'}
        </div>

        <button onclick="loadHomeScreen(true)" style="width:100%; background:var(--gold); color:#000; border:none; padding:14px; border-radius:8px; font-weight:bold; font-size:15px; cursor:pointer; margin-bottom:30px;">➔ मुख्य स्क्रीन पर वापस जाएँ</button>
    `;
}

window.addEventListener('popstate', function(event) {
    if (currentState.page === 'cbt_test') {
        if (confirm("क्या आप सच में टेस्ट छोड़ना चाहते हैं? आपका प्रोग्रेस सेव नहीं होगा।")) {
            clearInterval(testTimer);
            loadHomeScreen(false);
        } else {
            history.pushState(null, null, window.location.pathname);
        }
        return;
    }

    if (event.state) {
        if (event.state.page === 'home') loadHomeScreen(false);
        else if (event.state.page === 'options') selectPaper(event.state.paper, false);
        else if (event.state.page === 'section') goToSection(event.state.section, false);
    } else {
        loadHomeScreen(false);
    }
});

// ऐप की शुरुआत
loadHomeScreen(false);
