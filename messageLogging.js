const fs = require("fs");
const { addMessageWords } = require("./wordFrequencies.js");

const DATA_SET_FOLDER = "messageDataSets";

// const TARGET_USER_ID = '1'; // BeeMovie
// const TARGET_USER_ID = '2'; // combined
// const TARGET_USER_ID = '618244797723049987'; // Naze
// const TARGET_USER_ID = '1534110827572105258'; // Adachi Rei
// const TARGET_USER_ID = 'ReiRoast' // Rei Roasting
// const TARGET_USER_ID = '950703223143026738'; // CWill
const TARGET_USER_ID = '479792413884547072'; // Bre
// const TARGET_USER_ID = '843270049317650482' // spongebob
// const TARGET_USER_ID = '828468791671390269' // Argon
// const TARGET_USER_ID = 'CWillInfection' // CWILL INFECTION

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
        .filter(word => word != "")
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