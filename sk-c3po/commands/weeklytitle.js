const Discord = require('discord.js');

module.exports = async (message) => {
    try {

        var embed = new Discord.RichEmbed();

        console.log("message.channel", message.channel);
        console.log("message.guild", message.guild);

        embed.addField("Wochenreport:", "Meiste blub:1");

        message.channel.send({ embed });
        
    } catch (e) {
        message.channel.send(e.message);
        console.log(e.message);
    }

}