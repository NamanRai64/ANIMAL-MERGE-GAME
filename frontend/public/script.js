// === API CONFIGURATION ===
const API_BASE_URL = 'http://localhost:8085/api';
const SCORES_API_URL = 'http://localhost:8085/api/scores';

// === AUTHENTICATION STATE ===
let currentUser = null;
let authToken = null;

// === LEADERBOARD DOM ELEMENTS ===
const loginScreen = document.getElementById('login-screen');
const menuScreen = document.getElementById('category-screen'); // This is actually the menu screen after login
const leaderboardScreen = document.getElementById('leaderboard-screen');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardBtnMenu = document.getElementById('leaderboard-btn-menu');
const leaderboardBackBtn = document.getElementById('leaderboard-back-btn');
const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');

// === AUTHENTICATION DOM ELEMENTS ===
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const registerToggleBtn = document.getElementById('register-toggle-btn');
const authMessage = document.getElementById('auth-message');
const welcomeUserMessage = document.getElementById('welcome-user-message');
const logoutBtn = document.getElementById('logout-btn');



// === AUTHENTICATION FUNCTIONS ===
let isRegisterMode = false;

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    
    if (isRegisterMode) {
        loginForm.querySelector('button').textContent = 'Register';
        registerToggleBtn.textContent = 'Already have an account? Login';
        authMessage.textContent = '';
    } else {
        loginForm.querySelector('button').textContent = 'Login';
        registerToggleBtn.textContent = 'Need an Account? Register';
        authMessage.textContent = '';
    }
}

/**
 * Handles user authentication (login/register)
 */
async function handleAuth(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    if (!username || !password) {
        showAuthMessage('Please enter both username and password', true);
        return;
    }
    
    try {
        const endpoint = isRegisterMode ? 'http://localhost:8085/api/register' : 'http://localhost:8085/api/auth';
        
        console.log('Attempting authentication to:', endpoint);
        
        // Use JSON for both register and login
        const requestBody = {
            username: username,
            password: password
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });
        
        console.log('Auth response status:', response.status, response.statusText);
        
        if (isRegisterMode) {
            if (response.ok) {
                const responseText = await response.text();
                showAuthMessage('Registration successful! Please login.', false);
                toggleAuthMode();
                usernameInput.value = '';
                passwordInput.value = '';
            } else {
                const errorText = await response.text();
                showAuthMessage(errorText || 'Registration failed. Please try a different username.', true);
            }
        } else {
            if (response.ok) {
                // Login successful
                const responseData = await response.json();
                currentUser = responseData.username || username;
                showAuthMessage('', false);
                switchToMenuScreen();
            } else {
                const errorText = await response.text();
                showAuthMessage(errorText || 'Login failed. Please check your credentials.', true);
            }
        }
    } catch (error) {
        console.error('Authentication error:', error);
        showAuthMessage(`Network error: ${error.message}. Make sure the Spring Boot backend is running on port 8085.`, true);
    }
}

function showAuthMessage(message, isError) {
    authMessage.textContent = message;
    authMessage.className = isError ? 'error-message' : 'success-message';
}

function switchToMenuScreen() {
    loginScreen.classList.remove('active');
    loginScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    menuScreen.classList.add('active');
    welcomeUserMessage.textContent = `Hello, ${currentUser}! Select Your Kingdom`;
}

function handleLogout() {
    fetch('http://localhost:8085/logout', {
        method: 'POST',
        credentials: 'include'
    }).finally(() => {
        currentUser = null;
        authToken = null;
        menuScreen.classList.remove('active');
        menuScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        loginScreen.classList.add('active');
        
        // Reset form
        usernameInput.value = '';
        passwordInput.value = '';
        authMessage.textContent = '';
        isRegisterMode = false;
        loginForm.querySelector('button').textContent = 'Login';
        registerToggleBtn.textContent = 'Need an Account? Register';
    });
}
// Add this centralized function to script.js
function showScreen(screenElement) {
    // 1. Find all elements with the 'screen' class
    const allScreens = document.querySelectorAll('.screen');
    
    // 2. Hide all screens (add the 'hidden' class and remove 'active')
    allScreens.forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('active');
    });
    
    // 3. Show the target screen (remove 'hidden' and add 'active')
    screenElement.classList.remove('hidden');
    screenElement.classList.add('active');
}
// === SCREEN MANAGEMENT ===
function showScreen(screenElement) {
    // 1. Get all elements with the 'screen' class
    const allScreens = document.querySelectorAll('.screen');
    
    // 2. Hide all screens
    allScreens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    // 3. Show the target screen
    screenElement.classList.remove('hidden');
    screenElement.classList.add('active');
}

// === EVENT LISTENERS ===

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission and page reload
        
        // Determine which function to call (login or register)
        if (isRegisterMode) {
            await register();
        } else {
            // The login() function must now handle the API call
            const success = await login(); 
            
            // CRITICAL FIX: If login is successful, switch screens
            if (success) {
                // menuScreen is defined as document.getElementById('category-screen')
                showScreen(menuScreen); 
            }
        }
    });
}
// === DEBUG FUNCTION TO CHECK BACKEND CONNECTIVITY ===
async function checkBackendConnection() {
    try {
        console.log('Testing backend connection...');
        const response = await fetch('http://localhost:8085/api/merge?itemA=Cat&itemB=Dog', {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Backend connection test - Status:', response.status);
        return response.ok;
    } catch (error) {
        console.error('Backend connection failed:', error);
        return false;
    }
}

// Check backend on page load
window.addEventListener('load', async () => {
    console.log('Page loaded, checking backend connectivity...');
    const isConnected = await checkBackendConnection();
    if (!isConnected) {
        console.warn('⚠️ Backend is not reachable. Make sure Spring Boot is running on port 8085.');
        showAuthMessage('⚠️ Backend server not detected. Make sure Spring Boot is running on port 8085.', true);
    } else {
        console.log('✅ Backend connection successful');
        showAuthMessage('✅ Backend connected successfully. You can now login or register.', false);
    }
});

// === API FUNCTIONS ===

/**
 * Submits the final score and number of discoveries to the backend.
 * The backend handles user identification via Spring Security session.
 */
/**
 * Submits the final score and number of discoveries to the backend.
 */
async function submitScore(score, discoveries) {
    try {
        console.log('Submitting score for user:', currentUser, { score, discoveries });
        
        const requestBody = {
            score: score,
            discoveries: discoveries,
            username: currentUser // Include the username
        };

        const response = await fetch(SCORES_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Score submission failed: ${errorText}`);
        }

        const result = await response.json();
        console.log('Score submitted successfully:', result);
        return true;
    } catch (error) {
        console.error('Error submitting score:', error);
        return false;
    }
}

/**
 * Fetches the top 10 scores from the leaderboard endpoint.
 */
async function fetchLeaderboard() {
    try {
        const response = await fetch(`${SCORES_API_URL}/leaderboard`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch leaderboard: ${response.status}`);
        }
        
        const scores = await response.json();
        return scores;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

// === LEADERBOARD UI FUNCTIONS ===

/**
 * Renders the fetched scores into the leaderboard table body.
 * @param {Array<Object>} scores List of score objects from the API.
 */
function renderLeaderboard(scores) {
    // Clear previous entries
    leaderboardTableBody.innerHTML = '';

    if (!scores || scores.length === 0) {
        leaderboardTableBody.innerHTML = '<tr><td colspan="4">No scores submitted yet! Be the first to play!</td></tr>';
        return;
    }
    
    scores.forEach((score, index) => {
        const row = leaderboardTableBody.insertRow();
        const rank = index + 1;
        
        // Display the actual username stored with the score
        const displayName = score.userId || 'Anonymous';

        row.innerHTML = `
            <td>${rank}</td>
            <td>${displayName}</td>
            <td>${score.score}</td>
            <td>${score.discoveries}</td>
        `;
    });
}

/**
 * Shows the leaderboard screen and fetches the latest data.
 */
async function showLeaderboardScreen() {
    // Hide current screen and show leaderboard
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
        activeScreen.classList.add('hidden');
        activeScreen.classList.remove('active');
    }
    
    leaderboardScreen.classList.remove('hidden');
    leaderboardScreen.classList.add('active');

    // Fetch and render data
    const scores = await fetchLeaderboard();
    renderLeaderboard(scores);
}

// === CATEGORY DATA & RECIPES ===
const ANIMAL_CATEGORIES = {
    "Jungle": { initial: ["Cat 🐈", "Dog 🐕", "Monkey 🐒", "Rabbit 🐇","Sheep 🐑","Bird 🐦","Fish 🐟"] },
    "Ocean": { initial: ["Dolphin 🐬", "Shark 🦈", "Whale 🐳", "Crab 🦀","Squid 🦑","Eel 𓆙","Manta Ray 🐙","Turtle 🐢"] },
    "Insect": { initial: ["Ant 🐜", "Bee 🐝", "Fly 🪰", "Spider 🕷️"] },
    "Mythical": { initial: ["Unicorn 🦄", "Dragon 🐉", "Phoenix 🔥", "Mermaid 🧜‍♀️"] },
    "Jurassic": { initial: ["Dinosaur 🦖", "Pterosaur 🦅", "Plesiosaur 🦕", "Triceratops 🦏"] },
    "Cat Family": { initial: ["Cat 🐈", "Leopard 🐆"] },
    "Swamp": { initial: ["Frog 🐸", "Alligator 🐊", "Snake 🐍", "Turtle 🐢"] }
};

// === BEAUTIFUL MESSAGES ===
const NEW_DISCOVERY_MESSAGES = [
    "Eureka! You've discovered the magnificent {animal}!",
    "A new creation emerges! Behold, the {animal}!",
    "Incredible! Your wisdom has brought forth the {animal}!",
    "A legendary discovery! You've created the {animal}!",
    "Great job! Your efforts have come to fruitition bringing {animal}!"
];
const REPEAT_DISCOVERY_MESSAGES = [
    "A familiar creation: You've crafted another {animal}.",
    "Masterfully done! You made another {animal}.",
    "The familiar form of the {animal} appears once more."
];
const INVALID_MERGE_MESSAGES = [
    "The elements fizzle and fade... Nothing happens.",
    "Hmm, that combination doesn't seem to work.",
    "The magic fails... Try a different pairing."
];

// === GAME STATE ===
let selectedCategory = null;
let inventory = [];
let discoveries = [];
let discoveryCount = 0;
let score = 0;
let maxTimeInSeconds = 0;
let timeLeft = 0;
let timerInterval = null;
let mergeZone = { A: null, B: null };
let draggedItemData = null;
let isPaused = false;

// === DOM REFERENCES ===
const categoryScreen = document.getElementById('category-screen');
const timeScreen = document.getElementById('time-screen');
const nextToTimeBtn = document.getElementById('next-to-time-btn');
const backToCategoryBtn = document.getElementById('back-to-category-btn');
const selectedCategoryNameEl = document.getElementById('selected-category-name');
const categoryGrid = document.getElementById('category-grid');
const startGameBtn = document.getElementById('start-game-btn');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const inventoryList = document.getElementById('inventory-list');
const dropZoneA = document.getElementById('drop-zone-a');
const dropZoneB = document.getElementById('drop-zone-b');
const timerValue = document.getElementById('timer-value');
const scoreValue = document.getElementById('score-value');
const discoveryCountEl = document.getElementById('discovery-count');
const exitBtn = document.getElementById('exit-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const pauseScreen = document.getElementById('pause-screen');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const restartBtn = document.getElementById('restart-btn');
const toast = document.getElementById('toast-message');
const warningOverlay = document.getElementById('warning-overlay');
const modal = document.getElementById('custom-modal');
const modalMessage = document.getElementById('modal-message');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const aboutScreen = document.getElementById('about-screen');
const aboutOptionBtn = document.getElementById('about-option-btn');
const backFromAboutBtn = document.getElementById('back-from-about-btn');
const mergeResultEl = document.getElementById('merge-result');
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const submissionStatusMessage = document.getElementById('submission-status-message');

// === PARTICLE BACKGROUND LOGIC ===
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
});

function createParticles() {
    particles = [];
    const particleCount = 200;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: Math.random() * 1 - 0.5,
            dy: Math.random() * 1 - 0.5,
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

createParticles();
animateParticles();

// === UTILITY FUNCTIONS ===
let resolveModalPromise = null;
function showModal(message) {
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
    return new Promise((resolve) => {
        resolveModalPromise = resolve;
    });
}

function closeModal(result) {
    modal.classList.add('hidden');
    if (resolveModalPromise) {
        resolveModalPromise(result);
        resolveModalPromise = null;
    }
}

modalConfirmBtn.addEventListener('click', () => closeModal(true));
modalCancelBtn.addEventListener('click', () => closeModal(false));

function showToast(message, duration = 2000) {
    if (!toast) return; 
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

function getRandomMessage(messageArray, animal = "") {
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex].replace('{animal}', animal);
}

// === MENU NAVIGATION ===
categoryGrid.addEventListener('click', (e) => {
    const clickedLabel = e.target.closest('.category-option');
    if (!clickedLabel) return;
    
    selectedCategory = clickedLabel.dataset.category;
    startGameBtn.disabled = false;
});

startGameBtn.addEventListener('click', () => {
    if (!selectedCategory) return;
    
    // Get selected time
    const selectedTimeRadio = document.querySelector('input[name="time-limit"]:checked');
    if (selectedTimeRadio) {
        const selectedTime = parseInt(selectedTimeRadio.value);
        maxTimeInSeconds = selectedTime === 0 ? 0 : selectedTime * 60;
        timeLeft = maxTimeInSeconds;
    }
    
    // Use showScreen function to properly switch screens
    showScreen(gameScreen);
    
    resetGameState();
    renderInventory();
    updateHUD();
    
    if (maxTimeInSeconds > 0) startTimer();
});

// === GAME LIFECYCLE ===
function resetGameState() {
    const categoryData = ANIMAL_CATEGORIES[selectedCategory] || ANIMAL_CATEGORIES["Jungle"];
    inventory = [...categoryData.initial];
    discoveries = [...categoryData.initial];
    discoveryCount = discoveries.length;
    score = 0;
    isPaused = false;
    
    mergeZone = { A: null, B: null };
    draggedItemData = null;
    
    dropZoneA.textContent = "Drag Item A Here";
    dropZoneB.textContent = "Drag Item B Here";
    dropZoneA.classList.remove('occupied');
    dropZoneB.classList.remove('occupied');
    
    clearInterval(timerInterval);
    timeLeft = maxTimeInSeconds;
    warningOverlay.classList.remove('active');
}

async function endGame() {
    gameScreen.classList.add('hidden');
    gameScreen.classList.remove('active');
    gameOverScreen.classList.remove('hidden');
    gameOverScreen.classList.add('active');
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-discoveries').textContent = discoveryCount;
    
    // Ensure currentUser is set before submitting score
    if (!currentUser) {
        console.warn('No user logged in, using anonymous');
        currentUser = 'Anonymous';
    }
    
    // Submit score to backend
    submissionStatusMessage.textContent = 'Submitting score...';
    const success = await submitScore(score, discoveryCount);
    
    if (success) {
        submissionStatusMessage.textContent = 'Score submitted successfully!';
    } else {
        submissionStatusMessage.textContent = 'Failed to submit score.';
    }
}

function resetToMenu() {
    clearInterval(timerInterval);
    gameScreen.classList.add('hidden');
    gameScreen.classList.remove('active');
    gameOverScreen.classList.add('hidden');
    gameOverScreen.classList.remove('active');
    pauseScreen.classList.add('hidden');
    pauseScreen.classList.remove('active');
    timeScreen.classList.add('hidden'); // Ensure time screen is hidden
    timeScreen.classList.remove('active');
    
    // Show category screen (menu)
    showScreen(categoryScreen);
    
    const checkedRadio = document.querySelector('input[name="animal-category"]:checked');
    if (checkedRadio) checkedRadio.checked = false;
    startGameBtn.disabled = true;
    nextToTimeBtn.disabled = true; // Reset next button state
}

// === UI & RENDERING ===
function renderInventory() {
    if (!inventoryList) return;
    
    inventoryList.innerHTML = '';
    const uniqueInventory = [...new Set(inventory)].sort();

    uniqueInventory.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'animal-item';
        btn.textContent = item;
        btn.dataset.name = item;
        btn.draggable = true;
        btn.addEventListener('dragstart', e => {
            if (isPaused) {
                e.preventDefault();
                return;
            }
            draggedItemData = e.target.dataset.name;
        });
        inventoryList.appendChild(btn);
    });
}

function updateHUD() {
    if (scoreValue) scoreValue.textContent = score;
    if (discoveryCountEl) {
        const MAX_DISCOVERIES_PLACEHOLDER = '??';
        discoveryCountEl.textContent = `${discoveryCount}/${MAX_DISCOVERIES_PLACEHOLDER}`;
    }
    if (timerValue) timerValue.textContent = maxTimeInSeconds > 0 ? formatTime(timeLeft) : "∞";
}

// === DRAG & DROP LOGIC ===
[dropZoneA, dropZoneB].forEach(zone => {
    if (!zone) return;
    
    zone.addEventListener('dragover', e => {
        e.preventDefault();
        if (!zone.classList.contains('occupied')) {
            zone.classList.add('hovered');
        }
    });
    
    zone.addEventListener('dragleave', () => zone.classList.remove('hovered'));
    
    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('hovered');
        if (isPaused || zone.classList.contains('occupied')) return;
        
        const droppedItem = draggedItemData;
        if (zone.id === 'drop-zone-a') mergeZone.A = droppedItem;
        if (zone.id === 'drop-zone-b') mergeZone.B = droppedItem;
        
        zone.textContent = droppedItem;
        zone.classList.add('occupied');
        
        if (mergeZone.A && mergeZone.B) {
            checkMerge();
        }
    });
});

async function checkMerge() {
    const item1 = mergeZone.A;
    const item2 = mergeZone.B;
    
    if (!item1 || !item2) return;
    
    let result = null;
    
    try {
        const response = await fetch(`http://localhost:8085/api/merge?itemA=${encodeURIComponent(item1)}&itemB=${encodeURIComponent(item2)}`, {
            method: 'GET'
        });
        
        if (!response.ok) {
            showToast("Server error during merge lookup. Status: " + response.status, 3000);
            mergeResultEl.textContent = 'ERROR';
            return;
        }

        const data = await response.json();
        result = data.result;

    } catch (e) {
        console.error("Failed to connect to merge API:", e);
        showToast("Connection failed. Check Spring Boot server status.", 3000);
        mergeResultEl.textContent = '... Nothing!';
        return;
    }

    // Process the Result
    if (result && result.toLowerCase() !== 'null') { 
        const isNewDiscovery = !discoveries.includes(result);

        // KEEP original items in inventory - DON'T remove them
        // Just add the new result to inventory
        inventory.push(result);
        
        if (isNewDiscovery) { 
            showToast(getRandomMessage(NEW_DISCOVERY_MESSAGES, result));
            discoveries.push(result);
            discoveryCount++;
            score += (score%10000)+160; // Base 10 + 50 for new discovery
        } else {
            showToast(getRandomMessage(REPEAT_DISCOVERY_MESSAGES, result));
            score += 50;
        }
        
        mergeResultEl.textContent = `= ${result}`;
        
    } else {
        showToast(getRandomMessage(INVALID_MERGE_MESSAGES));
        mergeResultEl.textContent = '... Nothing!';
        score = Math.max(0, score - 185); // Penalty for failed merge
    }

    // Cleanup and UI Update
    mergeZone.A = null;
    mergeZone.B = null;
    dropZoneA.textContent = "Drag Item A Here";
    dropZoneB.textContent = "Drag Item B Here";
    dropZoneA.classList.remove('occupied');
    dropZoneB.classList.remove('occupied');
    
    renderInventory();
    updateHUD();
}

// === DARK/LIGHT MODE TOGGLE LOGIC ===
function setMode(isLight) {
    if (isLight) {
        document.body.classList.add('light-mode');
        if (modeToggleBtn) modeToggleBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        if (modeToggleBtn) modeToggleBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

function checkInitialMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        setMode(true);
    } else {
        setMode(false);
    }
}

if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
        const isCurrentlyLight = document.body.classList.contains('light-mode');
        setMode(!isCurrentlyLight);
    });
}

// === TIMER LOGIC ===
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (isPaused) return;
        timeLeft--;
        updateHUD();
        
        if (timeLeft === 10) {
            if (warningOverlay) warningOverlay.classList.add('active');
            showToast("⚠️ Only 10 seconds left!", 2000);
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (warningOverlay) warningOverlay.classList.remove('active');
            endGame();
        }
    }, 1000);
}

function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2, '0')}`;
}

// === EVENT LISTENERS ===

// Authentication event listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleAuth);
}

if (registerToggleBtn) {
    registerToggleBtn.addEventListener('click', toggleAuthMode);
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// Leaderboard event listeners
if (leaderboardBtn) {
    leaderboardBtn.addEventListener('click', showLeaderboardScreen);
}

if (leaderboardBtnMenu) {
    leaderboardBtnMenu.addEventListener('click', showLeaderboardScreen);
}

if (leaderboardBackBtn) {
    leaderboardBackBtn.addEventListener('click', () => {
        leaderboardScreen.classList.add('hidden');
        leaderboardScreen.classList.remove('active');
        menuScreen.classList.remove('hidden');
        menuScreen.classList.add('active');
    });
}

// Game control event listeners
if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
        showScreen(gameScreen);
        resetGameState();
        renderInventory();
        updateHUD();
        if (maxTimeInSeconds > 0) startTimer();
    });
}

if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
        resetToMenu();
        showScreen(categoryScreen); // Use categoryScreen instead of menuScreen
    });
}

if (exitBtn) {
    exitBtn.addEventListener('click', async () => {
        isPaused = true;
        if (await showModal("Exit to menu? Progress will be lost.")) {
            resetToMenu();
        } else {
            isPaused = false;
        }
    });
}

if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
        if (isPaused) return;
        isPaused = true;
        if (pauseScreen) {
            pauseScreen.classList.remove('hidden');
            pauseScreen.classList.add('active');
        }
    });
}

if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
        if (!isPaused) return;
        isPaused = false;
        if (pauseScreen) {
            pauseScreen.classList.add('hidden');
            pauseScreen.classList.remove('active');
        }
    });
}

if (restartBtn) {
    restartBtn.addEventListener('click', async () => {
        isPaused = true;
        if (await showModal("Restart the game? Progress will be lost.")) {
            if(isPaused && resumeBtn) resumeBtn.click();
            resetGameState();
            renderInventory();
            updateHUD();
            if (maxTimeInSeconds > 0) startTimer();
        } else {
            isPaused = false;
        }
    });
}

// === INITIALIZATION ===
checkInitialMode();

// Set a default time limit (you can make this configurable)
maxTimeInSeconds = 5 * 60; // 5 minutes default
timeLeft = maxTimeInSeconds;

// Enable start button by default since we're using direct category selection
if (startGameBtn) {
    startGameBtn.disabled = false;
}

// === EVENT LISTENERS ===

// Fix for Next to Time button
if (nextToTimeBtn) {
    nextToTimeBtn.addEventListener('click', () => {
        // Get selected category
        const selectedRadio = document.querySelector('input[name="animal-category"]:checked');
        if (!selectedRadio) {
            showToast("Please select a category first!");
            return;
        }
        
        selectedCategory = selectedRadio.value;
        selectedCategoryNameEl.textContent = selectedCategory;
        
        // Switch to time screen
        categoryScreen.classList.remove('active');
        categoryScreen.classList.add('hidden');
        timeScreen.classList.remove('hidden');
        timeScreen.classList.add('active');
    });
}

// Fix for About button
if (aboutOptionBtn) {
    aboutOptionBtn.addEventListener('click', () => {
        categoryScreen.classList.remove('active');
        categoryScreen.classList.add('hidden');
        aboutScreen.classList.remove('hidden');
        aboutScreen.classList.add('active');
    });
}

// Fix for Back from About button
if (backFromAboutBtn) {
    backFromAboutBtn.addEventListener('click', () => {
        aboutScreen.classList.remove('active');
        aboutScreen.classList.add('hidden');
        categoryScreen.classList.remove('hidden');
        categoryScreen.classList.add('active');
    });
}

// Fix for Back to Category button
if (backToCategoryBtn) {
    backToCategoryBtn.addEventListener('click', () => {
        timeScreen.classList.remove('active');
        timeScreen.classList.add('hidden');
        categoryScreen.classList.remove('hidden');
        categoryScreen.classList.add('active');
    });
}

// Enable/disable Next button based on category selection
if (categoryGrid) {
    categoryGrid.addEventListener('change', (e) => {
        if (e.target.name === 'animal-category') {
            nextToTimeBtn.disabled = false;
        }
    });
}

// Time selection handling
const timeOptions = document.querySelectorAll('input[name="time-limit"]');
timeOptions.forEach(option => {
    option.addEventListener('change', (e) => {
        const selectedTime = parseInt(e.target.value);
        maxTimeInSeconds = selectedTime === 0 ? 0 : selectedTime * 60;
        timeLeft = maxTimeInSeconds;
    });
});

// Authentication event listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleAuth);
}

if (registerToggleBtn) {
    registerToggleBtn.addEventListener('click', toggleAuthMode);
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// ... rest of your existing event listeners