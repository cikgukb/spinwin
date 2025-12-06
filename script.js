// ========================================
// KB Wealth Spin & Win - JavaScript
// ========================================

// Prize Configuration - 8 segments
const prizes = [
    { name: "Free Buku ChatGPT For Business", color: "#4ECDC4", isSorry: false },
    { name: "Free Ebook Guerilla Marketing Cikgukb", color: "#9B59B6", isSorry: false },
    { name: "Minta Maaf Cuba Lagi Di Lain Masa 😭", color: "#E74C3C", isSorry: true },
    { name: "Free Ebook Guerilla Marketing Cikgukb", color: "#9B59B6", isSorry: false },
    { name: "Minta Maaf Cuba Lagi Di Lain Masa 😭", color: "#E74C3C", isSorry: true },
    { name: "Cuba Lagi", color: "#FFD700", isSorry: false },
    { name: "Minta Maaf Cuba Lagi Di Lain Masa 😭", color: "#E74C3C", isSorry: true },
    { name: "Cuba Lagi", color: "#FFD700", isSorry: false }
];

// User Data Storage
let userData = {
    nama: '',
    telefon: '',
    email: '',
    hadiah: ''  // Tambah field untuk hadiah
};

// Facebook redirect URL
const FACEBOOK_URL = "https://www.facebook.com/kbbeyond";

// Google Sheets Web App URL - GANTI DENGAN URL ANDA
// Ikut panduan di bawah untuk mendapatkan URL ini
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx7S5t4n8kKoqACa1ufba83nhd_BPSuRfJLyuwcCjEunzv3im59AW-2eEETxx2xPUxoRQ/exec";

// DOM Elements
const welcomeSection = document.getElementById('welcomeSection');
const formSection = document.getElementById('formSection');
const wheelSection = document.getElementById('wheelSection');
const registrationForm = document.getElementById('registrationForm');
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resultModal = document.getElementById('resultModal');
const winnerName = document.getElementById('winnerName');
const prizeValue = document.getElementById('prizeValue');
const claimBtn = document.getElementById('claimBtn');
const particlesContainer = document.getElementById('particles');
const startBtn = document.getElementById('startBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initWelcomeSection();
    initFormValidation();
    initSpinWheel();
    initClaimButton();
});

// Welcome Section Handler
function initWelcomeSection() {
    startBtn.addEventListener('click', () => {
        transitionToForm();
    });
}

function transitionToForm() {
    // Fade out welcome section
    welcomeSection.style.animation = 'fadeOutUp 0.5s ease forwards';

    setTimeout(() => {
        welcomeSection.style.display = 'none';
        formSection.style.display = 'block';
        formSection.style.animation = 'fadeInUp 0.8s ease';
    }, 500);
}


// Create Floating Particles
function createParticles() {
    const colors = ['#FFD700', '#FFA500', '#9B59B6', '#E8E8E8'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particle.style.width = (5 + Math.random() * 10) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particlesContainer.appendChild(particle);
    }
}

// Form Validation & Submission
function initFormValidation() {
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        userData.nama = document.getElementById('nama').value.trim();
        userData.telefon = document.getElementById('telefon').value.trim();
        userData.email = document.getElementById('email').value.trim();

        // Validate
        if (!validateForm()) {
            return;
        }

        // Show loading overlay
        showLoading(true);

        try {
            // Save to Google Sheets
            await saveToGoogleSheets();

            // Also save to localStorage as backup
            saveToLocalStorage();

            // Hide loading and transition to wheel section
            showLoading(false);
            transitionToWheel();
        } catch (error) {
            console.error('Error saving data:', error);
            showLoading(false);

            // Still proceed even if Google Sheets fails
            // Data is saved locally as backup
            saveToLocalStorage();
            showAlert('Maklumat disimpan secara tempatan. Teruskan bermain!');
            setTimeout(() => {
                transitionToWheel();
            }, 1500);
        }
    });
}

function validateForm() {
    const phoneRegex = /^[0-9]{10,11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (userData.nama.length < 6) {
        showAlert('Sila masukkan nama sekurang‑kurangnya 6 aksara');
        return false;
    }

    if (!phoneRegex.test(userData.telefon)) {
        showAlert('Sila masukkan nombor telefon yang sah (10-11 digit)');
        return false;
    }

    if (!emailRegex.test(userData.email)) {
        showAlert('Sila masukkan alamat email yang sah');
        return false;
    }

    return true;
}

function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('show');
    } else {
        loadingOverlay.classList.remove('show');
    }
}

function showAlert(message) {
    // Create custom alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">⚠️</span>
            <p>${message}</p>
        </div>
    `;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        z-index: 9999;
        animation: slideDown 0.3s ease;
        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Save to Google Sheets via Web App
async function saveToGoogleSheets() {
    // Check if URL is configured
    if (GOOGLE_SHEET_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        console.log('Google Sheets URL not configured. Skipping...');
        return;
    }

    const formData = new FormData();
    formData.append('nama', userData.nama);
    formData.append('telefon', userData.telefon);
    formData.append('email', userData.email);
    formData.append('hadiah', userData.hadiah);  // Tambah hadiah
    formData.append('timestamp', new Date().toLocaleString('ms-MY', {
        timeZone: 'Asia/Kuala_Lumpur',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }));

    const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to save to Google Sheets');
    }

    console.log('Data saved to Google Sheets successfully!');
}

// Save to localStorage as backup
function saveToLocalStorage() {
    const entries = JSON.parse(localStorage.getItem('spinWinEntries') || '[]');
    entries.push({
        ...userData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('spinWinEntries', JSON.stringify(entries));
    console.log('User data saved to localStorage:', userData);
}

function transitionToWheel() {
    // Fade out form
    formSection.style.animation = 'fadeOutUp 0.5s ease forwards';

    setTimeout(() => {
        formSection.style.display = 'none';
        wheelSection.style.display = 'flex';
        wheelSection.style.animation = 'fadeInUp 0.8s ease';
    }, 500);
}


// Spin Wheel Logic
let isSpinning = false;
let currentRotation = 0;

function initSpinWheel() {
    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        spinWheel();
    });
}

function spinWheel() {
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.querySelector('.spin-text').textContent = '...';

    // Calculate random prize
    const prizeIndex = getWeightedPrize();
    const segmentAngle = 360 / prizes.length; // 45 degrees per segment

    // Calculate where to stop
    // We need to account for the pointer being at the top (0 degrees)
    // Each segment spans 45 degrees, centered at 22.5, 67.5, 112.5, etc.
    const targetAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2);

    // Add multiple full rotations for dramatic effect
    const fullRotations = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const totalRotation = (fullRotations * 360) + (360 - targetAngle);

    currentRotation += totalRotation;

    // Apply rotation
    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // Show result after spin
    setTimeout(() => {
        showResult(prizes[prizeIndex]);
    }, 4500);
}

function getWeightedPrize() {
    // Weighted probability berdasarkan hadiah baru
    // 1x Free Buku ChatGPT, 2x Guerilla Marketing, 3x Minta Maaf, 2x Cuba Lagi
    const weights = [
        10,  // Free Buku ChatGPT For Business - rare (1 slot)
        15,  // Free Ebook Guerilla Marketing - medium (slot 1)
        20,  // Minta Maaf Cuba Lagi - common (slot 1)
        15,  // Free Ebook Guerilla Marketing - medium (slot 2)
        20,  // Minta Maaf Cuba Lagi - common (slot 2)
        10,  // Cuba Lagi (slot 1)
        20,  // Minta Maaf Cuba Lagi - common (slot 3)
        10   // Cuba Lagi (slot 2)
    ];

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return i;
        }
    }

    return 0;
}

async function showResult(prize) {
    isSpinning = false;
    spinBtn.disabled = true; // Keep disabled - no more spinning after result
    spinBtn.querySelector('.spin-text').textContent = 'SPIN!';

    // Save prize to userData
    userData.hadiah = prize.name;

    // Update modal content based on prize
    winnerName.textContent = userData.nama;

    // Check if it's a sorry/try again prize
    const isSorry = prize.isSorry;
    const isCubaLagi = prize.name === "Cuba Lagi";

    if (isSorry) {
        // Show sorry message - Minta Maaf
        document.querySelector('.trophy-icon').textContent = '😭';
        document.querySelector('.result-title').textContent = 'MINTA MAAF!';
        prizeValue.textContent = 'Cuba Lagi Di Lain Masa';
        prizeValue.style.color = '#E74C3C';
        document.querySelector('.result-message').innerHTML = 'Mengalihkan ke Facebook dalam <span id="countdown">3</span> saat...';
        claimBtn.style.display = 'none'; // Hide button for auto-redirect
    } else if (isCubaLagi) {
        // Show Cuba Lagi message
        document.querySelector('.trophy-icon').textContent = '🔄';
        document.querySelector('.result-title').textContent = 'CUBA LAGI!';
        prizeValue.textContent = 'Putar sekali lagi!';
        prizeValue.style.color = '#FFD700';
        document.querySelector('.result-message').innerHTML = 'Mengalihkan ke Facebook dalam <span id="countdown">3</span> saat...';
        claimBtn.style.display = 'none'; // Hide button for auto-redirect
    } else {
        // Show winning message - Got a prize!
        document.querySelector('.trophy-icon').textContent = '🏆';
        document.querySelector('.result-title').textContent = 'TAHNIAH!';
        prizeValue.textContent = prize.name;
        prizeValue.style.color = '#4ECDC4';
        document.querySelector('.result-message').innerHTML = 'Mengalihkan ke Facebook dalam <span id="countdown">3</span> saat...';
        claimBtn.style.display = 'none'; // Hide button for auto-redirect
        // Create confetti for winners
        createConfetti();
    }

    // Show modal
    resultModal.classList.add('show');

    // Save to Google Sheets with prize info
    try {
        await saveToGoogleSheets();
        console.log('Prize saved to Google Sheets:', userData.hadiah);
    } catch (error) {
        console.error('Failed to save prize to Google Sheets:', error);
    }

    // Auto countdown and redirect to Facebook after 3 seconds
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = FACEBOOK_URL;
        }
    }, 1000);
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';

    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', '#FF8E53', '#00D4FF'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confettiContainer.appendChild(confetti);
    }
}

// Claim Button - No longer needed but keep for backup
function initClaimButton() {
    claimBtn.addEventListener('click', () => {
        // Redirect to Facebook immediately if clicked
        window.location.href = FACEBOOK_URL;
    });
}

// Add CSS for custom alert animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    @keyframes fadeOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
`;
document.head.appendChild(style);

// Console log for debugging
console.log('🎰 KB Wealth Spin & Win System Loaded');
console.log('📱 Facebook URL:', FACEBOOK_URL);
