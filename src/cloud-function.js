const functions = require('@google-cloud/functions-framework');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const gameid = 'test-123456'

functions.http('scrabble', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET, PUT, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else if (req.method === 'PUT') {
        // update the game
        updateGame(gameid, req.body, res);
    } else if (req.method === 'POST') {
        // create new game
        // todo make game id
        // todo make game json
        updateGame(gameid, req.body, res);
    } else if (req.method === 'GET') {
        // get current game state
        const temp = tempPath();
        // todo game name from query params
        getFile(gameid, temp)
            .then(() => fs.readFileSync(temp, 'utf8'))
            .then((file) => res.send(file));
    }
});

function updateGame(gameId, gameJson, res) {
    writeJsonToTempFile(gameJson)
        .then(filename => {
            uploadFile(filename, gameId)
                .then(() => { fs.unlink(filename, () => {
                    res.send(gameId);
                });
                });
        });
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
