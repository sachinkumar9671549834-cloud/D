let currentPaper = ''; 

function loadHomeScreen() {
    currentPaper = '';
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="app-title">INDIAN ARMY</div>
        <div class="app-subtitle">AGNIVEER EXAM PORTAL 2026</div>

        <!-- डिब्बा 1: Agniveer GD -->
        <div class="paper-card" id="card-GD" onclick="toggleOptions('GD')">
            <div class="icon-badge">GD</div>
            <div style="flex-grow: 1;">
                <h3 style="margin: 0; font-size: 16px;">Agniveer GD Paper</h3>
                <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 12px;">Full Mock, Subjects, Syllabus</p>
            </div>
            <div style="color: var(--gold); font-size: 14px;">चुनें ➔</div>
        </div>

        <!-- डिब्बा 2: Agniveer Tradesman -->
        <div class="paper-card" id="card-TM" onclick="toggleOptions('Tradesman')">
            <div class="icon-badge">TM</div>
            <div style="flex-grow: 1;">
                <h3 style="margin: 0; font-size: 16px;">Agniveer Tradesman Paper</h3>
                <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 12px;">8th & 10th पास स्पेशल टेस्ट</p>
            </div>
            <div style="color: var(--gold); font-size: 14px;">चुनें ➔</div>
        </div>

        <!-- ग्रिड ऑप्शन्स यहाँ लोड होंगे -->
        <div id="options-grid-placeholder"></div>
    `;
}

// डिब्बे पर क्लिक करने पर नीचे 4 ऑप्शन्स खोलने का लॉजिक
function toggleOptions(paperType) {
    currentPaper = paperType;
    
    // एक्टिव डिब्बे का बॉर्डर चेंज करना
    document.querySelectorAll('.paper-card').forEach(card => card.classList.remove('active'));
    document.getElementById(`card-${paperType}`).classList.add('active');

    // 44322.jpg जैसे 4 मुख्य बॉक्स रेंडर करना
    const placeholder = document.getElementById('options-grid-placeholder');
    placeholder.innerHTML = `
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
    
    // स्क्रीन को थोड़ा नीचे स्क्रॉल करना ताकि ऑप्शन्स दिखने लगें
    placeholder.scrollIntoView({ behavior: 'smooth' });
}

// अंदर के सेक्शन्स की स्क्रीन खोलना
function goToSection(sectionName) {
    const app = document.getElementById('app');
    
    let html = `
        <button class="back-btn" onclick="loadHomeScreen()">⬅ होम स्क्रीन पर जाएँ</button>
        <h2 style="color: var(--gold); margin: 5px 0 15px 0; font-size: 18px;">Agniveer ${currentPaper} - ${sectionName}</h2>
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
                <div class="list-item" onclick="alert('Full Mock Test 3 लोड हो रहा है...')">🚀 Full Mock Test - 03 (50 प्रश्न)</div>
            </div>
        `;
    } else if (sectionName === 'Prev. Paper') {
        html += `
            <div class="list-container">
                <div class="list-item" onclick="alert('Original Paper 2024 डाउनलोड/शुरू हो रहा है...')">📄 Agniveer Original Paper (2024)</div>
                <div class="list-item" onclick="alert('Original Paper 2023 डाउनलोड/शुरू हो रहा है...')">📄 Agniveer Original Paper (2023)</div>
            </div>
        `;
    } else if (sectionName === 'Syllabus') {
        html += `
            <div style="background: var(--card-bg); padding: 15px; border-radius: 12px; font-size: 14px; line-height: 1.6; border: 1px solid #233565;">
                <b style="color: var(--gold);">परीक्षा पैटर्न:</b><br>
                • कुल प्रश्न: 50 | कुल अंक: 100<br>
                • पासिंग मार्क्स: 35<br>
                • नेगेटिव मार्किंग: 0.5 अंक<br><br>
                <b style="color: var(--gold);">विषय विवरण:</b><br>
                GK (15 प्रश्न), Science (15 प्रश्न), Maths (15 प्रश्न), Reasoning (5 प्रश्न)
            </div>
        `;
    }

    app.innerHTML = html;
}

// ऐप शुरू करें
loadHomeScreen();
