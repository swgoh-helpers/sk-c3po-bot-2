const Discord = require('discord.js');
const client = new Discord.Client();

const ApiSwgohHelp = require('api-swgoh-help');
const swapi = new ApiSwgohHelp({
    "username": process.env.API_USERNAME,
    "password": process.env.API_PASSWORD
});

const spunkte = require('./commands/spunkte');
const weeklytitle = require('./commands/weeklytitle');
const twversus = require('./commands/twversus');
const charspeed = require('./commands/charspeed');

const praefix = process.env.PRAEFIX;

console.log('starting');
client.on('ready', () => {
    console.log('I am ready!');
});

client.on("error", (e) => { console.log("error was thrown by the client!!"); console.error(e); });
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.on('message', message => {

    /** Ignore conditions **/
    if (message.author.bot) { return; }
    if (!message.content.startsWith(praefix)) { return; }

    var messageWithoutPraefix = message.content.slice(praefix.length);

    var words = messageWithoutPraefix.split(" ");
    var command = words[0].toLowerCase();

    const thinkingFace = client.emojis.find(emoji => emoji.name === "thinking");

    switch (command)
    {
        case "hallo":
            message.react(thinkingFace);
            message.channel.send("Guten Tag");
            break;
        case "spunkte":
            message.react(thinkingFace);
            spunkte(message);
            break;
        case "channelid":
            message.react(thinkingFace);
            message.reply(message.channel.id);
            break;
        case "twversus":
            message.react(thinkingFace);
            twversus(message, words, swapi);
            break;
        case "charspeed":
            message.react(thinkingFace);
            var charWords = message.content.slice(praefix.length + "charspeed".length +1).split(",");
            charspeed(message, charWords, swapi);
            break;
        default:
            message.react(thinkingFace);
            message.channel.send("Ich spreche diese Sprache leider nicht.");
            break;
    }

});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret