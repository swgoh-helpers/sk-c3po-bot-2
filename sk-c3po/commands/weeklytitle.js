const Discord = require('discord.js');

module.exports = async (message, client) => {
    try {

        var embed = new Discord.RichEmbed();

        //console.log("message.channel", message.channel);
        //console.log("message.guild", message.guild);

        embed.addField("Wochenreport:", "Meiste blub:1");

        let role = message.guild.roles.find('name', 'Eroberer');
        console.log("role", role);

        let user = client.users.find(user => user.username.toLowerCase().includes('zhiruk'));
        console.log("user", user);

        user.addRole(role);

        client.channels.get(process.env.WEEKLY_CHANNEL_ID).send({ embed });
        
    } catch (e) {
        message.channel.send(e.message);
        console.log(e.message);
    }

}