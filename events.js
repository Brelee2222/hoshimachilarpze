const 
    { client } = require("./client.js"),
    { ActivityType, Events } = require('discord.js'),
    { interactMessage } = require('./interaction.js');

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
    interactMessage
);