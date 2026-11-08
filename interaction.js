const 
    { client } = require("./client.js"),
    { generatePhrase, rootWords } = require('./wordFrequencies.js'),
    { TARGET_USER_ID, processMessageContent } = require("./messageLogging.js");

const 
    // Who controls the bot
    OWNER_ID = 479792413884547072,

    // Durations for when it replies
    TYPING_DURATION = 3000,
    REPLY_TIME_BEFORE_DELETE = 300000,
    DELETE_MESSAGES = false;

    // Line enders
    NEW_LINE_ENDERS = [
        " :3",
        // "chu!",
        " 💗",
        // " 😘",
        " >W<",
        // " 😉",
        " 😭",
        // "?",
        ""
    ],

    // Bot aliases that trigger a reply
    CALLABLE_NAMES = [
        "sui-chan",
        "sui",
        "suisui",
        "suisei",
        "hoshimachi",
        // "larpze",
        // "larpzeistra",
        // "naze",
        // "nazeistra"
    ];

async function interactMessage(message) {
    console.log("Message received");

    // Prevent cross-interaction between bots
    if(message.author.bot)
        return;

    // a percentage of messages are reacted with a penguin
    if(randomChance(0.1)) await message.react('🐧');

    // Check if it's a DM 
    if(!message.guild) return await interactDM(message);

    // Reply to ping of the bot (And return)
    if(message.mentions.members.find(user => user.id == client.user.id)) return await sendPhrase(message);

    // Reply to any mentions of an alias (And return)
    const lowerCaseMessage = message.content.toLocaleLowerCase();
    if(CALLABLE_NAMES.find(name => lowerCaseMessage.includes(name))) return await sendPhrase(message);

    // Reply by any random chance (And don't return)
    if(randomChance(0.05)) await sendPhrase(message);

    // Process any messages made by the target user
    if(message.author.id == TARGET_USER_ID) processMessageContent(message.content);
}

async function interactDM(message) {
    console.log("It's a DM!");
    console.log(`${message.author.username}: ${message.content}`);

    // Verify message was sent by owner
    if(message.author.id == OWNER_ID) {
        // Parse message
        parts = message.content
            .split(" ") // Split message into parts
            .filter(part => part.length); // Get rid of double spaces

        try {
            if(parts[0] == 'u') {
                parts.shift();

                // get the message to reply to
                (await client.users.fetch(parts.shift()))
                .send(parts.join(" "));

                return;
            }

            // Get the channel
            let channel = await client.channels.fetch(parts.shift());

            // Reply if the next part is r
            if(parts[0] == 'r') {
                parts.shift();

                // get the message to reply to
                (await channel.messages.fetch(parts.shift()))
                .reply(parts.join(" "));

                return;
            }

            await channel.send(parts.join(" "));
        } catch(e) {
            console.error(e);
        }
    }
}

async function sendPhrase(message) {
    // engage typing
    await message.channel.sendTyping();

    // Wait a duration before sending
    await wait(TYPING_DURATION);

    //generate the first reply
    let messageReply = generatePhrase(message.content.toLocaleLowerCase().split(" "));

    // add a few more sentences
    while(randomChance(0.4))
        messageReply += `${NEW_LINE_ENDERS[Math.floor(Math.random() * NEW_LINE_ENDERS.length)]}\n${generatePhrase()}`;

    // // Make sure it doesnt ping anyone
    // messageReply = messageReply.replaceAll("<@", "<@(prevent ping)");

    // Finally, reply with a message
    const reply = await message.reply(messageReply);        

    if(!DELETE_MESSAGES)
        return;

    await wait(REPLY_TIME_BEFORE_DELETE);
    
    reply.delete();
}

async function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

function randomChance(odds) {
    return Math.random() < odds;
}

module.exports = {
    interactMessage
}