const tableRows = document.querySelectorAll("#game-table .row");

for (row of tableRows) {
    for (let i = 0; i < 5; i++) {
        const square = document.createElement("div");
        square.setAttribute("data-filled", false);
        square.classList.add("square");
        row.appendChild(square);
    }
}

let currentRow = tableRows[0];
let currentSquare = currentRow.firstChild;

//Creates a list with the charcode of all 26 letters and then convert then to string.
const allowedKeyCodes = Array(26).fill().map((value, index) => index + 65);
const allowedKeyCharacters = allowedKeyCodes.map(keyCode => String.fromCharCode(keyCode));

let wordIndex = Math.floor(Math.random() * (all_words.length + 1));
let secretWord = Array.from(all_words[wordIndex]);


const keyPressHandler = function (evt, fromKeyboard = false) {
    if (currentSquare === currentRow.lastChild && currentSquare.innerText) return;

    currentSquare.setAttribute("data-filled", true);

    //The 'this' will refer to a key that's being pressed using the mouse.
    currentSquare.innerText = fromKeyboard ? evt.key.toUpperCase() : this.innerText;

    currentSquare.nextElementSibling && (currentSquare = currentSquare.nextElementSibling);

}

const enterPressHandler = function (evt) {
    //Create a list to check if there is no square left empty.
    let squareStates = Array.prototype.map.call(currentRow.children, square => square.getAttribute("data-filled") === "true");
    if (squareStates.every(isFilled => isFilled)) {
        //Returns to prevent the game from 'ending' twice if correct guess happens in the last row or skipping to the next row.
        if (compareWords()) return winBounce();

        if (currentRow.nextElementSibling) {
            currentRow = currentRow.nextElementSibling;
            currentSquare = currentRow.firstChild;
        } else {
            gameOver(false);
        }

    } else {
        currentRow.classList.add('invalid');
        setTimeout(() => {
            currentRow.classList.remove('invalid');
        }, 500);
        showMessage("Not enough letters");
    }
}

const backspacePressHandler = function (evt) {
    if (currentSquare.previousElementSibling && currentSquare.getAttribute("data-filled") === "false") {
        currentSquare = currentSquare.previousElementSibling;
        currentSquare.setAttribute("data-filled", false);
        currentSquare.innerText = "";
    } else {
        currentSquare.innerText = "";
        currentSquare.setAttribute("data-filled", false);
    }
}

const compareWords = function () {
    //Using objects instead of lists because the indexes won't change after I delete one item.
    let userGuess = {};
    let wordCopy = {};
    for (let i = 0; i < 5; i++) {
        userGuess[i] = currentRow.children[i].innerText;
        wordCopy[i] = secretWord[i];
    }

    //Loop to define the correct ones: (I'm deleting the items to prevent they from having more than one class. Ex: present and correct)
    for (let index in userGuess) {
        if (userGuess[index] === wordCopy[index]) {
            currentRow.children[index].classList.add("correct");
            let correctKey = document.querySelector(`#keyboard button[data-value='${userGuess[index]}']`);
            correctKey.classList.add("correct");
            delete userGuess[index];
            delete wordCopy[index];
        }
    }
    //If the userGuess object is empty after the first loop it means that all the letters match and the user wins.
    if (Object.keys(userGuess).length === 0) return true;

    //Loop to define the present ones:
    for (let guessIndex in userGuess) {
        for (let wordIndex in wordCopy) {
            if (userGuess[guessIndex] === wordCopy[wordIndex]) {
                currentRow.children[guessIndex].classList.add("present");
                let presentKey = document.querySelector(`#keyboard button[data-value='${userGuess[guessIndex]}']`);
                presentKey.classList.add("present");
                delete userGuess[guessIndex];
                delete wordCopy[wordIndex];
            }
        }
    }
    //Last loop to define the wrong ones (the only ones left):
    for (let index in userGuess) {
        currentRow.children[index].classList.add("wrong");
        let wrongKey = document.querySelector(`#keyboard button[data-value='${userGuess[index]}']`);
        wrongKey.classList.add("wrong");
    }
}

const normalKeys = document.querySelectorAll('#keyboard button:not(.big-key)');
const [enterKey, backspaceKey] = document.querySelectorAll('.big-key');

for (key of normalKeys) {
    key.addEventListener("click", keyPressHandler);
}

enterKey.addEventListener("click", enterPressHandler);

backspaceKey.addEventListener("click", backspacePressHandler);

document.addEventListener("keydown", (evt) => {
    //To prevent some bugs from happening when keys are pressed when the game is already over.
    if (isGameOver) return;

    if (allowedKeyCharacters.includes(evt.key.toUpperCase())) {
        keyPressHandler(evt, true);
    }
    else if (evt.key === "Enter") {
        enterPressHandler();
    }
    else if (evt.key === "Backspace") {
        backspacePressHandler();
    }
})