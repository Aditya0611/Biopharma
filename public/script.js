// ============================================================
// BioPharma AI — script.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initReveal();
    initParticles();
    initCountUp();
    initChart();
    initMolecular();
    updateDiagnostics();
    initClinicTimer();
});

// ====== NAV ======
function initNav() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Burger Menu Logic
    const burger = document.getElementById('navBurger');
    const links = document.querySelector('.nav-links');
    if (burger && links) {
        burger.addEventListener('click', () => {
            links.classList.toggle('active');
            burger.innerHTML = links.classList.contains('active') ? '&times;' : '&#9776;';
        });

        // Close menu on link click
        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('active');
                burger.innerHTML = '&#9776;';
            });
        });
    }
}

// ====== REVEAL ANIMATION ======
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('active'), i * 80);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ====== PARTICLE CANVAS ======
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw connections
        particles.forEach((p, i) => {
            particles.slice(i + 1).forEach(q => {
                const dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100,255,218,${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            });
        });
        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100,255,218,${p.alpha})`;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        animId = requestAnimationFrame(draw);
    }
    draw();
}

// ====== COUNT-UP ======
function initCountUp() {
    const nums = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseInt(el.dataset.target, 10);
            let current = 0;
            const step = target / 60;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = Math.floor(current);
            }, 20);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });
    nums.forEach(n => observer.observe(n));
}

// ====== MODULE 1: CLINICAL WORKFLOW CHAT ======
const workflowMessages = [
    { type: 'user-msg', text: '📋 New patient intake: Sarah J., 67F, chest pain, history of HTN.' },
    { type: 'agent', text: '🤖 ClinicalOps AI: Analyzing patient profile... Triage Class: URGENT (Red). Routing to Cardiology.' },
    { type: 'agent', text: '📅 Scheduling Dr. Mehta (next available: 2:30 PM). Sending confirmation SMS to patient.' },
    { type: 'agent', text: '🔄 Notified: ICU Bed 4 reserved. Lab orders (Troponin, ECG) auto-generated. EHR updated.' },
    { type: 'system', text: '✅ Workflow complete in 1.2s — 0 human steps required.' }
];

let workflowRunning = false;

window.triggerWorkflow = function () {
    if (workflowRunning) return;
    workflowRunning = true;
    const btn = document.getElementById('triggerWorkflow');
    btn.disabled = true;
    btn.textContent = '⏳ Running...';
    const win = document.getElementById('chatWindow');

    // Add typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-msg typing';
    typing.textContent = '🤖 Agent initializing workflow...';
    win.appendChild(typing);
    win.scrollTop = win.scrollHeight;

    workflowMessages.forEach((msg, i) => {
        setTimeout(() => {
            typing.remove();
            const div = document.createElement('div');
            div.className = `chat-msg ${msg.type}`;
            div.textContent = msg.text;
            win.appendChild(div);
            win.scrollTop = win.scrollHeight;
            if (i < workflowMessages.length - 1) {
                const t2 = document.createElement('div');
                t2.className = 'chat-msg typing';
                t2.textContent = '🤖 Processing next step...';
                win.appendChild(t2);
                win.scrollTop = win.scrollHeight;
                setTimeout(() => t2.remove(), 700);
            }
        }, (i + 1) * 1200);
    });

    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = '▶ Trigger Workflow';
        workflowRunning = false;
    }, (workflowMessages.length + 1) * 1200);
};

window.resetChat = function () {
    const win = document.getElementById('chatWindow');
    win.innerHTML = '<div class="chat-msg system">🏥 System ready. Awaiting task...</div>';
    workflowRunning = false;
    const btn = document.getElementById('triggerWorkflow');
    btn.disabled = false;
    btn.textContent = '▶ Trigger Workflow';
};

// ====== MODULE 2: PATIENT DATA CHART ======
function initChart() {
    const svg = document.getElementById('chartBars');
    if (!svg) return;

    const data = [
        { q: 'Q1', rec: 68, risk: 42, insight: '📈 Q1: Recovery at 68%. Risk score 42% — stable cohort. No interventions triggered.' },
        { q: 'Q2', rec: 74, risk: 38, insight: '📊 Q2: +6% recovery improvement. AI detected early-onset risk reduction post new protocol.' },
        { q: 'Q3', rec: 71, risk: 55, insight: '⚠️ Q3: Risk spike to 55%. Agent flagged 23 patients for proactive outreach — readmissions reduced 18%.' },
        { q: 'Q4', rec: 82, risk: 30, insight: '✅ Q4: Best quarter — 82% recovery, 30% risk. AI-driven diet + medication adherence program effective.' },
        { q: 'Q5', rec: 79, risk: 35, insight: '🔮 Q5: Slight dip. Agent suggests reviewing discharge criteria — model retrained on new data.' },
        { q: 'Q6', rec: 88, risk: 22, insight: '🏆 Q6: Peak performance — 88% recovery, 22% risk. Predictive intervention model at 94% accuracy.' }
    ];

    const W = 340, H = 140, BAR_W = 12, GAP = 57, START_X = 23;
    const tooltip = document.getElementById('chartTooltip');
    const insightText = document.getElementById('insightText');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            data.forEach((d, i) => {
                const x = START_X + i * GAP;
                const recH = (d.rec / 100) * H;
                const riskH = (d.risk / 100) * H;

                // Recovery bar
                const r1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r1.setAttribute('x', x);
                r1.setAttribute('y', H);
                r1.setAttribute('width', BAR_W);
                r1.setAttribute('height', 0);
                r1.setAttribute('rx', 3);
                r1.setAttribute('fill', '#64ffda');
                r1.setAttribute('opacity', '0.85');
                r1.setAttribute('cursor', 'pointer');
                r1.style.transition = `y 0.8s ${i * 0.1}s ease, height 0.8s ${i * 0.1}s ease`;
                svg.appendChild(r1);
                setTimeout(() => { r1.setAttribute('y', H - recH); r1.setAttribute('height', recH); }, 100);

                // Risk bar
                const r2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                r2.setAttribute('x', x + BAR_W + 2);
                r2.setAttribute('y', H);
                r2.setAttribute('width', BAR_W);
                r2.setAttribute('height', 0);
                r2.setAttribute('rx', 3);
                r2.setAttribute('fill', '#00d2ff');
                r2.setAttribute('opacity', '0.7');
                r2.setAttribute('cursor', 'pointer');
                r2.style.transition = `y 0.8s ${i * 0.1 + 0.05}s ease, height 0.8s ${i * 0.1 + 0.05}s ease`;
                svg.appendChild(r2);
                setTimeout(() => { r2.setAttribute('y', H - riskH); r2.setAttribute('height', riskH); }, 100);

                // Hover
                [r1, r2].forEach(rect => {
                    rect.addEventListener('mouseenter', (ev) => {
                        const parentRect = document.getElementById('patientChart').closest('.chart-container').getBoundingClientRect();
                        const svgRect = document.getElementById('patientChart').getBoundingClientRect();
                        tooltip.style.left = (svgRect.left - parentRect.left + parseInt(rect.getAttribute('x'))) + 'px';
                        tooltip.style.top = '0px';
                        tooltip.textContent = `${d.q}: Recovery ${d.rec}% | Risk ${d.risk}%`;
                        tooltip.style.opacity = '1';
                        insightText.textContent = d.insight;
                    });
                    rect.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
                });
            });
            observer.unobserve(e.target);
        });
    }, { threshold: 0.3 });
    observer.observe(document.getElementById('patientChart'));
}

// ====== MODULE 3: MOLECULAR SIMULATION ======
const molNodes = [
    { x: 50, y: 50, color: '' },
    { x: 80, y: 30, color: 'blue' },
    { x: 80, y: 70, color: 'red' },
    { x: 110, y: 50, color: '' },
    { x: 140, y: 30, color: 'purple' },
    { x: 140, y: 70, color: 'blue' },
    { x: 170, y: 50, color: 'red' },
    { x: 200, y: 30, color: '' },
    { x: 200, y: 70, color: 'purple' },
    { x: 230, y: 50, color: '' },
    { x: 260, y: 35, color: 'blue' },
    { x: 260, y: 65, color: 'red' },
];
const molEdges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [6, 7], [6, 8], [7, 9], [8, 9], [9, 10], [9, 11]];

function initMolecular() {
    const canvas = document.getElementById('molCanvas');
    if (!canvas) return;

    // SVG
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('class', 'mol-svg');
    svgEl.setAttribute('viewBox', '0 0 300 100');
    canvas.appendChild(svgEl);

    molEdges.forEach(([a, b]) => {
        const na = molNodes[a], nb = molNodes[b];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', na.x); line.setAttribute('y1', na.y);
        line.setAttribute('x2', nb.x); line.setAttribute('y2', nb.y);
        line.setAttribute('stroke', 'rgba(100,255,218,0.25)');
        line.setAttribute('stroke-width', '1.5');
        svgEl.appendChild(line);
    });

    // Nodes
    molNodes.forEach(n => {
        const div = document.createElement('div');
        div.className = `mol-node ${n.color}`;
        div.style.left = `${(n.x / 300) * 100}%`;
        div.style.top = `${(n.y / 100) * 100}%`;
        canvas.appendChild(div);
    });
}

let molRunning = false;
let molInterval = null;
window.runExploration = function () {
    if (molRunning) return;
    molRunning = true;
    const nodes = document.querySelectorAll('.mol-node');
    nodes.forEach(n => n.classList.add('active'));

    // Animate stats
    const compEl = document.getElementById('molCompounds');
    const hitsEl = document.getElementById('molHits');
    const scoreEl = document.getElementById('molScore');
    let comp = 4218, steps = 0;
    molInterval = setInterval(() => {
        comp += Math.floor(Math.random() * 180 + 60);
        const hits = Math.floor(12 + steps * 0.8);
        const score = (87.4 + steps * 0.15).toFixed(1);
        compEl.textContent = comp.toLocaleString();
        hitsEl.textContent = hits;
        scoreEl.textContent = score + '%';
        steps++;
        if (steps >= 20) {
            clearInterval(molInterval);
            nodes.forEach(n => n.classList.remove('active'));
            molRunning = false;
        }
    }, 200);
};

// ====== MODULE 4: AI DOCUMENTATION ======
const emrText = `PATIENT: Jatin Patel | DOB: 1967-03-14 | MRN: JP-20240314
ENCOUNTER DATE: 2026-02-22

CHIEF COMPLAINT:
Chest pain × 3 days, radiation to left arm.

HISTORY OF PRESENT ILLNESS:
58M with PMHx of HTN and DM Type 2 presenting with acute onset chest pain. Pain is 8/10, substernal, radiating to left arm. Associated with diaphoresis.

VITAL SIGNS:
BP: 152/94 | HR: 88 bpm | SpO2: 97% RA

CURRENT MEDICATIONS:
• Metformin 1000mg PO BID
• Lisinopril 10mg PO OD

ECG FINDINGS:
ST elevation in leads II, III, aVF — consistent with inferior STEMI.

ASSESSMENT & PLAN:
1. Inferior STEMI — URGENT cath lab activation initiated
2. Aspirin 325mg PO STAT ordered
3. Cardiology consult placed — Dr. Mehta paged
4. Troponin, CBC, BMP ordered STAT
5. Patient NPO pending procedural intervention

AI CONFIDENCE: 97.3% | Generated in 1.2s`;

let docTyping = false;
window.generateDoc = function () {
    if (docTyping) return;
    docTyping = true;
    const emrEl = document.getElementById('docEmr');
    emrEl.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
        emrEl.textContent += emrText[i];
        emrEl.scrollTop = emrEl.scrollHeight;
        i++;
        if (i >= emrText.length) { clearInterval(timer); docTyping = false; }
    }, 18);
};

// ====== MODULE 5: PREDICTIVE DIAGNOSTICS ======
window.updateDiagnostics = function () {
    const age = parseInt(document.getElementById('sliderAge').value, 10);
    const gluc = parseInt(document.getElementById('sliderGluc').value, 10);
    const bp = parseInt(document.getElementById('sliderBp').value, 10);

    document.getElementById('ageVal').textContent = age;
    document.getElementById('glucVal').textContent = gluc;
    document.getElementById('bpVal').textContent = bp;

    // Score formula (heuristic)
    const ageFactor = (age - 20) / 70 * 30;
    const glucFactor = (gluc - 70) / 330 * 35;
    const bpFactor = (bp - 90) / 110 * 35;
    const score = Math.min(98, Math.round(ageFactor + glucFactor + bpFactor));

    document.getElementById('meterFill').style.width = score + '%';
    document.getElementById('meterPct').textContent = score + '%';

    let verdict, color;
    if (score < 30) {
        verdict = '✅ Low Risk — Continue routine monitoring';
        color = '#64ffda';
    } else if (score < 55) {
        verdict = '⚠️ Moderate Risk — Lifestyle intervention recommended';
        color = '#febc2e';
    } else if (score < 75) {
        verdict = '⚠️ High Risk — Urgent cardiology referral recommended';
        color = '#ff9f43';
    } else {
        verdict = '🚨 Critical Risk — Immediate hospital evaluation required';
        color = '#ff6b9d';
    }

    document.getElementById('meterVerdict').textContent = verdict;
    document.getElementById('meterFill').style.background =
        `linear-gradient(90deg, ${color}, ${color}aa)`;
    document.getElementById('meterPct').style.color = color;
};

// ====== MODULE 6: SECURITY VAULT ======
let auditRunning = false;
window.auditNow = function () {
    if (auditRunning) return;
    auditRunning = true;
    const icon = document.getElementById('vaultIcon');
    const bars = document.querySelectorAll('.vault-bar');
    const badges = document.querySelectorAll('.vault-badges .badge');

    // Reset
    bars.forEach(b => { b.style.width = '0%'; b.classList.remove('filled'); });
    badges.forEach(b => { b.style.opacity = '0'; });
    icon.classList.add('scanning');
    setTimeout(() => icon.classList.remove('scanning'), 1000);

    const barTargets = ['92%', '88%', '95%', '79%'];
    bars.forEach((bar, i) => {
        setTimeout(() => {
            bar.style.width = barTargets[i];
            bar.classList.add('filled');
        }, 600 + i * 400);
    });

    const badge = document.getElementById('hipaaBadge');
    if (badge) badge.style.opacity = '1';

    setTimeout(() => { auditRunning = false; }, 4000);
};

// ====== CLINICAL TIMER ======
let clinicSeconds = 0;
function initClinicTimer() {
    const timerEl = document.getElementById('clinicTimer');
    if (!timerEl) return;
    setInterval(() => {
        clinicSeconds++;
        const mins = Math.floor(clinicSeconds / 60).toString().padStart(2, '0');
        const secs = (clinicSeconds % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
}

// ====== COPY & EXPORT ======
function copyResponse(btn) {
    // New UI structure uses .assessment-entry and .assessment-content
    const entry = btn.closest('.assessment-entry');
    const content = entry.querySelector('.assessment-content');
    const text = content.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = originalText, 2000);
    });
}

function exportConsultation() {
    let output = `CLINICAL CONSULTATION SUMMARY\n`;
    output += `Date: ${new Date().toLocaleString()}\n`;
    output += `Duration: ${document.getElementById('clinicTimer').textContent}\n`;
    output += `-------------------------------------------\n\n`;

    aiHistory.forEach(msg => {
        if (msg.role === 'system') return;
        const role = msg.role === 'user' ? 'DOCTOR' : 'AI ASSISTANT';
        output += `[${role}]:\n${msg.content}\n\n`;
    });

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation_${new Date().getTime()}.txt`;
    a.click();
}

// ====== CLINICAL DECISION AI — OpenRouter ======
const OPENROUTER_API_KEY = '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';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Specialized Clinical System Prompt
const aiHistory = [
    {
        role: 'system',
        content: `You are a Senior Clinical Decision Support AI. 
Your goal is to assist doctors in diagnosing patients and suggesting medication plans.

When a doctor describes symptoms (via voice or text):
1. Provide a **Clinical Assessment Summary**.
2. Identify the most likely **Primary Diagnosis**.
3. Provide a list of **Differential Diagnoses** to consider.
4. Suggest a **Recommended Medication Plan** with specific generic names, typical dosages, and frequency.
5. Include a **Clinical Note** for further tests or warning signs.

Rules:
- Be precise, clinical, and structured.
- Use bold headers.
- Always include a disclaimer that this is a suggestion and the physician must verify all doses.`
    }
];

// ====== REAL-TIME ENTITY EXTRACTION ======
const VITAL_PATTERNS = [
    /\bBP\s*[\d/]+/gi, /\bblood pressure\s*[\d/]+/gi,
    /\bHR\s*\d+/gi, /\bheart rate\s*\d+/gi, /\bpulse\s*\d+/gi,
    /\bSpO2\s*[\d%]+/gi, /\bO2 sat\s*[\d%]+/gi,
    /\bfever\s*[\d.]+[°℃℉]?[CF]?\b/gi, /\btemp\s*[\d.]+/gi,
    /\b(RR|respiratory rate)\s*\d+/gi,
    /\bBMI\s*[\d.]+/gi, /\bweight\s*\d+\s*(kg|lbs|lb)?/gi,
];
const SYMPTOM_KEYWORDS = [
    'chest pain', 'shortness of breath', 'dyspnoea', 'dyspnea', 'fatigue', 'nausea', 'vomiting',
    'diarrhoea', 'diarrhea', 'constipation', 'headache', 'dizziness', 'syncope', 'palpitations',
    'cough', 'fever', 'chills', 'sweating', 'diaphoresis', 'back pain', 'abdominal pain',
    'joint pain', 'oedema', 'edema', 'swelling', 'rash', 'confusion', 'incontinence',
    'weight loss', 'weight gain', 'cold intolerance', 'hair loss', 'xerosis', 'dry skin',
    'ear pain', 'sore throat', 'hearing loss', 'blurred vision', 'eye pain', 'hematuria',
    'discharge', 'jaundice', 'pallor', 'cyanosis', 'tinnitus', 'dehydration',
    'pain', 'ache', 'sore', 'burning', 'numbness', 'tingling', 'weakness', 'stiffness'
];
const RISK_PATTERNS = [
    /\b(STEMI|MI|heart attack)\b/gi, /\bstroke\b/gi, /\bsepsis\b/gi,
    /\bDKA\b/gi, /\bdiabetic ketoacidosis\b/gi, /\banaphylaxis\b/gi,
    /\bpulmonary embolism\b/gi, /\bPE\b/gi, /\brespiratory failure\b/gi,
    /\bacute kidney\b/gi, /\bAKI\b/gi, /\bhaemorrhage\b/gi, /\bhemorrhage\b/gi,
    /\bcritical\b/gi, /\burgent\b/gi, /\bsevere\b/gi, /\bmassive\b/gi,
    /\bHTN\b/gi, /\bhypertension\b/gi, /\bDM\b/gi, /\bdiabetes\b/gi,
    /\bCOPD\b/gi, /\basthma\b/gi, /\batrial fibrillation\b/gi, /\bAF\b/gi,
    /\bTIA\b/gi, /\bCHF\b/gi, /\bheart failure\b/gi, /\bCKD\b/gi,
];
const MED_KEYWORDS = [
    'metformin', 'lisinopril', 'amlodipine', 'atorvastatin', 'aspirin', 'warfarin',
    'heparin', 'enoxaparin', 'metoprolol', 'atenolol', 'bisoprolol', 'ramipril',
    'clopidogrel', 'furosemide', 'spironolactone', 'omeprazole', 'pantoprazole',
    'paracetamol', 'ibuprofen', 'diclofenac', 'amoxicillin', 'azithromycin',
    'ciprofloxacin', 'dexamethasone', 'prednisolone', 'insulin', 'salbutamol',
    'morphine', 'tramadol', 'ondansetron', 'metoclopramide', 'lorazepam',
    'medicine', 'medication', 'prescription', 'pill', 'tablet'
];

// Session-long clinical memory
const sessionEntities = {
    vitals: new Set(),
    symptoms: new Set(),
    risks: new Set(),
    meds: new Set()
};

function extractLiveInsights(text) {
    const lower = text.toLowerCase();

    // Vitals
    VITAL_PATTERNS.forEach(pat => {
        const m = text.match(pat);
        if (m) m.forEach(v => sessionEntities.vitals.add(v.trim()));
    });

    // Symptoms
    SYMPTOM_KEYWORDS.forEach(kw => {
        if (lower.includes(kw)) sessionEntities.symptoms.add(kw);
    });

    // Risks
    RISK_PATTERNS.forEach(pat => {
        const m = text.match(pat);
        if (m) m.forEach(r => sessionEntities.risks.add(r.trim()));
    });

    // Meds
    MED_KEYWORDS.forEach(kw => {
        if (lower.includes(kw)) sessionEntities.meds.add(kw);
    });

    renderInsightChips('vitalChips', [...sessionEntities.vitals], 'node-chip-vital');
    renderInsightChips('symptomChips', [...sessionEntities.symptoms], 'node-chip-symptom');
    renderInsightChips('riskChips', [...sessionEntities.risks], 'node-chip-risk');
    renderInsightChips('medChips', [...sessionEntities.meds], 'node-chip-med');

    const total = sessionEntities.vitals.size + sessionEntities.symptoms.size + sessionEntities.risks.size + sessionEntities.meds.size;
    const badge = document.getElementById('insightsBadge');
    if (badge) {
        badge.textContent = total > 0 ? `${total} ENTITIES` : 'LISTENING';
        badge.style.background = total > 0 ? 'rgba(0, 210, 255, 0.2)' : 'rgba(100, 255, 218, 0.1)';
        badge.style.color = total > 0 ? 'var(--accent)' : 'var(--secondary)';
    }
}

function renderInsightChips(containerId, items, chipClass) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (items.length === 0) {
        el.innerHTML = '<span class="node-empty">AWAITING DATA...</span>';
        return;
    }
    el.innerHTML = items.map(i =>
        `<span class="node-chip ${chipClass}">${i}</span>`
    ).join('');
}

function setInsightStatus(text, pulsing = false) {
    const orb = document.getElementById('insightOrb');
    const statusEl = document.getElementById('insightStatusText');
    if (statusEl) statusEl.textContent = text;
    if (orb) orb.classList.toggle('pulsing', pulsing);
}

function clearInsights() {
    sessionEntities.vitals.clear();
    sessionEntities.symptoms.clear();
    sessionEntities.risks.clear();
    sessionEntities.meds.clear();

    ['vitalChips', 'symptomChips', 'riskChips', 'medChips'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<span class="node-empty">AWAITING DATA...</span>';
    });
    const badge = document.getElementById('insightsBadge');
    if (badge) {
        badge.textContent = 'LISTENING';
        badge.style.background = 'rgba(100, 255, 218, 0.1)';
        badge.style.color = 'var(--secondary)';
    }
    setInsightStatus('IDLE', false);
}

// ====== VOICE RECOGNITION + VAD ======
let recognition;
let isRecording = false;
let vadTimer = null;          // VAD silence timer
let accumulatedText = '';     // Running transcript this session

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecording = true;
        updateMicUI(true);
        setInsightStatus('Listening…', false);
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        const transcriptEl = document.getElementById('transcriptText');
        const inputEl = document.getElementById('aiInput');

        if (finalTranscript) {
            accumulatedText += finalTranscript + ' ';
            inputEl.value = accumulatedText.trim();
            if (transcriptEl) {
                transcriptEl.classList.add('has-content');
                transcriptEl.textContent = accumulatedText.trim();
            }
        } else if (interimTranscript && transcriptEl) {
            transcriptEl.textContent = accumulatedText + interimTranscript;
        }

        // Real-time entity extraction on combined text
        const liveText = accumulatedText + interimTranscript;
        extractLiveInsights(liveText);

        // VAD: reset silence timer on every speech event
        const vadEnabled = document.getElementById('vadToggle')?.checked;
        if (vadEnabled) {
            clearTimeout(vadTimer);
            setInsightStatus('Detecting speech…', false);
            vadTimer = setTimeout(() => {
                if (isRecording && accumulatedText.trim().length > 10) {
                    setInsightStatus('Silence detected — sending to AI…', true);
                    document.getElementById('voiceStatusText').textContent = '⚡ Auto-sending after silence…';
                    // Don't stop recording, just send and accumulate further
                    sendAiMessageFromVoice();
                }
            }, 1500);
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') stopRecording();
    };

    recognition.onend = () => {
        if (isRecording) {
            try { recognition.start(); } catch (e) { /* already running */ }
        }
    };
}

window.toggleVoice = function () {
    if (!recognition) {
        alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
        return;
    }
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
};

function startRecording() {
    accumulatedText = '';
    isRecording = true;
    recognition.start();
    document.getElementById('voiceStatusText').textContent = 'Listening to your clinical dictation…';
    document.getElementById('voiceBars').classList.add('active');
    setInsightStatus('Listening…', false);
    const transcriptEl = document.getElementById('transcriptText');
    if (transcriptEl) {
        transcriptEl.textContent = '';
        transcriptEl.classList.remove('has-content');
    }
}

function stopRecording() {
    isRecording = false;
    clearTimeout(vadTimer);
    recognition.stop();
    updateMicUI(false);
    document.getElementById('voiceStatusText').textContent = 'Transcription paused.';
    document.getElementById('voiceBars').classList.remove('active');
    setInsightStatus('Dictation complete.', false);

    const input = document.getElementById('aiInput');
    if (input.value.length > 10) {
        sendAiMessage();
    }
}

// Sends the current transcript to AI but keeps recording going (VAD mode)
async function sendAiMessageFromVoice() {
    const input = document.getElementById('aiInput');
    if (!input.value.trim() || isThinking) return;
    // Snapshot the text and clear for next utterance
    const snapshot = accumulatedText.trim();
    accumulatedText = '';
    input.value = '';
    await sendAiMessageWithText(snapshot);
}

function updateMicUI(active) {
    const btn = document.getElementById('micBtn');
    const icon = document.getElementById('micIcon');
    const label = document.getElementById('micLabel');
    if (!btn) return;
    if (active) {
        btn.classList.add('recording');
        icon.textContent = '⏹️';
        label.textContent = 'STOP DICTATION';
    } else {
        btn.classList.remove('recording');
        icon.textContent = '🎙️';
        label.textContent = 'START DICTATION';
    }
}


// Auto-resize textarea + live entity extraction as user types
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('aiInput');
    if (input) {
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
            if (input.value.length > 5) extractLiveInsights(input.value);
        });
    }
});

// Handle Enter key (send on Enter, newline on Shift+Enter)
window.handleAiKey = function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAiMessage();
    }
};

// Send a pre-filled suggestion
// Send a pre-filled suggestion from scenario cards
window.sendScenario = function (card) {
    const title = card.querySelector('.scenario-title')?.textContent.trim();
    const preview = card.querySelector('.scenario-preview')?.textContent.trim();
    const text = `${title}: ${preview}`;
    document.getElementById('aiInput').value = text;
    extractLiveInsights(text);
    sendAiMessage();
};

window.sendSuggestion = function (btn) {
    // Check if it's a card (new UI) or button (old logic fallback)
    const text = btn.querySelector('.scenario-preview')?.textContent.trim() || btn.textContent.trim();
    document.getElementById('aiInput').value = text;
    extractLiveInsights(text);
    sendAiMessage();
};

// Main send function — reads from input box
let isThinking = false;
window.sendAiMessage = async function () {
    const input = document.getElementById('aiInput');
    const text = input.value.trim();
    if (!text || isThinking) return;
    input.value = '';
    input.style.height = 'auto';
    await sendAiMessageWithText(text);
};

// Core send function — accepts text directly (used by both UI and VAD)
async function sendAiMessageWithText(userText) {
    if (isThinking || !userText) return;
    isThinking = true;

    const sendBtn = document.getElementById('aiSendBtn');
    const sendIcon = document.getElementById('aiSendIcon');
    const messagesEl = document.getElementById('aiMessages');
    const modelSelect = document.getElementById('aiModelSelect');
    const statusDot = document.getElementById('aiStatusDot');

    // Hide suggestions after first message
    const suggestions = document.getElementById('aiSuggestions');
    if (suggestions) suggestions.style.display = 'none';

    // Show user message
    appendMessage('user', userText, messagesEl);
    aiHistory.push({ role: 'user', content: userText });

    // Update insight sidebar state
    setInsightStatus('AI is analysing…', true);
    sendBtn.disabled = true;
    sendIcon.textContent = '⏳';
    statusDot.classList.add('loading');

    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'assessment-entry entry-bot';
    typingEl.id = 'aiTyping';
    typingEl.innerHTML = `
        <div class="assessment-header">
            <span class="entity-badge bot-badge">System AI</span>
            <span class="entry-time">Thinking...</span>
        </div>
        <div class="assessment-content">
            <div class="ai-typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>`;
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
        const response = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://biopharma-agent-demo.ai',
                'X-Title': 'BioPharma AI Program'
            },
            body: JSON.stringify({
                model: modelSelect.value,
                messages: aiHistory,
                stream: true,
                max_tokens: 600
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        // Remove typing indicator and create bot entry for streaming
        typingEl.remove();
        const botMsgEl = document.createElement('div');
        botMsgEl.className = 'assessment-entry entry-bot';
        botMsgEl.innerHTML = `
            <div class="assessment-header">
                <span class="entity-badge bot-badge">System AI</span>
                <span class="entry-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="assessment-content" id="streamContent"></div>
            <div class="assessment-footer" style="display:flex; gap:0.5rem; margin-top:5px;">
                <span class="copy-btn" onclick="copyResponse(this)" style="font-size:0.7rem; color:var(--secondary); cursor:pointer;">📋 Copy Report</span>
            </div>`;
        messagesEl.appendChild(botMsgEl);
        const streamBubble = botMsgEl.querySelector('#streamContent');

        // Parse SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') break;

                try {
                    const parsed = JSON.parse(data);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) {
                        fullText += delta;
                        // Use marked if available, otherwise fallback
                        if (window.marked) {
                            streamBubble.innerHTML = marked.parse(fullText);
                        } else {
                            streamBubble.textContent = fullText;
                        }
                        messagesEl.scrollTop = messagesEl.scrollHeight;
                    }
                } catch (_) { /* skip malformed chunk */ }
            }
        }

        // Save assistant reply to history and scan for insights
        if (fullText) {
            aiHistory.push({ role: 'assistant', content: fullText });
            extractLiveInsights(fullText); // Auto-extract from AI response
        }

    } catch (err) {
        typingEl.remove();
        const errEl = document.createElement('div');
        errEl.className = 'assessment-entry entry-bot';

        let errorMsg = err.message || 'Something went wrong.';
        if (errorMsg.includes('429')) {
            errorMsg = "<strong>Rate Limit Exceeded (429):</strong> The free AI model is currently busy. Please wait 60 seconds or switch to a different model from the selector above.";
        } else if (errorMsg.includes('404')) {
            errorMsg = "<strong>Model Not Found (404):</strong> This specific free model is currently offline or the ID has changed. Please switch to <b>'Auto-Select Free Model'</b> for best results.";
        }

        errEl.innerHTML = `
            <div class="assessment-header">
                <span class="entity-badge risk-badge" style="background:rgba(255,80,100,0.1); color:#ff5064;">System Error</span>
            </div>
            <div class="assessment-content" style="border-color:rgba(255,80,100,0.3); background:rgba(255,80,100,0.05); color:#ff5064;">
                ${errorMsg}
            </div>`;
        messagesEl.appendChild(errEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    } finally {
        isThinking = false;
        sendBtn.disabled = false;
        sendIcon.textContent = '➤';
        statusDot.classList.remove('loading');
        setInsightStatus('Response complete. Ready for next input.', false);
    }
}

// Append a message entry
function appendMessage(role, text, container) {
    const isUser = role === 'user';
    const div = document.createElement('div');
    div.className = `assessment-entry ${isUser ? 'entry-user' : 'entry-bot'}`;

    // Process text through marked for bots
    const content = (isUser || !window.marked) ? escapeHtml(text) : marked.parse(text);

    div.innerHTML = `
        <div class="assessment-header">
            <span class="entity-badge ${isUser ? 'user-badge' : 'bot-badge'}">${isUser ? 'Physician' : 'System AI'}</span>
            <span class="entry-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="assessment-content">${content}</div>
        ${!isUser ? `
        <div class="assessment-footer" style="display:flex; gap:0.5rem; margin-top:5px;">
            <span class="copy-btn" onclick="copyResponse(this)" style="font-size:0.7rem; color:var(--secondary); cursor:pointer;">📋 Copy</span>
        </div>` : ''}`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Clear chat history
window.clearAiChat = function () {
    const messagesEl = document.getElementById('aiMessages');
    messagesEl.innerHTML = `
        <div class="assessment-entry entry-bot">
            <div class="assessment-header">
                <span class="entity-badge bot-badge">System AI</span>
                <span class="entry-time">Session Started</span>
            </div>
            <div class="assessment-content">
                <strong>New consultation initialized.</strong> Describe your patient's symptoms or clinical history to begin real-time agentic analysis.
            </div>
        </div>`;
    aiHistory.splice(1);
    const suggestions = document.getElementById('aiSuggestions');
    if (suggestions) suggestions.style.display = 'flex';
    clearInsights();
    accumulatedText = '';
};

