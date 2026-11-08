require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { processMessageContent, TARGET_USER_ID } = require("./messageLogging.js");

const CHANNEL_IDS = [
    '989701186548564028'
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on("clientReady", async () => {
    const options = { limit : 100 };

    const guild = await client.guilds.fetch('953764435661570148');

    for(const channelId of CHANNEL_IDS) {
        const channel = await guild.channels.fetch(channelId);

        let messages;
        do {
            messages = await channel.messages.fetch(options);

            const lastMessage = messages.at(messages.size - 1);
            
            if(!lastMessage)
                break;

            options.before = lastMessage.id;

            for(const message of messages.filter(msg => msg.author.id == TARGET_USER_ID)) {
                let content = message[1].content;

                // if(content.length == 0 || content.includes("test") || content.includes("<@1535508353013518386>"))
                if(content.length == 0 || content.includes(`<@${client.user.id}}>`))
                    continue;

                console.log(content);

                processMessageContent(content);
            }
        } while(messages.size != 0);
    }

    process.exit(0);
});

client.login(process.env.TOKEN);