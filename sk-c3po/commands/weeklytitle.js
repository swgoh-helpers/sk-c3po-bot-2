const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = async (message) => {
    try {

        var embed = new Discord.RichEmbed();

        console.log("message.channel", message.channel);
        console.log("message.guild", message.guild);

        embed.addField("Wochenreport:", "Meiste blub:1");

        console.log("client.channels", client.channels);
        client.channels.get(process.env.WEEKLY_CHANNEL_ID).send({ embed });
        
    } catch (e) {
        message.channel.send(e.message);
        console.log(e.message);
    }

}