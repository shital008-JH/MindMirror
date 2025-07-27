let playerName = "";

window.onload = function() {
document.getElementById('popup-overlay').style.display = 'flex';
document.getElementById('name-popup-overlay').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', function() {
document.getElementById('close-popup').onclick = function() {
    document.getElementById('popup-overlay').style.display = 'none';
    // Show name popup
    document.getElementById('name-popup-overlay').style.display = 'flex';
    document.getElementById('player-name-input').focus();
};

document.getElementById('player-name-submit').onclick = function() {
    const nameInput = document.getElementById('player-name-input');
    let name = nameInput.value.trim();
    if (!name) {
    nameInput.style.borderColor = "#e74c3c";
    nameInput.focus();
    return;
    }
    playerName = name;
    document.getElementById('name-popup-overlay').style.display = 'none';
    // Display the greeting!
    document.getElementById('greeting').textContent = `Hi🙂, ${playerName}`;
    createBoard();
};
  // Optional: submit on Enter
document.getElementById('player-name-input').addEventListener('keypress', function(e){
    if(e.key==='Enter'){ document.getElementById('player-name-submit').click(); }
});
});


// List of icons for your custom theme:
const icons = ['🪖','🎯','💣','🎥','🍧','🍁','🍵','🍋'];
const cards = [...icons, ...icons]; // 8 pairs (16 cards)
const maxMoves = 16; // Your custom move count

function shuffle(array) {
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}
}

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;


// --- MAIN GAME LOGIC ---
function createBoard() {
shuffle(cards);
const board = document.getElementById('game-board');
board.innerHTML = '';
cards.forEach((icon, idx) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.dataset.index = idx;
    div.dataset.icon = icon;
    div.textContent = '';
    div.addEventListener('click', flipCard);
    board.appendChild(div);
});
moves = 0;
matchedPairs = 0;
document.getElementById('moves').textContent = 'Moves: 0';
document.getElementById('msg').textContent = '';
toggleRetryButton(false);
}

function flipCard(e) {
  if (matchedPairs === icons.length || moves >= maxMoves) return; // Game ended
const card = e.currentTarget;
if (
    card.classList.contains('flipped') ||
    card.classList.contains('matched') ||
    flippedCards.length === 2
)
    return;

card.classList.add('flipped');
card.textContent = card.dataset.icon;
flippedCards.push(card);

if (flippedCards.length === 2) {
    moves++;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
    checkMatch();
    if(moves === maxMoves && matchedPairs !== icons.length) {
    gameLost();
    }
}
}

function checkMatch() {
const [card1, card2] = flippedCards;
if (card1.dataset.icon === card2.dataset.icon) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    if (matchedPairs === icons.length) {
    gameWon();
    }
    flippedCards = [];
} else {
    setTimeout(() => {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '';
    card2.textContent = '';
    flippedCards = [];
    }, 900);
}
}

function gameWon() {
document.getElementById('msg').textContent = `Congratulations! You won in ${moves} moves.`;
toggleRetryButton(true, 'Reshuffle & Play Again');
}

function gameLost() {
document.getElementById('msg').textContent = `Sorry! You lost the game.`;
toggleRetryButton(true, 'Retry');
}

function toggleRetryButton(show, text) {
let container = document.getElementById('button-container');
if (show) {
    if (!container) {
    createRetryButton(text);
    } else {
    container.style.display = 'block';
    container.querySelector('button').textContent = text;
    }
} else {
    if (container) container.style.display = 'none';
}
}

function createRetryButton(text) {
const container = document.createElement('div');
container.id = 'button-container';
container.style.marginTop = '20px';
container.style.marginBottom = '20px';
const button = document.createElement('button');
button.textContent = text;
button.style.padding = '10px 20px';
button.style.fontSize = '16px';
button.style.cursor = 'pointer';
button.addEventListener('click', () => {
    createBoard();
});
container.appendChild(button);

  // Insert the button container after the #msg but before #credits
const msgDiv = document.getElementById('msg');
const creditsDiv = document.getElementById('credits');
if (creditsDiv) {
    creditsDiv.parentNode.insertBefore(container, creditsDiv);
} else {
    // fallback: just after #msg if no creditsDiv found
    msgDiv.parentNode.insertBefore(container, msgDiv.nextSibling);
}
}
