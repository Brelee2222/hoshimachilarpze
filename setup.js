const fs = require("fs");
const { MESSAGES_FILE, DATA_SET_FOLDER } = require("./messageLogging.js");

if(!fs.existsSync(DATA_SET_FOLDER))
    fs.mkdirSync(DATA_SET_FOLDER);

if(!fs.existsSync(MESSAGES_FILE))
    fs.writeFileSync(MESSAGES_FILE, "");