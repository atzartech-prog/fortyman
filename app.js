// State variables
let userProfile = {
    name: "Sahabat Prima",
    gender: "male",
    age: 45,
    height: 165,
    weight: 68,
    activity: "light",
    focus: {
        joints: false,
        weight: false,
        heart: false,
        energy: false,
        sleep: false,
        bone: false
    }
};

let dailyLog = {
    date: getTodayString(),
    water: 0, // ml
    exercise: 0, // minutes
    habits: {
        sleep: false,
        veggies: false,
        stretch: false,
        nosugar: false
    },
    screening: {
        tensi: false,
        gula: false,
        kolesterol: false,
        mata: false
    }
};

let historyLogs = []; // Array of last 7 days dailyLogs
let currentTheme = 'dark';

// Timer state
let timerInterval = null;
let timerTimeLeft = 0;
let timerDuration = 0;
let timerIsPaused = false;
let currentWorkoutName = "";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initTheme();
    setupNavigation();
    setupForms();
    setupScreeningChecks();
    renderDashboard();
    renderHistoryChart();

    // Set welcome quote dynamically
    setDynamicWelcome();
});

// Get Date formatted YYYY-MM-DD
function getTodayString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// Load Data from LocalStorage
function loadData() {
    // 1. Load profile
    const savedProfile = localStorage.getItem("prima40_profile");
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        // Pre-fill profile inputs
        document.getElementById("inputNama").value = userProfile.name;
        document.getElementById("inputGender").value = userProfile.gender;
        document.getElementById("inputAge").value = userProfile.age;
        document.getElementById("inputActivity").value = userProfile.activity;
        document.getElementById("inputHeight").value = userProfile.height;
        document.getElementById("inputWeight").value = userProfile.weight;
        
        document.getElementById("focusJoints").checked = userProfile.focus.joints;
        document.getElementById("focusWeight").checked = userProfile.focus.weight;
        document.getElementById("focusHeart").checked = userProfile.focus.heart;
        document.getElementById("focusEnergy").checked = userProfile.focus.energy;
        document.getElementById("focusSleep").checked = userProfile.focus.sleep;
        document.getElementById("focusBone").checked = userProfile.focus.bone;

        // Perform calculation immediately to load results
        calculateHealth(false);
    }

    // 2. Load today's log
    const todayStr = getTodayString();
    const savedLog = localStorage.getItem("prima40_today_log");
    if (savedLog) {
        const parsed = JSON.parse(savedLog);
        if (parsed.date === todayStr) {
            dailyLog = parsed;
        } else {
            // New day: archive the old log to history if it isn't there already, then reset dailyLog
            archiveLog(parsed);
            dailyLog.date = todayStr;
            saveTodayLog();
        }
    } else {
        dailyLog.date = todayStr;
        saveTodayLog();
    }

    // 3. Load screening check statuses
    document.getElementById("checkTensi").checked = dailyLog.screening.tensi;
    document.getElementById("checkGula").checked = dailyLog.screening.gula;
    document.getElementById("checkKolesterol").checked = dailyLog.screening.kolesterol;
    document.getElementById("checkMata").checked = dailyLog.screening.mata;

    // 4. Load history
    const savedHistory = localStorage.getItem("prima40_history");
    if (savedHistory) {
        historyLogs = JSON.parse(savedHistory);
    } else {
        generateDummyHistory(); // Make the chart look interesting on first load
    }

    // Update habit checks in DOM
    document.getElementById("habitSleep").checked = dailyLog.habits.sleep;
    document.getElementById("habitVeggies").checked = dailyLog.habits.veggies;
    document.getElementById("habitStretch").checked = dailyLog.habits.stretch;
    document.getElementById("habitNoSugar").checked = dailyLog.habits.nosugar;
}

// Generate some sample data for the chart to show progression initially
function generateDummyHistory() {
    const days = [];
    const today = new Date();
    for (let i = 6; i > 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        
        days.push({
            date: dateStr,
            water: Math.floor(Math.random() * 1500) + 1000,
            exercise: Math.floor(Math.random() * 30) + 10,
            habits: {
                sleep: Math.random() > 0.3,
                veggies: Math.random() > 0.4,
                stretch: Math.random() > 0.5,
                nosugar: Math.random() > 0.3
            },
            screening: { tensi: true, gula: false, kolesterol: false, mata: false }
        });
    }
    historyLogs = days;
    localStorage.setItem("prima40_history", JSON.stringify(historyLogs));
}

// Save Today's Log
function saveTodayLog() {
    localStorage.setItem("prima40_today_log", JSON.stringify(dailyLog));
}

// Archive a log into history
function archiveLog(logToArchive) {
    // Check if we already have this date in history to prevent duplicates
    const exists = historyLogs.some(item => item.date === logToArchive.date);
    if (!exists) {
        historyLogs.push(logToArchive);
        // Keep only last 14 days
        if (historyLogs.length > 14) {
            historyLogs.shift();
        }
        localStorage.setItem("prima40_history", JSON.stringify(historyLogs));
    }
}

// Theme Handling
function initTheme() {
    const savedTheme = localStorage.getItem("prima40_theme");
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        currentTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? 'light' : 'dark';
    }
    applyTheme();

    document.getElementById("themeToggleBtn").addEventListener("click", () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme();
        localStorage.setItem("prima40_theme", currentTheme);
        showToast(`Tema diubah ke mode ${currentTheme === 'dark' ? 'Gelap' : 'Terang'}`);
    });
}

function applyTheme() {
    const sunIcon = document.querySelector(".sun-icon");
    const moonIcon = document.querySelector(".moon-icon");
    
    if (currentTheme === 'light') {
        document.body.classList.add("light-theme");
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
    } else {
        document.body.classList.remove("light-theme");
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
    }
    // Re-draw chart on theme change to adjust colors
    renderHistoryChart();
}

// Navigation Tab Switching
function setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetSection = btn.getAttribute("data-target");
            switchTab(targetSection);
        });
    });
}

function switchTab(targetId) {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Active button toggle
    document.querySelectorAll(".nav-btn").forEach(b => {
        if (b.getAttribute("data-target") === targetId) {
            b.classList.add("active");
        } else {
            b.classList.remove("active");
        }
    });

    // Active Section Toggle
    const currentActive = document.querySelector(".content-section.active");
    const targetSection = document.getElementById(targetId);

    if (currentActive) {
        currentActive.style.opacity = '0';
        currentActive.style.transform = 'translateY(10px)';
        setTimeout(() => {
            currentActive.classList.remove("active");
            targetSection.classList.add("active");
            // Allow layout to render first before triggering animation
            setTimeout(() => {
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    } else {
        targetSection.classList.add("active");
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0)';
    }

    // Update Header Text based on Section
    const titleMap = {
        'dashboard': { title: 'Dashboard Ringkasan', desc: 'Selamat datang! Mari pantau kesehatan tubuh Anda di dekade emas.' },
        'kalkulator': { title: 'Analisis Tubuh 40+', desc: 'Hitung kebutuhan cairan, kalori, massa otot, serta faktor risiko penuaan dini.' },
        'olahraga': { title: 'Latihan & Aktivitas Fisik', desc: 'Menjaga kekuatan otot, kelenturan sendi, dan kapasitas kardio jantung.' },
        'nutrisi': { title: 'Diet & Nutrisi Usia Lanjut', desc: 'Saran menu sehat, padat mineral, dan zat gizi makro penunjang usia produktif.' },
        'kebiasaan': { title: 'Jurnal Kebiasaan Harian', desc: 'Catat asupan air, durasi olahraga, dan pilar kebiasaan sehat pencegah sarkopenia.' }
    };

    if (titleMap[targetId]) {
        document.getElementById("pageTitle").textContent = titleMap[targetId].title;
        document.getElementById("pageDescription").textContent = titleMap[targetId].desc;
    }
}

// Set dynamic quote or helper based on age group
function setDynamicWelcome() {
    const greeting = document.getElementById("welcomeGreeting");
    const quote = document.getElementById("welcomeQuote");
    const badge = document.getElementById("ageBadge");

    const hours = new Date().getHours();
    let greetText = "Selamat Pagi";
    if (hours >= 12 && hours < 16) greetText = "Selamat Siang";
    else if (hours >= 16 && hours < 19) greetText = "Selamat Sore";
    else if (hours >= 19 || hours < 5) greetText = "Selamat Malam";

    const userName = userProfile.name ? userProfile.name.split(' ')[0] : 'Sahabat';
    greeting.textContent = `${greetText}, ${userName}!`;

    // Tailor depending on age
    const age = userProfile.age;
    if (age >= 40 && age < 50) {
        badge.textContent = `Kelompok Usia: Dekade 40-an (${age} Thn)`;
        quote.textContent = `"Usia 40-an adalah masa krusial membangun tameng kekuatan otot dan sendi. Fokuslah mencegah penurunan metabolisme awal."`;
    } else if (age >= 50 && age < 60) {
        badge.textContent = `Kelompok Usia: Dekade 50-an (${age} Thn)`;
        quote.textContent = `"Di usia 50-an, jaga elastisitas pembuluh darah dan kepadatan mineral tulang. Rutinlah bergerak aktif & kurangi garam/gula pasir."`;
    } else if (age >= 60) {
        badge.textContent = `Kelompok Usia: Emas Senior 60+ (${age} Thn)`;
        quote.textContent = `"Vitalitas di usia 60+ bergantung pada latihan keseimbangan (anti-jatuh), nutrisi padat protein, dan kehangatan hubungan sosial."`;
    } else {
        badge.textContent = `Kelompok Usia: Menuju 40-an`;
        quote.textContent = `"Kesehatan di usia muda menentukan kualitas kebugaran Anda di dekade emas mendatang."`;
    }

    // Sidebar update
    document.getElementById("userNameTxt").textContent = userProfile.name || "Sahabat Prima";
    document.getElementById("userAgeTxt").textContent = `${age} Tahun (${userProfile.gender === 'male' ? 'Pria' : 'Wanita'})`;
    document.getElementById("userAvatar").textContent = `${age}+`;
}

// Setup Form listeners
function setupForms() {
    const form = document.getElementById("healthForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        userProfile.name = document.getElementById("inputNama").value.trim() || "Sahabat Prima";
        userProfile.gender = document.getElementById("inputGender").value;
        userProfile.age = parseInt(document.getElementById("inputAge").value) || 45;
        userProfile.activity = document.getElementById("inputActivity").value;
        userProfile.height = parseFloat(document.getElementById("inputHeight").value) || 165;
        userProfile.weight = parseFloat(document.getElementById("inputWeight").value) || 68;

        userProfile.focus.joints = document.getElementById("focusJoints").checked;
        userProfile.focus.weight = document.getElementById("focusWeight").checked;
        userProfile.focus.heart = document.getElementById("focusHeart").checked;
        userProfile.focus.energy = document.getElementById("focusEnergy").checked;
        userProfile.focus.sleep = document.getElementById("focusSleep").checked;
        userProfile.focus.bone = document.getElementById("focusBone").checked;

        // Save
        localStorage.setItem("prima40_profile", JSON.stringify(userProfile));

        // Calculations & UI Updates
        calculateHealth(true);
        setDynamicWelcome();
        renderDashboard();
        
        showToast("Profil Anda berhasil dianalisis!");
    });
}

// Setup Medical Screenings Checkboxes
function setupScreeningChecks() {
    const checks = ['checkTensi', 'checkGula', 'checkKolesterol', 'checkMata'];
    
    checks.forEach(chkId => {
        const el = document.getElementById(chkId);
        el.addEventListener("change", () => {
            const key = chkId.replace('check', '').toLowerCase(); // e.g. checkTensi -> tensi
            dailyLog.screening[key] = el.checked;
            saveTodayLog();
            showToast("Jurnal Skrining Medis diperbarui");
        });
    });
}

// Health Profiler Logic
function calculateHealth(animate = true) {
    const resultsEmpty = document.getElementById("resultsEmpty");
    const resultsContent = document.getElementById("resultsContent");
    const resultStatus = document.getElementById("resultStatus");

    resultsEmpty.style.display = "none";
    resultsContent.style.display = "block";
    resultStatus.textContent = "Teranalisis";

    // 1. BMI Calculation
    const weight = userProfile.weight;
    const height = userProfile.height;
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    
    document.getElementById("resIMT").textContent = bmi;
    document.getElementById("bmiVal").textContent = bmi;

    let bmiCat = "";
    let needleRotation = 0;
    if (bmi < 18.5) {
        bmiCat = "Kurang Berat Badan";
        document.getElementById("bmiCategory").style.color = "var(--accent-indigo)";
        needleRotation = Math.max(-90, -90 + (bmi - 10) * 10);
    } else if (bmi >= 18.5 && bmi < 25) {
        bmiCat = "Normal (Sehat)";
        document.getElementById("bmiCategory").style.color = "var(--accent-green)";
        needleRotation = -45 + (bmi - 18.5) * (90 / 6.5);
    } else if (bmi >= 25 && bmi < 30) {
        bmiCat = "Kelebihan Berat Badan";
        document.getElementById("bmiCategory").style.color = "var(--accent-orange)";
        needleRotation = 45 + (bmi - 25) * (45 / 5);
    } else {
        bmiCat = "Obesitas (Risiko Tinggi)";
        document.getElementById("bmiCategory").style.color = "var(--accent-red)";
        needleRotation = Math.min(90, 60 + (bmi - 30) * 6);
    }
    
    document.getElementById("bmiCategory").textContent = bmiCat;
    document.getElementById("bmiPointer").style.transform = `rotate(${needleRotation}deg)`;

    // 2. BMR & Daily Calories Estimation (Mifflin-St Jeor)
    let bmr = 0;
    if (userProfile.gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * userProfile.age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * userProfile.age - 161;
    }

    const activityFactors = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725
    };
    const tdee = Math.round(bmr * activityFactors[userProfile.activity]);
    document.getElementById("resBMR").textContent = `${tdee} kkal`;

    // 3. Hydration Needs
    // General Formula: 35ml per kg. For older adults, thirst reflex decreases, so strict targets help
    const hydrationTarget = Math.round(weight * 35);
    document.getElementById("resAir").textContent = `${hydrationTarget} ml`;

    // Update today's target in progress dashboard
    document.getElementById("waterProgressTxt").textContent = `Terpenuhi: ${dailyLog.water} / ${hydrationTarget} ml`;
    updateProgressBars();

    // 4. Protein requirements (1.0g to 1.2g per kg for 40+ to offset sarcopenia)
    let multiplier = 1.0;
    if (userProfile.activity === 'moderate' || userProfile.activity === 'active') {
        multiplier = 1.2;
    }
    if (userProfile.focus.bone || userProfile.focus.joints) {
        multiplier += 0.1; // Extra support
    }
    const proteinTarget = Math.round(weight * multiplier);
    document.getElementById("resProtein").textContent = `${proteinTarget} g`;

    // 5. 40+ Health Risk Score
    let riskScore = 15; // base
    
    // Age factor (risk of chronic disease increases with age)
    riskScore += (userProfile.age - 40) * 1.5;

    // Lifestyle factor
    if (userProfile.activity === 'sedentary') riskScore += 18;
    else if (userProfile.activity === 'light') riskScore += 8;

    // Weight factor
    if (bmi >= 30) riskScore += 22;
    else if (bmi >= 25) riskScore += 10;
    else if (bmi < 18.5) riskScore += 8;

    // Symptom checks
    if (userProfile.focus.heart) riskScore += 15;
    if (userProfile.focus.weight) riskScore += 8;
    if (userProfile.focus.joints) riskScore += 5;
    if (userProfile.focus.sleep) riskScore += 5;

    // Cap risk score
    riskScore = Math.round(Math.max(10, Math.min(95, riskScore)));
    
    const riskBar = document.getElementById("riskBar");
    const riskPercent = document.getElementById("riskPercentage");
    const riskExpl = document.getElementById("riskExplanation");

    riskPercent.textContent = `${riskScore}%`;
    riskBar.style.width = `${riskScore}%`;

    // Color risk bar
    if (riskScore < 35) {
        riskBar.style.background = "var(--accent-green)";
        riskExpl.textContent = "Tingkat risiko kesehatan rendah. Teruskan gaya hidup sehat Anda untuk memperpanjang usia biologis sel.";
    } else if (riskScore >= 35 && riskScore < 65) {
        riskBar.style.background = "var(--accent-orange)";
        riskExpl.textContent = "Tingkat risiko kesehatan sedang. Menjaga metabolisme, membatasi gula kemasan, dan olahraga kekuatan sangat disarankan untuk proteksi tubuh.";
    } else {
        riskBar.style.background = "var(--accent-red)";
        riskExpl.textContent = "Tingkat risiko kesehatan cukup tinggi. Disarankan melakukan pemeriksaan medis berkala (Check Up) lengkap dan mulai menerapkan jadwal gerak harian.";
    }

    // 6. Action Steps Recommendations (Interactive Action Plan)
    const stepsContainer = document.getElementById("actionStepsContainer");
    stepsContainer.innerHTML = ""; // Clear

    const steps = [];

    // Core steps based on inputs
    if (bmi >= 25) {
        steps.push("Lakukan defisit kalori ringan 200-300 kkal dari target Anda (konsumsi sekitar " + (tdee - 300) + " kkal harian).");
    } else if (bmi < 18.5) {
        steps.push("Fokus tingkatkan porsi kalori dan protein berkualitas tinggi untuk menambah massa otot bebas lemak.");
    }

    if (userProfile.activity === 'sedentary') {
        steps.push("Mulai aktivitas kardio ringan seperti jalan kaki santai 15 menit setiap hari. Hindari duduk statis lebih dari 2 jam.");
    } else {
        steps.push("Pertahankan latihan aerobik 150 menit per minggu diselingi latihan kekuatan 2x seminggu.");
    }

    // Focus specific steps
    if (userProfile.focus.joints) {
        steps.push("Pilihlah olahraga berdampak rendah (Low Impact) seperti bersepeda statis atau berenang untuk mengamankan persendian.");
        steps.push("Konsumsi makanan tinggi asam lemak anti-inflamasi (omega-3 dari ikan kembung) dan bumbu kunyit/jahe hangat.");
    }
    if (userProfile.focus.heart) {
        steps.push("Batasi asupan garam maksimal 1 sendok teh per hari dan kurangi konsumsi gorengan dengan minyak jenuh berulang.");
    }
    if (userProfile.focus.sleep) {
        steps.push("Buat ritual tidur yang konsisten: matikan layar ponsel/TV 1 jam sebelum tidur dan hindari kafein setelah jam 2 siang.");
    }
    if (userProfile.focus.bone || (userProfile.gender === 'female' && userProfile.age >= 50)) {
        steps.push("Optimalkan kekuatan tulang dengan latihan pembebanan (misal: squat menggunakan kursi) dan pastikan paparan sinar matahari pagi.");
    }

    // Fallback if none
    if (steps.length === 0) {
        steps.push("Minum air putih minimal " + hydrationTarget + " ml sehari.");
        steps.push("Lakukan peregangan kelenturan tulang belakang (Cobra stretch) setiap pagi setelah bangun tidur.");
    }

    // Render Steps
    steps.forEach(st => {
        const li = document.createElement("li");
        li.className = "action-item";
        li.textContent = st;
        stepsContainer.appendChild(li);
    });
}

// Render Dashboard (Tab 1 recommendations and widgets)
function renderDashboard() {
    const container = document.getElementById("recomContainer");
    
    // If profile not entered (e.g. initial dummy state)
    if (!localStorage.getItem("prima40_profile")) {
        // Keeps empty state
        return;
    }

    container.innerHTML = ""; // Clear empty state

    const recommendations = [];

    // Build age-based recommendations
    const age = userProfile.age;
    if (age >= 40 && age < 50) {
        recommendations.push({
            icon: "🧬",
            title: "Pencegahan Sarkopenia Awal",
            desc: "Latihan beban (weight training) minimal 2x seminggu mutlak diperlukan. Hormon pertumbuhan alami mulai turun, pastikan asupan protein Anda cukup (" + Math.round(userProfile.weight * 1.1) + "g per hari)."
        });
    } else if (age >= 50 && age < 60) {
        recommendations.push({
            icon: "🫀",
            title: "Pengawasan Risiko Tekanan Darah",
            desc: "Kelenturan pembuluh darah menurun di usia 50-an. Kurangi konsumsi garam natrium, ganti cemilan dengan buah pisang atau alpukat yang tinggi kalium."
        });
    } else if (age >= 60) {
        recommendations.push({
            icon: "🤸",
            title: "Melatih Stabilitas & Keseimbangan",
            desc: "Untuk mencegah patah tulang akibat terjatuh, tambahkan sesi peregangan yoga, jalan lambat di permukaan rata, dan latihan berdiri satu kaki 10 detik bergantian."
        });
    }

    // Symptom/Focus recommendations
    if (userProfile.focus.joints) {
        recommendations.push({
            icon: "🦴",
            title: "Manajemen Kesehatan Sendi",
            desc: "Nyeri sendi menandakan menipisnya pelumas sendi. Cobalah lakukan Peregangan Hamstring dan konsumsi sayuran berdaun hijau gelap, kurangi asupan makanan manis yang memicu radang."
        });
    }

    if (userProfile.focus.weight) {
        recommendations.push({
            icon: "🥦",
            title: "Stimulasi Metabolisme Lambat",
            desc: "Tubuh membakar kalori lebih lambat. Prioritaskan asupan sayuran berserat tinggi setengah piring makan Anda, dan minum air putih hangat segelas sebelum makan."
        });
    }

    if (userProfile.focus.heart) {
        recommendations.push({
            icon: "❤️",
            title: "Perlindungan Kardiovaskular Sehat",
            desc: "Lakukan Brisk Walking 25-30 menit 4 kali seminggu. Kandungan serat tinggi dari oat dan kacang-kacangan sangat efektif menyerap kolesterol LDL di usus."
        });
    }

    // Default general advice
    recommendations.push({
        icon: "💧",
        title: "Kebutuhan Hidrasi Khusus",
        desc: "Di usia 40+, sensor haus di otak cenderung berkurang sensitivitasnya. Usahakan minum air putih secara berkala tanpa menunggu haus datang. Target hari ini: " + Math.round(userProfile.weight * 35) + " ml."
    });

    // Render to DOM
    recommendations.forEach(rec => {
        const card = document.createElement("div");
        card.className = "recom-item";
        card.innerHTML = `
            <span class="recom-icon">${rec.icon}</span>
            <div class="recom-info">
                <h5>${rec.title}</h5>
                <p>${rec.desc}</p>
            </div>
        `;
        container.appendChild(card);
    });

    // Update mini dashboard counters
    const hydTarget = Math.round(userProfile.weight * 35) || 2500;
    document.getElementById("dashHydration").textContent = `${dailyLog.water} / ${hydTarget} ml`;
    document.getElementById("dashExercise").textContent = `${dailyLog.exercise} / 30 mnt`;
    
    // Count successful pilar habits
    let okHabits = 0;
    if (dailyLog.habits.sleep) okHabits++;
    if (dailyLog.habits.veggies) okHabits++;
    if (dailyLog.habits.stretch) okHabits++;
    if (dailyLog.habits.nosugar) okHabits++;
    document.getElementById("dashHabits").textContent = `${okHabits} / 4 Berhasil`;

    updateProgressBars();
}

function updateProgressBars() {
    const hydTarget = (userProfile.weight * 35) || 2500;
    const hydPct = Math.min(100, Math.round((dailyLog.water / hydTarget) * 100));
    document.getElementById("hydBar").style.width = `${hydPct}%`;

    const exePct = Math.min(100, Math.round((dailyLog.exercise / 30) * 100));
    document.getElementById("exeBar").style.width = `${exePct}%`;

    let okHabits = 0;
    if (dailyLog.habits.sleep) okHabits++;
    if (dailyLog.habits.veggies) okHabits++;
    if (dailyLog.habits.stretch) okHabits++;
    if (dailyLog.habits.nosugar) okHabits++;
    const habPct = Math.round((okHabits / 4) * 100);
    document.getElementById("habBar").style.width = `${habPct}%`;

    // Habit Streak Info updates
    document.getElementById("txtComplianceScore").textContent = `${Math.round((hydPct + exePct + habPct) / 3)}%`;
}

// Workout Filter Function
window.filterWorkout = function(category) {
    // Button toggle
    const buttons = document.querySelectorAll(".exercise-mode-selectors .filter-btn");
    buttons.forEach(btn => {
        if (btn.outerHTML.includes(`'${category}'`)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    const cards = document.querySelectorAll("#workoutGrid .workout-card");
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute("data-category") === category) {
            card.style.display = "flex";
            card.style.animation = "fadeIn 0.3s ease-out forwards";
        } else {
            card.style.display = "none";
        }
    });
};

// Guided Exercise Timer Logic
window.startExerciseTimer = function(name, seconds) {
    // If another timer is running, clear it first
    if (timerInterval) clearInterval(timerInterval);

    currentWorkoutName = name;
    timerDuration = seconds;
    timerTimeLeft = seconds;
    timerIsPaused = false;

    document.getElementById("timerTitle").textContent = name;
    document.getElementById("exerciseTimerCard").style.display = "block";
    document.getElementById("timerPauseBtn").textContent = "Jeda";

    updateTimerDisplay();
    playBeep(600, 0.15); // Start alert tone

    timerInterval = setInterval(() => {
        if (!timerIsPaused) {
            timerTimeLeft--;
            updateTimerDisplay();

            // Count down beep for last 3 seconds
            if (timerTimeLeft <= 3 && timerTimeLeft > 0) {
                playBeep(440, 0.1);
            }

            if (timerTimeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                completeExercise();
            }
        }
    }, 1000);
};

function updateTimerDisplay() {
    const mins = Math.floor(timerTimeLeft / 60);
    const secs = timerTimeLeft % 60;
    document.getElementById("timerCount").textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Update Circle Progress stroke-dashoffset
    const circle = document.getElementById("timerProgress");
    const circumference = 339.29; // 2 * PI * 54
    const progress = (timerDuration - timerTimeLeft) / timerDuration;
    const offset = circumference - (progress * circumference);
    circle.style.strokeDashoffset = offset;
}

window.togglePauseTimer = function() {
    timerIsPaused = !timerIsPaused;
    document.getElementById("timerPauseBtn").textContent = timerIsPaused ? "Mulai" : "Jeda";
    showToast(timerIsPaused ? "Sesi dijeda" : "Sesi dilanjutkan");
};

window.closeTimer = function() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    document.getElementById("exerciseTimerCard").style.display = "none";
    showToast("Sesi latihan dibatalkan");
};

window.completeExercise = function() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    document.getElementById("exerciseTimerCard").style.display = "none";
    playBeep(880, 0.4); // Complete success tone

    // Add minutes to today's log (convert seconds duration back to minutes, round up)
    const minutesAdded = Math.ceil(timerDuration / 60);
    dailyLog.exercise += minutesAdded;
    saveTodayLog();

    // Update UI Elements
    renderDashboard();
    renderHistoryChart();

    showToast(`Bagus! Anda menyelesaikan ${currentWorkoutName} (${minutesAdded} Menit)`);
};

// Web Audio API Sound Generator (Beep)
function playBeep(frequency, duration) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Silently fail if browser permissions block it
        console.warn("Audio Context blocked or unsupported:", e);
    }
}

// Habit Logging / Increment Features
window.addWater = function(amount) {
    dailyLog.water += amount;
    saveTodayLog();
    renderDashboard();
    renderHistoryChart();
    showToast(`+${amount}ml air putih tercatat`);
};

window.logExerciseManual = function() {
    const input = document.getElementById("manualExeMinutes");
    const val = parseInt(input.value);
    
    if (val > 0 && val <= 180) {
        dailyLog.exercise += val;
        input.value = "";
        saveTodayLog();
        renderDashboard();
        renderHistoryChart();
        showToast(`+${val} menit latihan tercatat`);
    } else {
        showToast("Masukkan menit latihan yang valid (1 - 180)");
    }
};

window.updateHabitState = function() {
    dailyLog.habits.sleep = document.getElementById("habitSleep").checked;
    dailyLog.habits.veggies = document.getElementById("habitVeggies").checked;
    dailyLog.habits.stretch = document.getElementById("habitStretch").checked;
    dailyLog.habits.nosugar = document.getElementById("habitNoSugar").checked;
    
    saveTodayLog();
    renderDashboard();
    renderHistoryChart();
};

window.resetTodayLogs = function() {
    if (confirm("Apakah Anda yakin ingin menghapus semua catatan kebiasaan sehat hari ini?")) {
        dailyLog.water = 0;
        dailyLog.exercise = 0;
        dailyLog.habits = {
            sleep: false,
            veggies: false,
            stretch: false,
            nosugar: false
        };
        
        // Uncheck boxes in DOM
        document.getElementById("habitSleep").checked = false;
        document.getElementById("habitVeggies").checked = false;
        document.getElementById("habitStretch").checked = false;
        document.getElementById("habitNoSugar").checked = false;

        saveTodayLog();
        renderDashboard();
        renderHistoryChart();
        showToast("Catatan hari ini dikosongkan.");
    }
};

// Render Custom SVG History Chart
function renderHistoryChart() {
    const chartBars = document.getElementById("chartBars");
    const chartLabelsX = document.getElementById("chartLabelsX");
    
    if (!chartBars) return;

    chartBars.innerHTML = "";
    chartLabelsX.innerHTML = "";

    // Assemble last 7 days (including today)
    const combinedData = [...historyLogs];
    
    // Check if today is already in the list
    const todayExists = combinedData.some(item => item.date === dailyLog.date);
    if (!todayExists) {
        combinedData.push(dailyLog);
    }
    
    // Sort chronological
    combinedData.sort((a,b) => new Date(a.date) - new Date(b.date));
    
    // Only show last 7 days
    const last7Days = combinedData.slice(-7);

    // Calculate weekly metrics for summary box
    let totalWaterMl = 0;
    let totalExeMin = 0;
    last7Days.forEach(day => {
        totalWaterMl += day.water;
        totalExeMin += day.exercise;
    });

    document.getElementById("txtWeeklyWater").textContent = `${(totalWaterMl / 1000).toFixed(1)} L`;
    document.getElementById("txtWeeklyExercise").textContent = `${totalExeMin} Mnt`;

    // Chart layouts
    const chartWidth = 500;
    const chartHeight = 200;
    const startX = 60;
    const endX = 460;
    const baselineY = 170;
    const maxBarHeight = 130; // height inside chart coordinate
    
    const count = last7Days.length;
    const colSpacing = (endX - startX) / (count - 1 || 1);

    // SVG Gradient definition
    let gradDef = document.getElementById("chartGradDef");
    if (!gradDef) {
        const svg = document.getElementById("habitHistoryChart");
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.id = "chartGradDef";
        defs.innerHTML = `
            <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="var(--accent-teal)" />
                <stop offset="100%" stop-color="var(--accent-indigo)" />
            </linearGradient>
        `;
        svg.appendChild(defs);
    }

    last7Days.forEach((day, index) => {
        // Calculate compliance percentage
        const hydTarget = (userProfile.weight * 35) || 2500;
        const hydPct = Math.min(100, (day.water / hydTarget) * 100);
        const exePct = Math.min(100, (day.exercise / 30) * 100);
        
        let okHabits = 0;
        if (day.habits.sleep) okHabits++;
        if (day.habits.veggies) okHabits++;
        if (day.habits.stretch) okHabits++;
        if (day.habits.nosugar) okHabits++;
        const habPct = (okHabits / 4) * 100;

        const score = (hydPct + exePct + habPct) / 3; // 0 - 100

        // X coordinate
        const x = startX + (index * colSpacing);
        
        // Bar height
        const barHeight = (score / 100) * maxBarHeight;
        const y = baselineY - barHeight;

        // Draw SVG Rect
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x - 14);
        rect.setAttribute("y", y);
        rect.setAttribute("width", 28);
        rect.setAttribute("height", Math.max(4, barHeight));
        rect.setAttribute("class", "chart-bar-rect");
        
        // Tooltip description
        const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "title");
        titleEl.textContent = `${formatDateShort(day.date)}: Skor Kepatuhan ${Math.round(score)}% (Air: ${day.water}ml, Latihan: ${day.exercise}m)`;
        rect.appendChild(titleEl);

        chartBars.appendChild(rect);

        // Label day text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", baselineY + 18);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("class", "chart-label-text");
        text.textContent = formatDateShort(day.date);
        chartLabelsX.appendChild(text);
    });
}

function formatDateShort(dateStr) {
    const d = new Date(dateStr);
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const dates = d.getDate();
    return `${days[d.getDay()]} ${dates}`;
}

// Toast Notifications helper
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    
    // Reset timer
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
