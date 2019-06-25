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
const charhealth = require('./commands/charhealth');

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

    try {
        var messageWithoutPraefix = message.content.slice(praefix.length);

        var words = messageWithoutPraefix.split(" ");
        var command = words[0].toLowerCase();

        const thinkingFace = client.emojis.find(emoji => emoji.name === "thinking");

        switch (command) {
            case "hallo":
                message.react(thinkingFace);
                message.channel.send("Guten Tag");
                break;
            case "help":
                message.react(thinkingFace);
                message.channel.send("```"
                    + "channelid - zeigt die momentane channelid\n"
                    + "guildid - zeigt die momentane channelid\n"
                    + "twversus {buendniscode} - vergleicht mit der anderen Gilde "
                    + (process.env.INTERNTEXT ? process.env.INTERNTEXT : "")
                    + "\n"
                    + "charspeed {charakter} - zeigt das Tempo des Charakter\n"
                    + (process.env.INTERNTEXT ? process.env.INTERNTEXT : "")
                    + "\n"
                    + "charhealth {charakter1} - zeigt die Gesundheit des Charakter\n"
                    + (process.env.INTERNTEXT ? process.env.INTERNTEXT : "")
                    + "\n"
                    + "twversus {buendniscode1 buendniscode2} - vergleicht zwei gilden\n"
                    + "charspeed {buendniscode=charakter} - zeigt das Tempo des Charakter\n"
                    + "charhealth {buendniscode=charakter} - zeigt die Gesundheit des Charakter\n"
                    + "```");
                break;
            case "spunkte":
                message.react(thinkingFace);
                spunkte(message);
                break;
            case "channelid":
                message.react(thinkingFace);
                message.reply(message.channel.id);
                break;
            case "guildid":
                message.react(thinkingFace);
                message.reply(message.guild.id);
                break;
            case "twversus":
                message.react(thinkingFace);
                twversus(message, words, swapi);
                break;
            case "charspeed":
                message.react(thinkingFace);
                var allWords = message.content.slice(praefix.length + "charspeed".length + 1).split("=");
                var charWords = [];
                var allycode = -1;

                if (allWords.length === 2) {
                    allycode = allWords[0];
                    charWords = allWords[1].split(",");
                }
                else {
                    charWords = allWords[0].split(",");
                }
                charspeed(message, charWords, swapi, allycode);
                break;
            case "charhealth":
                message.react(thinkingFace);
                var allWordsH = message.content.slice(praefix.length + "charhealth".length + 1).split("=");
                var charWordsH = [];
                var allycodeH = -1;

                if (allWordsH.length === 2) {
                    allycodeH = allWordsH[0];
                    charWordsH = allWordsH[1].split(",");
                }
                else {
                    charWordsH = allWordsH[0].split(",");
                }

                charhealth(message, charWordsH, swapi, allycodeH);
                break;
            default:
                message.react(thinkingFace);
                message.channel.send("Ich spreche diese Sprache leider nicht.");
                break;
        }


    } catch (e) {
        message.reply("Fehler: " + e.message);
        console.error(e);
    }

});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret