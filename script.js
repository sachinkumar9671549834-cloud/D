// ऐप का शुरुआती स्टेट सेट करना
let currentState = { page: 'home', paper: '' };

// ऐप लोड होते ही हिस्ट्री में पहला स्टेट डालना ताकि बैक बटन तुरंत काम करे
if (history.state === null) {
    history.replaceState({ page: 'home' }, '');
}

function loadHomeScreen(updateHistory = true) {
    currentState = { page: 'home', paper: '' };
    
    if (updateHistory) {
        history.pushState({ page: 'home' }, '');
    }

    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="app-title">INDIAN ARMY</div>
        <div class="app-subtitle">AGNIVEER EXAM PORTAL 2026</div>

        <!-- विकल्प 1: Army Agniveer GD -->
        <div class="paper-card" id="card-GD" onclick="selectPaper('GD')">
            <div class="icon-badge">GD</div>
            <div style="flex-grow: 1;">
                <h3 style="margin: 0; font-size: 16px;">Army Agniveer GD</h3>
                <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 12px;">Full Mock, Subjects, Syllabus</p>
            </div>
            <div style="color: var(--gold); font-size: 14px;">चुनें ➔</div>
        </div>

        <!-- विकल्प 2: Army Agniveer Tradesman -->
        <div class="paper-card" id="card-TM" onclick="selectPaper('Tradesman')">
            <div class="icon-badge">TM</div>
            <div style="flex-grow: 1;">
                <h3 style="margin: 0; font-size: 16px;">Army Agniveer Tradesman</h3>
                <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 12px;">8th & 10th पास विशेष टेस्ट</p>
            </div>
            <div style="color: var(--gold); font-size: 14px;">चुनें ➔</div>
        </div>

        <!-- विकल्प 3: Army Agniveer Technical -->
        <div class="paper-card" id="card-TECH" onclick="selectPaper('Technical')">
            <div class="icon-badge">TECH</div>
            <div style="flex-grow: 1;">
                <h3 style="margin: 0; font-size: 16px;">Army Agniveer Technical</h3>
                <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 12px;">PCM और टेक्निकल विशेष टेस्ट</p>
            </div>
            <div style="color: var(--gold); font-size: 14px;">चुनें ➔</div>
        </div>
    `;
}

function selectPaper(paperType, updateHistory = true) {
    currentState = { page: 'options', paper: paperType };
    
    if (updateHistory) {
        history.pushState({ page: 'options', paper: paperType }, '');
    }

    const app = document.getElementById('app');
    
    let displayName = `Army Agniveer ${paperType}`;
    let badgeText = paperType === 'GD' ? 'GD' : paperType === 'Tradesman' ? 'TM' : 'TECH';
    let subText = paperType === 'GD' ? 'Full Mock, Subjects, Syllabus' : paperType === 'Tradesman' ? '8th & 10th पास विशेष टेस्ट' : 'PCM और टेक्निकल विशेष टेस्ट';

    app.innerHTML = `
        <div class="paper-card active" style="cursor: default; margin-top: 10px;">
            <div class="icon-badge">${badgeText}</div>
            <div style="flex-grow: 1;">
                <h3 style="margin: 0; font-size: 16px;">${displayName}</h3>
                <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 12px;">${subText}</p>
            </div>
        </div>

        <div class="options-grid">
            <div class="opt-box" onclick="goToSection('Mock Test')">
                <div class="opt-icon">📝</div>
                <div class="opt-title">Mock Test</div>
            </div>
            <div class="opt-box" onclick="goToSection('Prev. Paper')">
                <div class="opt-icon">📚</div>
                <div class="opt-title">Prev. Paper</div>
            </div>
            <div class="opt-box" onclick="goToSection('Subject Mock')">
                <div class="opt-icon">🎯</div>
                <div class="opt-title">Subject Mock</div>
            </div>
            <div class="opt-box" onclick="goToSection('Syllabus')">
                <div class="opt-icon">📋</div>
                <div class="opt-title">Syllabus</div>
            </div>
        </div>
    `;
}

function goToSection(sectionName, updateHistory = true) {
    const paperType = currentState.paper;
    currentState = { page: 'section', paper: paperType, section: sectionName };
    
    if (updateHistory) {
        history.pushState({ page: 'section', paper: paperType, section: sectionName }, '');
    }

    const app = document.getElementById('app');
    let displayName = `Army Agniveer ${paperType}`;
    
    let html = `
        <h2 style="color: var(--gold); margin: 15px 0 15px 0; font-size: 18px;">${displayName} - ${sectionName}</h2>
    `;

    if (sectionName === 'Subject Mock') {
        html += `
            <p style="color: var(--text-muted); font-size: 13px;">जिस विषय का टेस्ट देना है उस पर क्लिक करें:</p>
            <div class="list-container">
                <div class="list-item" onclick="alert('सामान्य ज्ञान टेस्ट शुरू हो रहा है...')">1. सामान्य ज्ञान (General Knowledge)</div>
                <div class="list-item" onclick="alert('सामान्य विज्ञान टेस्ट शुरू हो रहा है...')">2. सामान्य विज्ञान (General Science)</div>
                <div class="list-item" onclick="alert('गणित टेस्ट शुरू हो रहा है...')">3. गणित (Mathematics)</div>
                <div class="list-item" onclick="alert('रीजनिंग टेस्ट शुरू हो रहा है...')">4. रीजनिंग (Logical Reasoning)</div>
            </div>
        `;
    } else if (sectionName === 'Mock Test') {
        html += `
            <div class="list-container">
                <div class="list-item" onclick="alert('Full Mock Test 1 लोड हो रहा है...')">🚀 Full Mock Test - 01 (50 प्रश्न)</div>
                <div class="list-item" onclick="alert('Full Mock Test 2 लोड हो रहा है...')">🚀 Full Mock Test - 02 (50 प्रश्न)</div>
            </div>
        `;
    } else if (sectionName === 'Prev. Paper') {
        html += `
            <div class="list-container">
                <div class="list-item" onclick="alert('Original Paper लोड हो रहा है...')">📄 Original Paper (2024)</div>
            </div>
        `;
    } else if (sectionName === 'Syllabus') {
        html += `
            <div style="background: var(--card-bg); padding: 15px; border-radius: 12px; font-size: 14px; line-height: 1.6; border: 1px solid #233565;">
                <b style="color: var(--gold);">परीक्षा पैटर्न:</b><br>
                • कुल प्रश्न: 50 | कुल अंक: 100<br>
                • नेगेटिव मार्किंग: लागू
            </div>
        `;
    }

    app.innerHTML = html;
}

// 📱 फोन के असली बैक बटन को ट्रैक करने का सबसे तगड़ा लॉजिक
window.addEventListener('popstate', function(event) {
    if (event.state) {
        if (event.state.page === 'home') {
            loadHomeScreen(false);
        } else if (event.state.page === 'options') {
            selectPaper(event.state.paper, false);
        } else if (event.state.page === 'section') {
            goToSection(event.state.section, false);
        }
    } else {
        loadHomeScreen(false);
    }
});

// पहली बार बिना हिस्ट्री बिगाड़े होम स्क्रीन लोड करना
loadHomeScreen(false);
