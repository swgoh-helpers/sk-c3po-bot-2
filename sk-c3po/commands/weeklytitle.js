const Discord = require('discord.js');
const request = require('request');

var requestAsync = function (url) {
    return new Promise((resolve, reject) => {
        var req = request(url, (err, response, body) => {
            if (err) return reject(err, response, body);
            resolve(JSON.parse(body));
        });
    });
};

const urls = [
    'http://schattenkollektiv.gear.host/api/weekly/GetSpendengott',
    'http://schattenkollektiv.gear.host/api/weekly/GetPadawan',
    'http://schattenkollektiv.gear.host/api/weekly/GetStaffel',
    'http://schattenkollektiv.gear.host/api/weekly/GetAdmiral',
    'http://schattenkollektiv.gear.host/api/weekly/GetGladiator'
];

module.exports = async (client) => {
    try {

        var embed = new Discord.RichEmbed();

        const guild = client.guilds.get(process.env.GUILD_ID);

        var data = await Promise.all(urls.map(requestAsync));

        var allSpenden = data[0];
        var allPadawan = data[1];
        var allStaffel = data[2];
        var allAdmiral = data[3];
        var allGladiator = data[4];

        //Spendengott
        let spendengott = guild.roles.find('name', 'Spendengott');
        spendengott.members.forEach(
            function (mem) {
                mem.removeRole(spendengott);
            });
        let memberSpendengott = guild.members.find(member => member.user.username.toLowerCase().includes(allSpenden[0].name.toLowerCase()));

        var spendenText = "";

        if (memberSpendengott) {
            spendenText += `1: ${memberSpendengott.user} mit ${allSpenden[0].spenden}\n`;
            memberSpendengott.addRole(spendengott);
        }
        else
        {
            spendenText += `Kann ${allSpenden[0].name} auf Discord nicht finden.\n`;
            spendenText += `1: ${allSpenden[0].name} mit ${allSpenden[0].spenden}\n`;
        }
        spendenText += `2: ${allSpenden[1].name} mit ${allSpenden[1].spenden}\n`;
        spendenText += `3: ${allSpenden[2].name} mit ${allSpenden[2].spenden}\n`;
        spendenText += `4: ${allSpenden[3].name} mit ${allSpenden[3].spenden}\n`;
        spendenText += `5: ${allSpenden[4].name} mit ${allSpenden[4].spenden}\n`;

        embed.addField("Spendengott", spendenText);

        //Eifriger Padawan
        let padawan = guild.roles.find('name', 'Eifriger Padawan');
        console.log("padawan", padawan != null);
        padawan.members.forEach(
            function (mem) {
                mem.removeRole(padawan);
            });
        let memberPadawan = guild.members.find(member => member.user.username.toLowerCase().includes(allPadawan[0].name.toLowerCase()));
       
        var padawanText = "";
        if (memberPadawan) {
            padawanText += `1: ${memberPadawan.user} mit ${allPadawan[0].gm}\n`;
            memberPadawan.addRole(padawan);
        }
        else {
            padawanText += `Kann ${allPadawan[0].name} auf Discord nicht finden.\n`;
            padawanText += `1: ${allPadawan[0].name} mit ${allPadawan[0].gm}\n`;
        }
        padawanText += `2: ${allPadawan[1].name} mit ${allPadawan[1].gm}\n`;
        padawanText += `3: ${allPadawan[2].name} mit ${allPadawan[2].gm}\n`;
        padawanText += `4: ${allPadawan[3].name} mit ${allPadawan[3].gm}\n`;
        padawanText += `5: ${allPadawan[4].name} mit ${allPadawan[4].gm}\n`;

        embed.addField("Eifriger Padawan", padawanText);

        //Staffelführer
        let staffelfuehrer = guild.roles.find('name', 'Staffelfuehrer');
        console.log("staffelfuehrer", staffelfuehrer != null);
        staffelfuehrer.members.forEach(
            function (mem) {
                mem.removeRole(staffelfuehrer);
            });
        let memberStaffelfuehrer = guild.members.find(member => member.user.username.toLowerCase().includes(allStaffel[0].name.toLowerCase()));
        
        var staffelText = "";
        if (memberStaffelfuehrer) {
            staffelText += `1: ${memberStaffelfuehrer.user} mit ${allStaffel[0].gm}\n`;
            memberStaffelfuehrer.addRole(staffelfuehrer);
        }
        else {
            staffelText += `Kann ${allStaffel[0].name} auf Discord nicht finden.\n`;
            staffelText += `1: ${allStaffel[0].name} mit ${allStaffel[0].gm}\n`;
        }
        staffelText += `2: ${allStaffel[1].name} mit ${allStaffel[1].gm}\n`;
        staffelText += `3: ${allStaffel[2].name} mit ${allStaffel[2].gm}\n`;
        staffelText += `4: ${allStaffel[3].name} mit ${allStaffel[3].gm}\n`;
        staffelText += `5: ${allStaffel[4].name} mit ${allStaffel[4].gm}\n`;

        embed.addField("Staffelfuehrer", staffelText);

        //Großadmiral
        let grossadmiral = guild.roles.find('name', 'Grossadmiral');
        console.log("grossadmiral", grossadmiral != null);
        grossadmiral.members.forEach(
            function (mem) {
                mem.removeRole(grossadmiral);
            });
        let memberGrossadmiral = guild.members.find(member => member.user.username.toLowerCase().includes(allAdmiral[0].name.toLowerCase()));

        var admiralText = "";
        if (memberGrossadmiral) {
            admiralText += `1: ${memberGrossadmiral.user} mit ${allAdmiral[0].avgRank}\n`;
            memberGrossadmiral.addRole(grossadmiral);
        }
        else {
            admiralText += `Kann ${allAdmiral[0].name} auf Discord nicht finden.\n`;
            admiralText += `1: ${allAdmiral[0].name} mit ${allAdmiral[0].avgRank}\n`;
        }
        admiralText += `2: ${allAdmiral[1].name} mit ${allAdmiral[1].avgRank}\n`;
        admiralText += `3: ${allAdmiral[2].name} mit ${allAdmiral[2].avgRank}\n`;
        admiralText += `4: ${allAdmiral[3].name} mit ${allAdmiral[3].avgRank}\n`;
        admiralText += `5: ${allAdmiral[4].name} mit ${allAdmiral[4].avgRank}\n`;

        embed.addField("Grossadmiral", admiralText);


        //Gladiator
        let gladiator = guild.roles.find('name', 'Gladiator');
        console.log("Gladiator", gladiator != null);
        gladiator.members.forEach(
            function (mem) {
                mem.removeRole(gladiator);
            });
        let memberGladiator = guild.members.find(member => member.user.username.toLowerCase().includes(allGladiator[0].name.toLowerCase()));

        var gladiatorText = "";
        if (memberGladiator) {
            gladiatorText += `1: ${memberGladiator.user} mit ${allGladiator[0].avgRank}\n`;
            memberGladiator.addRole(gladiator);
        }
        else {
            gladiatorText += `Kann ${allGladiator[0].name} auf Discord nicht finden.\n`;
            gladiatorText += `1: ${allGladiator[0].name} mit ${allGladiator[0].avgRank}\n`;
        }
        gladiatorText += `2: ${allGladiator[1].name} mit ${allGladiator[1].avgRank}\n`;
        gladiatorText += `3: ${allGladiator[2].name} mit ${allGladiator[2].avgRank}\n`;
        gladiatorText += `4: ${allGladiator[3].name} mit ${allGladiator[3].avgRank}\n`;
        gladiatorText += `5: ${allGladiator[4].name} mit ${allGladiator[4].avgRank}\n`;

        embed.addField("Gladiator", gladiatorText);

        client.channels.get(process.env.WEEKLY_CHANNEL_ID).send({ embed });
        
    } catch (e) {
        client.channels.get(process.env.WEEKLY_CHANNEL_ID).send(e.message);
        console.log(e.message);
    }

}