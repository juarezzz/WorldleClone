let isGameOver = false;

const messageBox = document.getElementById('message-box')

const showMessage = function (text) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.innerText = text;
    messageBox.prepend(message);
    setTimeout(() => message.remove(), 1500);
}

const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const closeButton = document.getElementById('modal-close-button');
const result = document.getElementById('result');
const statistics = document.querySelectorAll('.statistic');
const graphBars = document.querySelectorAll('.graph-bar');

let playedGames = 0;
let wins = 0;
let winRatio = 0;
let currentStreak = 0;
let maxStreak = 0;
let guessDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
}

//That winning animation
const winBounce = async function () {
    for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => {
            setTimeout(() => {
                currentRow.children[i].classList.add('winner');
                resolve();
            }, 180);
        })
    }
    gameOver(true);
}

const gameOver = function (correct) {
    isGameOver = true;
    result.classList.remove('correct', 'wrong');

    if (correct) {
        result.innerText = "You Got It!";
        result.classList.add('correct');
        wins++;
        currentStreak++;
        maxStreak = currentStreak > maxStreak ? currentStreak : maxStreak;
        
        //Update the graph bars.
        const currentRowIndex = Array.prototype.indexOf.call(tableRows, currentRow);
        const guessesNum = ++guessDistribution[currentRowIndex + 1];
        graphBars[currentRowIndex].innerText = guessesNum;
        graphBars[currentRowIndex].style.width = 15 * guessesNum < 100 ? `${15 * guessesNum}%` : '100%';

    } else {
        result.innerText = `Answer: ${secretWord.join('')}`;
        result.classList.add('wrong');
        currentStreak = 0;
    }

    playedGames++;
    winRatio = (wins / playedGames * 100).toFixed();

    statistics[0].innerText = playedGames;
    statistics[1].innerText = `${winRatio}%`;
    statistics[2].innerText = currentStreak;
    statistics[3].innerText = maxStreak;

    overlay.classList.add('active');
    modal.classList.add('active');
}

const restartGame = function () {
    for (row of tableRows) {
        for (square of row.children) {
            square.innerText = '';
            square.classList.remove('correct', 'wrong', 'present', 'winner');
            square.setAttribute('data-filled', false);
        }
    }

    for (key of normalKeys) {
        key.classList.remove('correct', 'wrong', 'present');
    }

    wordIndex = Math.floor(Math.random() * (all_words.length + 1));
    secretWord = Array.from(all_words[wordIndex]);

    currentRow = tableRows[0];
    currentSquare = currentRow.firstChild;

    isGameOver = false;
}

const hideOverlay = function () {
    overlay.classList.remove('active');
    modal.classList.remove('active');
    restartGame();
}

overlay.addEventListener('click', hideOverlay);
closeButton.addEventListener('click', hideOverlay);