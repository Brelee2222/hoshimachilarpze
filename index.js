const { loadMessageLog } = require("./messageLogging.js");

// load message log as the first step
loadMessageLog();
console.log("Loaded message dataset");

// Iniatlize the bot
require("./events.js");