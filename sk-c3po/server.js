const Discord = require('discord.js');
const client = new Discord.Client();
console.log('starting');

console.log("BOT_TOKEN", process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('I am ready!');
});

client.on("error", (e) => { console.log("error was thrown by the client!!"); console.error(e); });
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.on('message', message => {
console.log('message received!');
    if (message.content === 'hello there') {
        message.reply('General Kenobi!');
    }

});



// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret
