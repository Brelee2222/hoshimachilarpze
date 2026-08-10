const fs = require("fs");
const { MESSAGES_FILE, DATA_SET_FOLDER } = require("./messageLogging.js");

// Make the folder
if(!fs.existsSync(DATA_SET_FOLDER))
    fs.mkdirSync(DATA_SET_FOLDER);

// Make the file
if(!fs.existsSync(MESSAGES_FILE))
    fs.writeFileSync(MESSAGES_FILE, "");