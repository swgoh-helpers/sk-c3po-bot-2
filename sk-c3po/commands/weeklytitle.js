const Discord = require('discord.js');

module.exports = async (message, client) => {
    try {

        var embed = new Discord.RichEmbed();

        const guild = client.guilds.get(process.env.GUILD_ID);

        embed.addField("Wochenreport:", "Meiste blub:1");

        let role = message.guild.roles.find('name', 'Eroberer');
        
        let member = guild.members.find(member => member.user.username.toLowerCase().includes('zhiruk'));
        console.log("member", member);

        member.addRole(role);

        client.channels.get(process.env.WEEKLY_CHANNEL_ID).send({ embed });
        
    } catch (e) {
        message.channel.send(e.message);
        console.log(e.message);
    }

}