// ========================================
// KB Wealth Spin & Win - JavaScript
// ========================================

// Prize Configuration
const prizes = [
    { name: "DISKAUN 50%", color: "#FFD700" },
    { name: "CUBA LAGI", color: "#8E44AD" },
    { name: "VOUCHER RM50", color: "#FF6B6B" },
    { name: "DISKAUN 20%", color: "#4ECDC4" },
    { name: "HADIAH MISTERI", color: "#FFD700" },
    { name: "FREE GIFT", color: "#8E44AD" },
    { name: "DISKAUN 10%", color: "#FF6B6B" },
    { name: "CUBA LAGI", color: "#4ECDC4" }
];

// User Data Storage
let userData = {
    nama: '',
    telefon: '',
    email: ''
};

// Facebook redirect URL
const FACEBOOK_URL = "https://www.facebook.com/kbbeyond";

// Google Sheets Web App URL - GANTI DENGAN URL ANDA
// Ikut panduan di bawah untuk mendapatkan URL ini
const GOOGLE_SHEET_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

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

    if (userData.nama.length < 2) {
        showAlert('Sila masukkan nama yang sah');
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
    // Weighted probability - more chances for smaller prizes
    const weights = [
        5,   // DISKAUN 50% - rare
        25,  // CUBA LAGI - common
        10,  // VOUCHER RM50 - medium
        15,  // DISKAUN 20% - medium
        8,   // HADIAH MISTERI - rare
        12,  // FREE GIFT - medium
        15,  // DISKAUN 10% - medium
        10   // CUBA LAGI - common
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

function showResult(prize) {
    isSpinning = false;
    spinBtn.disabled = false;
    spinBtn.querySelector('.spin-text').textContent = 'SPIN!';

    // Check if it's "CUBA LAGI" (Try Again)
    const isTryAgain = prize.name === "CUBA LAGI";

    // Update modal content based on prize
    winnerName.textContent = userData.nama;

    if (isTryAgain) {
        // Show try again message
        document.querySelector('.trophy-icon').textContent = '🔄';
        document.querySelector('.result-title').textContent = 'CUBA LAGI!';
        prizeValue.textContent = 'Anda boleh putar sekali lagi!';
        document.querySelector('.result-message').textContent = 'Jangan risau, nasib anda mungkin lebih baik kali ini!';
        claimBtn.innerHTML = '<span>Putar Sekali Lagi</span><span class="arrow">🎡</span>';
        claimBtn.setAttribute('data-action', 'spin-again');
        // Change button color to gold for try again
        claimBtn.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        claimBtn.style.color = '#1a0a2e';
    } else {
        // Show winning message
        document.querySelector('.trophy-icon').textContent = '🏆';
        document.querySelector('.result-title').textContent = 'TAHNIAH!';
        prizeValue.textContent = prize.name;
        document.querySelector('.result-message').textContent = 'Hadiah anda akan dihantar melalui email/WhatsApp';
        claimBtn.innerHTML = '<span>Teruskan ke Facebook</span><span class="arrow">→</span>';
        claimBtn.setAttribute('data-action', 'facebook');
        // Reset button color to Facebook blue
        claimBtn.style.background = 'linear-gradient(135deg, #4267B2, #3b5998)';
        claimBtn.style.color = '#fff';
        // Create confetti only for winners
        createConfetti();
    }

    // Show modal
    resultModal.classList.add('show');
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

// Claim Button - Handle both Spin Again and Facebook Redirect
function initClaimButton() {
    claimBtn.addEventListener('click', () => {
        const action = claimBtn.getAttribute('data-action');

        // Add click animation
        claimBtn.style.transform = 'scale(0.95)';

        setTimeout(() => {
            claimBtn.style.transform = '';

            if (action === 'spin-again') {
                // Close modal and allow spinning again
                resultModal.classList.remove('show');
            } else {
                // Redirect to Facebook
                window.location.href = FACEBOOK_URL;
            }
        }, 300);
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
