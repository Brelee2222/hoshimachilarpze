const fs = require("fs");
const { addMessageWords } = require("./wordFrequencies.js");

const DATA_SET_FOLDER = "messageDataSets";

const TARGET_USER_ID = '479792413884547072'; // Bre

const MESSAGES_FILE = `${DATA_SET_FOLDER}/messages${TARGET_USER_ID}.txt`;

function loadMessageLog() {
    for(message of fs.readFileSync(MESSAGES_FILE).toString().trim().split("\n")) {
        const words = parseMessage(message);

        if(words.length == 0)
            return;

        addMessageWords(words);
    }
}

function parseMessage(message) {
    return message
        .split(/\s/)
        .filter(word => word.length)
        .map(word => word.toLocaleLowerCase());
}

function logMessageWords(words) {
    const messagesFile = fs.readFileSync(MESSAGES_FILE);
    fs.writeFileSync(MESSAGES_FILE, `${messagesFile}${words.join(" ")}\n`);
}

function processMessageContent(messages) {
    for(message of messages.replaceAll(/[.!?] /g, "\n").split("\n")) {
        const words = parseMessage(message);

        if(words.length == 0)
            return;

        logMessageWords(words);
        addMessageWords(words);
    }
}

module.exports = {
    processMessageContent,
    loadMessageLog,
    TARGET_USER_ID,
    DATA_SET_FOLDER,
    MESSAGES_FILE
};