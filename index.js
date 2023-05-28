const fs = require('fs');
const os = require('os');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

function scoreWord(board, word) {
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
  const wordLength = word.word.length;
  const wordArray = word.word.split('');
  let row = word.startRow;
  let col = word.startCol;

  for(let i = 0; i < wordLength; i++){
    if(board[row][col] == wordArray[i]){
      score += letterScores[wordArray[i]];
    }

    if(word.direction === 'horizontal'){
      col++;
    }else{
      row++;
    }
  }

  return score;
}

function tempPath() {
  return path.join(os.tmpdir(), 'temp-' + Date.now() + '.json');
}

function writeJsonToTempFile(jsonObject) {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(jsonObject);
    const filename = tempPath();
    fs.writeFile(filename, jsonString, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filename);
      }
    });
  });
}

async function uploadFile(fileName, gameName) {
  const bucketName = "gs://scrabble-io";
  const storage = new Storage();
  try {
    await storage.bucket(bucketName).upload(fileName, {
      gzip: true,
      destination: gameName,
      metadata: {
        cacheControl: 'no-cache',
      },
    });

    console.log(`${fileName} uploaded to ${bucketName}.`);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

async function getFile(gameName, dest) {
  const bucketName = "gs://scrabble-io";
  const storage = new Storage();

  const options = {
    destination: dest,
  };

  try {
    await storage.bucket(bucketName).file(gameName).download(options);
    console.log(
      `File ${gameName} downloaded to ${dest}.`
    );
  } catch (err) {
    console.error('ERROR:', err);
  }
}

const gameid = "test-123456"
let board = {
  "0": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "1": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "2": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "3": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "4": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "5": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "6": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "7": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "8": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "9": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "10": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "11": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "12": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "13": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
  "14": {"0": "", "1": "", "2": "", "3": "", "4": "", "5": "", "6": "", "7": "", "8": "", "9": "", "10": "", "11": "", "12": "", "13": "", "14": ""},
}
let game = {
  "turn": 0,
  "tiles": {
    "a": 9,
    "b": 2,
    "c": 2,
    "d": 4,
    "e": 12,
    "f": 2,
    "g": 3,
    "h": 2,
    "i": 9,
    "j": 1,
    "k": 1,
    "l": 4,
    "m": 2,
    "n": 6,
    "o": 8,
    "p": 2,
    "q": 1,
    "r": 6,
    "s": 4,
    "t": 6,
    "u": 4,
    "v": 2,
    "w": 2,
    "x": 1,
    "y": 2,
    "z": 1,
    "blank": 2
  },
  "board": board
}

writeJsonToTempFile(game)
  .then(filename => {
    uploadFile(filename, gameid)
      .then(() => {
        getFile(gameid, "./test")
          .then(() => {
            fs.unlink(filename, (err) => {
              if (err) {
                console.error('Error deleting file:', err);
              } else {
                console.log('File deleted:', filename);
              }
          });
      });
    });
  })
  .catch(err => {
    console.error('Error writing file:', err);
  });

uploadFile("./dictionary.json", "dictionary.json")

https://jsfiddle.net/tche4vjn/77/
