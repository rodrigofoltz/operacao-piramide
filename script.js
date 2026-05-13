/**
 * Configurations & State Management
 */
const levelConfig = {
    'iniciante':  { min: 1, max: 10, tempo: null, maxErros: 3 },
    'facil':      { min: 1, max: 10, tempo: 120,  maxErros: 3 },
    'medio':      { min: 1, max: 50, tempo: 150,  maxErros: 3 },
    'dificil':    { min: 1, max: 50, tempo: 120,  maxErros: 1 },
    'impossivel': { min: 50, max: 100, tempo: 90, maxErros: 1 } 
};

let currentLevel = 'iniciante';
let solutionMap = {};
let totalErrors = 0;
let currentErrorLimit = 3;
let activeInputId = null;
let blocksResolvedPerRow = { 2: 0, 3: 0, 4: 0 };
let timerInterval = null;
let timeRemaining = 0;

let villainStepY = 0;
let villainStepX = 0;

const totalBlocksPerRow = { 2: 3, 3: 2, 4: 1 };
const rowCoordinates = {
    2: { bottom: '400px', left: '100px' },
    3: { bottom: '500px', left: '200px' },
    4: { bottom: '600px', left: '260px' }
};

document.addEventListener("DOMContentLoaded", () => {
    const adventurer = document.getElementById('adventurer');
    const villain = document.getElementById('villain');
    const timerDisplay = document.getElementById('timer-display');
    const timeSpan = document.getElementById('time-left');

    /**
     * Core Mechanics & Timers
     */
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateTimer() {
        if (timeRemaining <= 0) {
            triggerGameOver("O tempo esgotou.");
            return;
        }
        
        timeRemaining--;
        timeSpan.innerText = formatTime(timeRemaining);

        if (timeRemaining <= 10) {
            timerDisplay.classList.add('tempo-acabando');
        }

        const posY = parseFloat(villain.style.bottom || 10);
        const posX = parseFloat(villain.style.left || 630);
        villain.style.bottom = (posY + villainStepY) + 'px';
        villain.style.left = (posX + villainStepX) + 'px';
    }

    function triggerGameOver(alertMsg) {
        clearInterval(timerInterval);
        document.querySelectorAll('.block input').forEach(inp => inp.disabled = true);

        villain.style.bottom = adventurer.style.bottom;
        villain.style.left = adventurer.style.left;

        setTimeout(() => { 
            document.querySelectorAll('.block input').forEach(inp => inp.style.display = 'none');
            document.getElementById('btn-hamburger').style.display = 'none';
            document.getElementById('game-over-screen').style.display = 'flex';
            if(alertMsg) alert(alertMsg);
        }, 600); 
    }

    /**
     * Game Initialization
     */
    function startNewGame(selectedLevel) {
        currentLevel = selectedLevel;
        const config = levelConfig[currentLevel];
        currentErrorLimit = config.maxErros;

        totalErrors = 0;
        activeInputId = null;
        blocksResolvedPerRow = { 2: 0, 3: 0, 4: 0 };
        clearInterval(timerInterval);
        timerDisplay.classList.remove('tempo-acabando');

        adventurer.src = 'img/aventureiro_idle.png';
        adventurer.style.bottom = '300px';
        adventurer.style.left = '30px';
        villain.style.bottom = '10px';
        villain.style.left = '630px';

        const getRandomNum = () => Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
        const baseValues = [getRandomNum(), getRandomNum(), getRandomNum(), getRandomNum()];

        document.getElementById('block-1-1').innerText = baseValues[0];
        document.getElementById('block-1-2').innerText = baseValues[1];
        document.getElementById('block-1-3').innerText = baseValues[2];
        document.getElementById('block-1-4').innerText = baseValues[3];

        solutionMap = {
            'block-2-1': baseValues[0] + baseValues[1],
            'block-2-2': baseValues[1] + baseValues[2],
            'block-2-3': baseValues[2] + baseValues[3],
            'block-3-1': (baseValues[0] + baseValues[1]) + (baseValues[1] + baseValues[2]),
            'block-3-2': (baseValues[1] + baseValues[2]) + (baseValues[2] + baseValues[3]),
            'block-4-1': ((baseValues[0] + baseValues[1]) + (baseValues[1] + baseValues[2])) + ((baseValues[1] + baseValues[2]) + (baseValues[2] + baseValues[3]))
        };

        document.querySelectorAll('.block input').forEach(inp => {
            inp.value = "";
            inp.disabled = false;
            inp.style.display = 'none';
            inp.parentElement.classList.remove('bloco-acerto', 'bloco-erro');
        });

        if (config.tempo) {
            timeRemaining = config.tempo;
            timeSpan.innerText = formatTime(timeRemaining);
            timerDisplay.style.display = 'inline-block';
            
            villainStepY = (300 - 10) / config.tempo;
            villainStepX = (30 - 630) / config.tempo;
            timerInterval = setInterval(updateTimer, 1000);
        } else {
            timerDisplay.style.display = 'none'; 
            villainStepY = 0;
            villainStepX = 0;
        }

        toggleUI('game');
    }

    /**
     * UI & State Handlers
     */
    function toggleUI(state) {
        document.getElementById('start-menu').style.display = state === 'menu' ? 'flex' : 'none';
        document.getElementById('celebration-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'none';
        document.getElementById('in-game-menu-popup').style.display = 'none';
        document.getElementById('btn-hamburger').style.display = state === 'game' ? 'flex' : 'none';
        
        if (state === 'menu') {
            document.getElementById('main-menu-buttons').style.display = 'block';
            document.getElementById('level-select-buttons').style.display = 'none';
        } else if (state === 'game') {
            document.getElementById('verify-btn').disabled = false;
        }
    }

    function returnToMainMenu() {
        clearInterval(timerInterval);
        toggleUI('menu');
    }

    // --- Main Menu Events ---
    document.getElementById('btn-abrir-niveis').addEventListener('click', () => {
        document.getElementById('main-menu-buttons').style.display = 'none';
        document.getElementById('level-select-buttons').style.display = 'block';
    });
    document.getElementById('btn-voltar-menu').addEventListener('click', () => {
        document.getElementById('main-menu-buttons').style.display = 'block';
        document.getElementById('level-select-buttons').style.display = 'none';
    });
    document.querySelectorAll('.btn-nivel').forEach(btn => {
        btn.addEventListener('click', (e) => startNewGame(e.target.getAttribute('data-nivel')));
    });

    // --- In-Game Controls Events ---
    document.getElementById('btn-hamburger').addEventListener('click', () => {
        const popup = document.getElementById('in-game-menu-popup');
        popup.style.display = (popup.style.display === 'flex') ? 'none' : 'flex';
    });
    document.getElementById('btn-in-game-restart').addEventListener('click', () => startNewGame(currentLevel));
    document.getElementById('btn-in-game-menu').addEventListener('click', returnToMainMenu);
    document.querySelectorAll('.btn-restart').forEach(btn => btn.addEventListener('click', () => startNewGame(currentLevel)));
    document.querySelectorAll('.btn-main-menu').forEach(btn => btn.addEventListener('click', returnToMainMenu));

    // --- Instructions Modal Events ---
    document.getElementById('btn-como-jogar').addEventListener('click', () => document.getElementById('instructions-modal').style.display = 'block');
    document.getElementById('btn-fechar-instrucoes').addEventListener('click', () => document.getElementById('instructions-modal').style.display = 'none');
    
    const btnRegras = document.getElementById('tab-btn-regras'), btnExemplos = document.getElementById('tab-btn-exemplos');
    const tabRegras = document.getElementById('tab-regras'), tabExemplos = document.getElementById('tab-exemplos');
    
    btnRegras.addEventListener('click', () => { 
        btnRegras.classList.add('active'); tabRegras.classList.add('active'); 
        btnExemplos.classList.remove('active'); tabExemplos.classList.remove('active'); 
    });
    btnExemplos.addEventListener('click', () => { 
        btnExemplos.classList.add('active'); tabExemplos.classList.add('active'); 
        btnRegras.classList.remove('active'); tabRegras.classList.remove('active'); 
    });

    /**
     * Input & Verification Logic
     */
    document.querySelectorAll('.block input').forEach(inputElement => {
        const divBlock = inputElement.parentElement;
        const blockId = inputElement.id;

        divBlock.addEventListener('click', () => {
            if (inputElement.disabled) return; 
            if (activeInputId && activeInputId !== blockId) {
                const prevInput = document.getElementById(activeInputId);
                if (!prevInput.disabled) prevInput.style.display = 'none';
            }
            inputElement.style.display = 'block';
            inputElement.focus();
            activeInputId = blockId;
        });

        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { 
                e.preventDefault(); 
                document.getElementById('verify-btn').click(); 
            }
        });
    });

    document.getElementById('verify-btn').addEventListener('click', () => { 
        if (!activeInputId) { 
            alert("Selecione um bloco da pirâmide."); 
            return; 
        }

        const inputElement = document.getElementById(activeInputId); 
        const inputValue = parseInt(inputElement.value); 
        const correctValue = solutionMap[activeInputId]; 

        if (isNaN(inputValue)) return; 

        if (inputValue === correctValue) { 
            inputElement.parentElement.classList.remove('bloco-erro'); 
            inputElement.parentElement.classList.add('bloco-acerto'); 
            inputElement.disabled = true;
            
            const row = parseInt(activeInputId.split('-')[1]);
            blocksResolvedPerRow[row]++;

            if (row === 4) {
                clearInterval(timerInterval); 
                adventurer.src = 'img/aventureiro_subindo.png'; 
                adventurer.style.bottom = rowCoordinates[4].bottom;
                adventurer.style.left = rowCoordinates[4].left;
                document.getElementById('btn-hamburger').style.display = 'none';

                setTimeout(() => document.getElementById('celebration-screen').style.display = 'flex', 2000);
            } else {
                if (blocksResolvedPerRow[row] === 1) adventurer.src = 'img/aventureiro_subindo.png';
                if (blocksResolvedPerRow[row] === totalBlocksPerRow[row]) {
                    adventurer.src = 'img/aventureiro_idle.png'; 
                    adventurer.style.bottom = rowCoordinates[row].bottom;
                    adventurer.style.left = rowCoordinates[row].left;
                }
            }
            activeInputId = null; 

        } else {
            inputElement.parentElement.classList.remove('bloco-acerto'); 
            inputElement.parentElement.classList.add('bloco-erro'); 
            inputElement.value = "";
            totalErrors++; 

            if (totalErrors >= currentErrorLimit) {
                triggerGameOver();
            } else {
                const posY = parseFloat(window.getComputedStyle(villain).bottom);
                const posX = parseFloat(window.getComputedStyle(villain).left);
                villain.style.bottom = (posY + 60) + 'px'; 
                villain.style.left = (posX - 60) + 'px'; 
            }
        }
    });
});
