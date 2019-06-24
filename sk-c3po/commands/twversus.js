const Discord = require('discord.js');

module.exports = async (message, words, swapi) => {
    try {

        if (words.length < 2) {
            message.reply("Bitte gebe den Bündnisscode des Gegners an! \nBeispiel: `+twversus 123456789`");
            return;
        }

        let ourAllyCode = process.env.GUILD_ALLYCODE;
        let enemyAllyCode = words[1];

        message.reply("`Update eigene Gilde mit " + ourAllyCode + "`")
            .then(
            (newMessage) => {

                var asciTable = "+----------------------------------+---------+------------------------+----------------+"
                    + "\n"
                    + "| Col1 | Col2 | Col3 | Numeric Column |"
                    + "\n"
                    + "+----------------------------------+ --------- +------------------------+ ----------------+"
                    + "\n"
                    + "| Value 1 | Value 2 | 123 | 10.0 |"
                    + "\n"
                    + "| Separate | cols | with a tab or 4 spaces | -2, 027.1 |"
                    + "\n"
                    + "| This is a row with only one cell |         |                        |                |"
                    + "\n"
                    + "+----------------------------------+ --------- +------------------------+ ----------------+";

                var embed = new Discord.RichEmbed();
                embed.addField("Table", "```"+asciTable+"```");
                newMessage.edit({ embed });
                return;
                    //compareGuilds(newMessage, ourAllyCode, enemyAllyCode, swapi);
                });
        
    } catch (e) {
        message.reply.send(e.message);
        console.log(e.message);
    }
}

async function compareGuilds(newMessage, ourAllyCode, enemyAllyCode, swapi) {
    try {

        var embed = new Discord.RichEmbed();

        const ourGuildSwapi = await swapi.fetchGuild({ "allycode": ourAllyCode, "language": process.env.LANGUAGE });
        let ourGuild = ourGuildSwapi.result[0];

        newMessage.edit("`" + ourGuild.name + " erfolgreich geupdated.`");

        const enemyGuildSwapi = await swapi.fetchGuild({ "allycode": enemyAllyCode, "language": process.env.LANGUAGE });
        let enemyGuild = enemyGuildSwapi.result[0];

        newMessage.edit("`Gilde " + enemyGuild.name + " gefunden! \nAnalysiere Roster...`");

        let ourUnits = await getAllUnitsForGuild(ourGuild, swapi);
        let enemyUnits = await getAllUnitsForGuild(enemyGuild, swapi);
        
        embed.addField(`${ourGuild.name} vs ${enemyGuild.name}`, getFirstMessagePart(ourGuild, enemyGuild, ourUnits, enemyUnits));
        
        newMessage.edit({ embed });

    } catch (e) {
        newMessage.edit(e.message);
        console.error(e);
    }
}

async function getAllUnitsForGuild(guild, swapi) {

    let allycodes = guild.roster.map(p => p.allyCode);

    let units = null;

    var payloadUnits = {
        "allycode": allycodes,
        "language": process.env.LANGUAGE
    };
    units = await swapi.fetchUnits(payloadUnits);
    return units.result;
}

function getFirstMessagePart(ourGuild, enemyGuild, ourUnits, enemyUnits) {
    var result = "```";

    console.log("ourguil start");
    //ourguild
    let ourUnitIds = Object.keys(ourUnits);

    let ourShipGP = ourUnitIds.map(id => {
        if (ourUnits[id][0].type === 'SHIP' || ourUnits[id][0].type === 2) {
            return ourUnits[id].reduce((total, num) => parseInt(parseInt(total || 0) + parseInt(num.gp || 0)), 0);
        }
        return 0;
    });
    ourShipGP = ourShipGP.filter(s => s).reduce((total, num) => parseInt(parseInt(total) + parseInt(num)), 0);

    let ourCharGP = ourUnitIds.map(id => {
        if (ourUnits[id][0].type === 'CHARACTER' || ourUnits[id][0].type === 1) {
            return ourUnits[id].reduce((total, num) => parseInt(parseInt(total || 0) + parseInt(num.gp || 0)), 0);
        }
        return 0;
    });
    ourCharGP = ourCharGP.filter(c => c).reduce((total, num) => parseInt(parseInt(total) + parseInt(num)), 0);

    let ourG11 = 0;
    let ourG12Null = 0;
    let ourG12Eins = 0;
    let ourG12Zwei = 0;
    let ourG12Drei = 0;
    let ourG12Vier = 0;
    let ourG12Fuenf = 0;
    let ourG13 = 0;
    ourUnitIds.forEach(
        function (unitID)
        {
                ourG11 += ourUnits[unitID].filter(t => t.gearLevel === 11).length;
                ourG12Null += ourUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 0).length;
                ourG12Eins += ourUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 1).length;
                ourG12Zwei += ourUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 2).length;
                ourG12Drei += ourUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 3).length;
                ourG12Vier += ourUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 4).length;
                ourG12Fuenf += ourUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 5).length;
                ourG13 += ourUnits[unitID].filter(t => t.gearLevel === 13).length;
        }
    );
    //ourguild end

    console.log("ourguil end");

    console.log("enemyguild start");
    //enemyguild
    let enemyUnitIds = Object.keys(enemyUnits);
    let enemyShipGP = enemyUnitIds.map(id => {
        if (enemyUnits[id][0].type === 'SHIP' || enemyUnits[id][0].type === 2) {
            return enemyUnits[id].reduce((total, num) => parseInt(parseInt(total || 0) + parseInt(num.gp || 0)), 0);
        }
        return 0;
    });
    enemyShipGP = enemyShipGP.filter(s => s).reduce((total, num) => parseInt(parseInt(total) + parseInt(num)), 0);

    let enemyCharGP = enemyUnitIds.map(id => {
        if (enemyUnits[id][0].type === 'CHARACTER' || enemyUnits[id][0].type === 1) {
            return enemyUnits[id].reduce((total, num) => parseInt(parseInt(total || 0) + parseInt(num.gp || 0)), 0);
        }
        return 0;
    });
    enemyCharGP = enemyCharGP.filter(c => c).reduce((total, num) => parseInt(parseInt(total) + parseInt(num)), 0);

    let enemyG11 = 0;
    let enemyG12Null = 0;
    let enemyG12Eins = 0;
    let enemyG12Zwei = 0;
    let enemyG12Drei = 0;
    let enemyG12Vier = 0;
    let enemyG12Fuenf = 0;
    let enemyG13 = 0;
    enemyUnitIds.forEach(
        function (unitID) {

            enemyG11 += enemyUnits[unitID].filter(t => t.gearLevel === 11).length;
            enemyG12Null += enemyUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 0).length;
            enemyG12Eins += enemyUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 1).length;
            enemyG12Zwei += enemyUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 2).length;
            enemyG12Drei += enemyUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 3).length;
            enemyG12Vier += enemyUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 4).length;
            enemyG12Fuenf += enemyUnits[unitID].filter(t => t.gearLevel === 12 && t.gear.length === 5).length;
            enemyG13 += enemyUnits[unitID].filter(t => t.gearLevel === 13).length;
        }
    );
    //enemyguild end
    console.log("enemyguild end");
    
    result += `Members  |   ${ourGuild.members} vs ${enemyGuild.members}\n`;
    result += `STR      |   ${ourGuild.raid.sith_raid} vs ${enemyGuild.raid.sith_raid}\n`;
    result += `GP       |   ${ourGuild.gp} vs ${enemyGuild.gp}\n`;
    result += `Char-GP  |   ${ourCharGP} vs ${enemyCharGP}\n`;
    result += `Ship-GP  |   ${ourShipGP} vs ${enemyShipGP}\n`;
    result += `G13      |   ${ourG13} vs ${enemyG13}\n`;
    result += `G12+5    |   ${ourG12Fuenf} vs ${enemyG12Fuenf}\n`;
    result += `G12+4    |   ${ourG12Vier} vs ${enemyG12Vier}\n`;
    result += `G12+3    |   ${ourG12Drei} vs ${enemyG12Drei}\n`;
    result += `G12+2    |   ${ourG12Zwei} vs ${enemyG12Zwei}\n`;
    result += `G12+1    |   ${ourG12Eins} vs ${enemyG12Eins}\n`;
    result += `G12+0    |   ${ourG12Null} vs ${enemyG12Null}\n`;
    result += `G11      |   ${ourG11} vs ${enemyG11}\n`;

    result += "```";
    return result;
}