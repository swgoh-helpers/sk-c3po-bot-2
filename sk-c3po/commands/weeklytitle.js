const Discord = require('discord.js');

module.exports = async (message, client) => {
    try {

        var embed = new Discord.RichEmbed();

        const guild = client.guilds.get(process.env.GUILD_ID);

        let spendengott = message.guild.roles.find('name', 'Spendengott');

        let memberWithRole = spendengott.members;
        memberWithRole.forEach(
            function (mem) {
                mem.removeRole(spendengott);
            });

        let memberSpendengott = guild.members.find(member => member.user.username.toLowerCase().includes('sdtbarbarossa'));

        memberSpendengott.addRole(spendengott);
        
        embed.addField("Wochenreport:", `Spendengott: @${memberSpendengott.user}`);

        client.channels.get(process.env.WEEKLY_CHANNEL_ID).send({ embed });
        
    } catch (e) {
        message.channel.send(e.message);
        console.log(e.message);
    }

}