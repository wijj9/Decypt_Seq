const grid = document.getElementById("grid");
const timerBar = document.getElementById("timer");
const pressCountDisplay = document.getElementById("pressCount");
const errorSound = document.getElementById("errorSound");
const successSound = document.getElementById("successSound");
const clickSound = document.getElementById("clickSound");
const totalBoxes = 25;

const emojiList = ["💻", "🌐", "❤", "🍣", "🦴", "🍙", "🍰", "🍇", "🍉", "💀", "🍌", "🍍", "🍑", "🍋", "🍊", "🤖", "🍇", "🎢", "🧠", "🐋", "🎳", "💩", "⛏️"];

const correctSequence = ["💻", "🌐", "java", "canary"];

let currentSequence = [];
let correctClicks = 0;
const shuffleInterval = 10000;

const coffeeImage = "media/java.png";
const canaryImage = "media/canary-bird.png";

function shuffleEmojis() {
    let randomizedEmojis = [...emojiList, 'canary', 'java'];
    randomizedEmojis.sort(() => 0.5 - Math.random());
    return randomizedEmojis;
}

function resetOnLoad() {
    correctClicks = 0;
    currentSequence = [];
    resetGrid(); // Your existing function to reset the grid state
}

// Function to initialize the grid
function initializeGrid() {
    grid.innerHTML = ""; // Clear the grid
    const emojis = shuffleEmojis();

    for (let i = 0; i < totalBoxes; i++) {
        const box = document.createElement("div");
        box.classList.add("box");

        const emoji = emojis[i];

        if (emoji === 'canary') {
            const img = document.createElement("img");
            img.src = canaryImage;
            img.alt = "Canary";
            img.classList.add("image-emoji");
            box.appendChild(img);
        } else if (emoji === 'java') {
            const img = document.createElement("img");
            img.src = coffeeImage;
            img.alt = "Java";
            img.classList.add("image-emoji");
            box.appendChild(img);
        } else {
            box.textContent = emoji;
        }

        box.dataset.emoji = emoji;
        box.addEventListener("click", () => handleBoxClick(box));
        grid.appendChild(box);
    }

    resetTimer();
}

function handleBoxClick(box) {
    clickSound.play();

    if (currentSequence.length >= 4) {
        return;
    }

    const clickedEmoji = box.dataset.emoji;

    if (currentSequence.includes(clickedEmoji) || box.classList.contains("clicked") || box.classList.contains("wrong")) {
        box.classList.remove("clicked", "wrong");

        const boxIndex = currentSequence.indexOf(clickedEmoji);
        if (boxIndex > -1) {
            currentSequence.splice(boxIndex, 1);
        }

        if (correctSequence.includes(clickedEmoji)) {
            correctClicks--;
        }
    } else {
        currentSequence.push(clickedEmoji);
        box.classList.add("clicked");

        if (correctSequence.includes(clickedEmoji)) {
            correctClicks++;
        } else {
            box.classList.add("wrong");
        }
    }

    pressCountDisplay.textContent = `Selected: ${currentSequence.length}/4`;

    if (currentSequence.length === 4) {
        if (correctClicks === 4) {
            successSound.play();
            setTimeout(() => {
                window.location.href = "https://wajihtarkhani.site";
            }, 500);
        } else {
            errorSound.play();
            setTimeout(() => {
                resetGrid();
            }, 200);
        }
    }
}

function resetGrid() {
    correctClicks = 0;
    currentSequence = [];
    document.querySelectorAll(".box").forEach(box => box.classList.remove("clicked", "wrong"));
    pressCountDisplay.textContent = `Selected: ${currentSequence.length}/4`;
}

function resetTimer() {
    if (currentSequence.length < 4) {
        errorSound.play();
    }
    resetGrid();
    timerBar.style.transition = 'none';
    timerBar.style.width = '310px';
    void timerBar.offsetWidth;
    timerBar.style.transition = `width ${shuffleInterval / 1000}s linear`;
    timerBar.style.width = '0%';
}

initializeGrid();

setInterval(initializeGrid, shuffleInterval);

window.onload = resetOnLoad;
