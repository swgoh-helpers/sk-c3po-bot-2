const Discord = require('discord.js');
const client = new Discord.Client();
console.log('starting');
client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
console.log('message received!');
    if (message.content === 'hello there') {
        message.reply('General Kenobi!');
    }

});



// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret
