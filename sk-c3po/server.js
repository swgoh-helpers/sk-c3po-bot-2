const Discord = require('discord.js');
const client = new Discord.Client();

const bodyParser = require('body-parser');
const express = require('express');

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

const spunkte = require('./commands/spunkte');
const weeklytitle = require('./commands/weeklytitle');

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
    if (!message.content.startsWith("+")) { return; }

    var messageWithoutPraefix = message.content.slice(1);

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
        case "weekly":
            message.react(thinkingFace);
            weeklytitle(client);
            break;
        case "channelid":
            message.react(thinkingFace);
            message.reply(message.channel.id);
            break;
        default:
            message.react(thinkingFace);
            message.channel.send("Ich spreche diese Sprache leider nicht.");
            break;
    }

});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret

// create application/json parser
const jsonParser = bodyParser.json();

// this is for external commands
app.post('/command', jsonParser, function (req, res) {

    console.log('command recieved!');
    res.send({ status: 200 });
    
    var command = req.body;
    console.log("command", command);

    switch (command.command) {
        case "weekly":
            weeklytitle(client);
            break;
        default:
            //ignore it
            break;
    }

});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
