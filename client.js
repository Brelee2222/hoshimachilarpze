require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

// Initialize the client
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

// Log-in the bot
client.login(process.env.TOKEN);

module.exports = {
    client
};