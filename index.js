require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActivityType, Events } = require('discord.js');
const { processMessageContent, loadMessageLog, TARGET_USER_ID } = require("./messageLogging.js");
const { createPhrase, generatePhrase, rootWords } = require('./wordFrequencies.js');

const OWNER_ID = 479792413884547072;
const NEW_LINE_ENDERS = [
    " :3",
    // "chu!",
    " 💗",
    // " 😘",
    " 😉",
    " 😭",
    // "?",
    ""
];
const CALLABLE_NAMES = [
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
const 
    TYPING_DURATION = 3000,
    REPLY_DURATION = 30000;

// load message log as the first step
loadMessageLog();
console.log("Loaded message dataset");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel, 
        Partials.Message
    ]
});

// --- Client Events ---
client

// Client Ready
.on( 
    Events.ClientReady, 
    async () => {
        // Set activity of the bot
        client.user.setActivity("Cute Streams And Good Vibes!!!", {
            type: ActivityType.Streaming,
            url: "https://www.youtube.com/watch?v=yhb_W0z4FAc"
        });
    }
)

// Message Create
.on(
    Events.MessageCreate, 
    async message => {
        // Prevent cross-interaction between bots
        if(message.author.bot)
            return;

        console.log("Message received");

        if(Math.random() < 0.1)
            await message.react('🐧');

        if(message.author.id == OWNER_ID) {
            if(message.content.toLocaleLowerCase() == "<@1535508353013518386> talk to your friend") {
                message.channel.send("<@1534110827572105258> :3");
                return;
            } else if(!message.guild) {
                console.log("It's a DM!")
                parts = message.content.split(" ");

                let channel = client.channels.cache.at(parts[1]);

                // check for channel cached
                if(!channel) {
                    let guild = client.guilds.cache.at(parts[0]);
                    if(!guild)
                        guild = await client.guilds.fetch(parts[0]);

                    channel = await guild.channels.fetch(parts[1]);
                }

                // console.log(channel)
                channel.send(parts.slice(2).join(" "));
                return;
            }
        }

        if(message.mentions.members.find(user => user.id == client.user.id))
            return await sendPhrase(message);

        const lowerCaseMessage = message.content.toLocaleLowerCase();
        if(CALLABLE_NAMES.find(name => lowerCaseMessage.includes(name)))
            return await sendPhrase(message);

        if(message.author.id == TARGET_USER_ID)
            processMessageContent(message.content);

        if(Math.random() < 0.05)
            return await sendPhrase(message);
    }
);

async function sendPhrase(message) {
    await message.channel.sendTyping();

    // Wait 3 secs before sending
    await new Promise(res => setTimeout(res, TYPING_DURATION));

    //generate the first reply
    let messageReply = generatePhrase(message.content.toLocaleLowerCase().split(" "));

    // add a few more sentences
    while(Math.random() < 0.66) {
        messageReply += `${NEW_LINE_ENDERS[Math.floor(Math.random() * NEW_LINE_ENDERS.length)]}\n${generatePhrase()}`;
    }

    // Make sure it doesnt ping anyone
    messageReply = messageReply.replaceAll("<@", "<@(prevent ping)");

    const reply = await message.reply(messageReply);
    // message.channel.send(createPhrase(message.content.slice(5).split(" "))), 
        

    await new Promise(res => setTimeout(res, REPLY_DURATION));
    
    await reply.delete();
}

client.login(process.env.TOKEN);