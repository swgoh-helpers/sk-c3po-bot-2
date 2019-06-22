const Discord = require('discord.js');
const client = new Discord.Client();
console.log('starting');

console.log("BOT_TOKEN", process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('I am ready!');
    console.log(client.emojis);
});

client.on("error", (e) => { console.log("error was thrown by the client!!"); console.error(e); });
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.on('message', message => {

    /** Ignore conditions **/
    if (message.author.bot) { return; }
    if (!message.content.startsWith("#")) { return; }

    var messageWithoutPraefix = message.content.slice(1);

    var words = messageWithoutPraefix.split(" ");
    var command = words[0].toLowerCase();

    const thinkingFace = client.emojis.find(emoji => emoji.name === "Thinking Face");

    switch (command)
    {
        case "hallo":
            message.react(`${thinkingFace}`);
            message.channel.send("Guten Tag");
            break;
        case "test":
            message.react(`${thinkingFace}`);
            break;
        default:
            message.react(`${thinkingFace}`);
            message.channel.send("Ich spreche diese Sprache leider nicht.");
            break;
    }

});


// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret
