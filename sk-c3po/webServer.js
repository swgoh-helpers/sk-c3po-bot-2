const Discord = require('discord.js');
const client = new Discord.Client();

const bodyParser = require('body-parser');
const express = require('express');

let clientReady = false;

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

const ApiSwgohHelp = require('api-swgoh-help');
const swapi = new ApiSwgohHelp({
    "username": process.env.API_USERNAME,
    "password": process.env.API_PASSWORD
});

const spunkte = require('./commands/spunkte');
const weeklytitle = require('./commands/weeklytitle');
const twversus = require('./commands/twversus');

console.log('starting');
client.on('ready', () => {
    console.log('I am ready!');
    clientReady = true;
});

client.on("error", (e) => { console.log("error was thrown by the client!!"); console.error(e); });
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret

// create application/json parser
const jsonParser = bodyParser.json();

// this is for external commands
app.post('/command', jsonParser, function (req, res) {

    console.log('command recieved!');
    res.send({ status: 200 });
    
    var command = req.body;
    executeCommand(command);
});

async function executeCommand(command) {
    while (!clientReady) {
        let sleepNow = await sleep(1000);
    }
    
    switch (command.command) {
        case "weekly":
            weeklytitle(client);
            break;
        default:
            //ignore it
            break;
    }

}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
