const Discord = require('discord.js');

module.exports = async (message, client) => {
    try {

        var embed = new Discord.RichEmbed();

        const guild = client.guilds.get(process.env.GUILD_ID);

        var report = "";

        //Spendengott
        let spendengott = message.guild.roles.find('name', 'Spendengott');
        spendengott.members.forEach(
            function (mem) {
                mem.removeRole(spendengott);
            });
        let memberSpendengott = guild.members.find(member => member.user.username.toLowerCase().includes('vadith'));
        memberSpendengott.addRole(spendengott);
        report += `Spendengott: ${memberSpendengott.user}\n`;

        //Eifriger Padawan
        let padawan = message.guild.roles.find('name', 'Eifriger Padawan');
        console.log("padawan", padawan != null);
        padawan.members.forEach(
            function (mem) {
                mem.removeRole(padawan);
            });
        let memberPadawan = guild.members.find(member => member.user.username.toLowerCase().includes('vadith'));
        memberPadawan.addRole(padawan);
        report += `Eifriger Padawan: ${memberPadawan.user}\n`;

        //Staffelführer
        let staffelfuehrer = message.guild.roles.find('name', 'Staffelführer');
        console.log("padawan", staffelfuehrer != null);
        staffelfuehrer.members.forEach(
            function (mem) {
                mem.removeRole(staffelfuehrer);
            });
        let memberStaffelfuehrer = guild.members.find(member => member.user.username.toLowerCase().includes('vadith'));
        memberStaffelfuehrer.addRole(staffelfuehrer);
        report += `Staffelführer: ${memberStaffelfuehrer.user}\n`;

        //Großadmiral
        let grossadmiral = message.guild.roles.find('name', 'Großadmiral');
        console.log("padawan", grossadmiral != null);
        grossadmiral.members.forEach(
            function (mem) {
                mem.removeRole(grossadmiral);
            });
        let memberGrossadmiral = guild.members.find(member => member.user.username.toLowerCase().includes('vadith'));
        memberGrossadmiral.addRole(grossadmiral);
        report += `Großadmiral: ${memberGrossadmiral.user}\n`;

        //Gladiator
        let gladiator = message.guild.roles.find('name', 'Gladiator');
        console.log("gladiator", gladiator != null);
        gladiator.members.forEach(
            function (mem) {
                mem.removeRole(gladiator);
            });
        let memberGladiator = guild.members.find(member => member.user.username.toLowerCase().includes('vadith'));
        memberGladiator.addRole(gladiator);
        report += `Gladiator: ${memberGladiator.user}\n`;


        embed.addField("Wochenreport:", report);

        client.channels.get(process.env.WEEKLY_CHANNEL_ID).send({ embed });
        
    } catch (e) {
        message.channel.send(e.message);
        console.log(e.message);
    }

}