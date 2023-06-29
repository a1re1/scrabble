let wordBank;
const request = new XMLHttpRequest();
request.open('GET', '../resources/dictionary.json', true);
request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        wordBank = JSON.parse(request.responseText);
    }
};
request.send();

const boardPoints = {
    0: {0: "tw", 1: "", 2: "", 3: "dl", 4: "", 5: "", 6: "", 7: "tw", 8: "", 9: "", 10: "", 11: "dl", 12: "", 13: "", 14: "tw"},
    1: {0: "", 1: "dw", 2: "", 3: "", 4: "", 5: "tl", 6: "", 7: "", 8: "", 9: "tl", 10: "", 11: "", 12: "", 13: "dw", 14: ""},
    2: {0: "", 1: "", 2: "dw", 3: "", 4: "", 5: "", 6: "dl", 7: "", 8: "dl", 9: "", 10: "", 11: "", 12: "dw", 13: "", 14: ""},
    3: {0: "dl", 1: "", 2: "", 3: "dw", 4: "", 5: "", 6: "", 7: "dl", 8: "", 9: "", 10: "", 11: "dw", 12: "", 13: "", 14: "dl"},
    4: {0: "", 1: "", 2: "", 3: "", 4: "dw", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "dw", 11: "", 12: "", 13: "", 14: ""},
    5: {0: "", 1: "tl", 2: "", 3: "", 4: "", 5: "tl", 6: "", 7: "", 8: "", 9: "tl", 10: "", 11: "", 12: "", 13: "tl", 14: ""},
    6: {0: "", 1: "", 2: "dl", 3: "", 4: "", 5: "", 6: "dl", 7: "", 8: "dl", 9: "", 10: "", 11: "", 12: "dl", 13: "", 14: ""},
    7: {0: "tw", 1: "", 2: "", 3: "dl", 4: "", 5: "", 6: "", 7: "s", 8: "", 9: "", 10: "", 11: "dl", 12: "", 13: "", 14: "tw"},
    8: {0: "", 1: "", 2: "dl", 3: "", 4: "", 5: "", 6: "dl", 7: "", 8: "dl", 9: "", 10: "", 11: "", 12: "dl", 13: "", 14: ""},
    9: {0: "", 1: "tl", 2: "", 3: "", 4: "", 5: "tl", 6: "", 7: "", 8: "", 9: "tl", 10: "", 11: "", 12: "", 13: "tl", 14: ""},
    10: {0: "", 1: "", 2: "", 3: "", 4: "dw", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "dw", 11: "", 12: "", 13: "", 14: ""},
    11: {0: "dl", 1: "", 2: "", 3: "dw", 4: "", 5: "", 6: "", 7: "dl", 8: "", 9: "", 10: "", 11: "dw", 12: "", 13: "", 14: "dl"},
    12: {0: "", 1: "", 2: "dw", 3: "", 4: "", 5: "", 6: "dl", 7: "", 8: "dl", 9: "", 10: "", 11: "", 12: "dw", 13: "", 14: ""},
    13: {0: "", 1: "dw", 2: "", 3: "", 4: "", 5: "tl", 6: "", 7: "", 8: "", 9: "tl", 10: "", 11: "", 12: "", 13: "dw", 14: ""},
    14: {0: "tw", 1: "", 2: "", 3: "dl", 4: "", 5: "", 6: "", 7: "tw", 8: "", 9: "", 10: "", 11: "dl", 12: "", 13: "", 14: "tw"},
}

const game = document.getElementById('game');

function initSlots() {
    for (let i = 0; i < 15; i++) {
        const row = document.createElement('tr');
        row.className = 'row';
        for (let j = 0; j < 15; j++) {
            const slot = document.createElement('td');
            const type = boardPoints[i][j]
            slot.className = 'slot ' + type;
            slot.id = "s-" + i + "-" + j;
            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = type;
            slot.appendChild(label)

            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.draggable = true;

            slot.appendChild(tile);
            row.appendChild(slot);
        }
        game.appendChild(row);
    }
    document.getElementById("validate").addEventListener("click", () => sendMove());
}

function initGameConfig() {
    getGameInfo("test-123456")
        .then(configuration => {
            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 15; j++) {
                    const tile = document.getElementById("s-" + i + "-" + j).querySelector(".tile")
                    if (configuration["board"]["" + i]["" + j] !== "") {
                        tile.textContent = configuration["board"]["" + i]["" + j];
                    }
                }
            }
            const hand = configuration["hands"][0];
            // const hand = configuration["hands"][0]
            // const tiles = configuration["tiles"];
            for (let i = 0; i <= 6; i++) {
                // const letter = drawTile(tiles);
                // tiles[letter] -= tiles[letter];
                const slot = document.getElementById("h-" + i).querySelector(".tile");
                slot.textContent = hand[i];
            }
        })

}

function getGameInfo(gameId) {
    return fetch('https://us-central1-personal-website-215401.cloudfunctions.net/scrabble')
        .then(response => { return response.json() });
}

function updateGameInfo(gameConfiguration) {
    fetch('https://us-central1-personal-website-215401.cloudfunctions.net/scrabble',
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameConfiguration)
        }
        )
        .then(response => {
            return response.text()
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

function sendMove() {
    getGameInfo("test-123456")
        .then(serverInfo => {
            const proposedBoard = getCurrentBoardState();

            if (!validateBoard(serverInfo["board"], proposedBoard)) {
                return;
            }

            return {
                "playerCount": 2,
                "turn": serverInfo["turn"] + 1,
                "tiles": serverInfo["tiles"],
                "hands": {
                    0: getCurrentHandState(serverInfo["tiles"]),
                    1: [],
                },
                "points": {
                    0: 5,
                    1: 10,
                },
                "board": proposedBoard
            };
        })
        .then(validatedConfiguration => {
                if (validatedConfiguration) {
                    updateGameInfo(validatedConfiguration)
                    console.log("validated configuration - sending to server")
                    console.log(validatedConfiguration)
                }
            }
        )
}

const rules = [
    ruleCanOnlyPlaceStraightLines,
    ruleAllWordsOnBoardMustBeValid,
    ruleCanOnlyPlaceOnOpenTiles,
    ruleMustPlaceAdjacentToExistingLetter
]
function validateBoard(serverBoard, proposedBoard) {
    for (let i = 0; i < rules.length; ++i) {
        if(!rules[i](serverBoard, proposedBoard)) {
            console.error("Broke rule: ", rules[i].name);
            return false;
        }
    }
    return true;
}

function ruleCanOnlyPlaceOnOpenTiles(serverBoard, proposedBoard) {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const serverTile = serverBoard[i][j];
            const proposedTile = proposedBoard[i][j];
            if (serverTile !== "" && serverTile !== proposedTile) {
                console.error("cannot change a placed tile")
                return false;
            }
        }
    }
    return true;
}

function ruleAllWordsOnBoardMustBeValid(serverBoard, proposedBoard) {
    const words = []
    for (let i = 0; i < 15; i++) {
        let hWord = "";
        let vWord = "";
        for (let j = 0; j < 15; j++) {
            const horizontalTile = proposedBoard[i][j];
            const verticalTile = proposedBoard[j][i];
            if (horizontalTile !== "") {
                hWord += horizontalTile
            } else if (horizontalTile === "" && hWord !== "") {
                words.push(hWord)
                hWord = "";
            }
            if (verticalTile !== "") {
                vWord += verticalTile
            } else if (verticalTile === "" && vWord !== "") {
                words.push(vWord)
                vWord = "";
            }
        }
        if (hWord !== "") {
            words.push(hWord)
        }
        if (vWord !== "") {
            words.push(vWord)
        }
    }
    for (let i = 0; i < words.length; i++) {
        if (words[i].length > 1 && !wordBank.includes(words[i])) {
            console.error("word not valid: ", words[i]);
            return false;
        }
    }
    return true;
}

function ruleCanOnlyPlaceStraightLines(serverBoard, proposedBoard) {
    const cols = [];
    const rows = [];

    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (serverBoard[i][j] !== "") {
                continue;
            }

            const proposedTile = proposedBoard[i][j];
            if (proposedTile !== "") {
                cols.push(i);
                rows.push(j);
            }
        }
    }
    return (cols.length > 0 && cols.every(item => item === cols[0])) || (rows.length > 0 && rows.every(item => item === rows[0]));
}

function ruleMustPlaceAdjacentToExistingLetter(serverBoard, proposedBoard) {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (serverBoard[i][j] === "" && proposedBoard[i][j] !== "") {
                if (i-1 > 0) {
                    if (serverBoard[i-1][j]) {
                        return true;
                    }
                }
                if (i+1 < 15) {
                    if (serverBoard[i+1][j]) {
                        return true;
                    }
                }
                if (j-1 > 0) {
                    if (serverBoard[i][j-1]) {
                        return true;
                    }
                }
                if (j+1 > 0) {
                    if (serverBoard[i][j+1]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function getCurrentBoardState() {
    const board = {
        0: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        1: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        2: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        3: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        4: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        5: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        6: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        7: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        8: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        9: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        10: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        11: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        12: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        13: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
        14: {0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: ""},
    }
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const slot = document.getElementById("s-" + i + "-" + j);
            const value = slot.querySelector(".tile").textContent;
            const modifier = slot.querySelector(".label").textContent;
            if (value !== "" ) {
                board[i][j] = value;
            }
        }
    }
    return board;
}

function getCurrentHandState(tiles) {
    const hand = []
    for (let i = 0; i <= 6; i++) {
        const slot = document.getElementById("h-" + i).querySelector(".tile");
        if (slot.textContent === "") {
            const draw = drawTile(tiles);
            slot.textContent = draw;
            tiles[draw] -= 1;
        }
        hand.push(slot.textContent);
    }
    return hand;
}

function scoreWord(board, placedLetters) {
    const letterScores = {
        'A': 1, 'E': 1, 'I': 1, 'O': 1, 'U': 1, 'L': 1, 'N': 1, 'R': 1, 'S': 1, 'T': 1,
        'D': 2, 'G': 2,
        'B': 3, 'C': 3, 'M': 3, 'P': 3,
        'F': 4, 'H': 4, 'V': 4, 'W': 4, 'Y': 4,
        'K': 5,
        'J': 8, 'X': 8,
        'Q': 10, 'Z': 10
    };

    let score = 0;

    return score;
}

function drawTile(pool) {
    let size = 0;
    for (let i = 97; i <= 122; i++) {
        const letter = String.fromCharCode(i);
        size += pool[letter];
    }
    size += pool["blank"];
    const tile = Math.floor(Math.random() * size);
    let delta = 0;
    for (let i = 97; i <= 122; i++) {
        const letter = String.fromCharCode(i);
        delta += pool[letter];
        if (tile < delta) {
            return letter;
        }
    }
    return "blank";
}

function isPlayerTurn(turn, player, countPlayers) {
    return turn % countPlayers === player;
}

initSlots();
initGameConfig();