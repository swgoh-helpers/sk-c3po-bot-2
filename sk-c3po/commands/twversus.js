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
                    compareGuilds(newMessage, ourAllyCode, enemyAllyCode, swapi);
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

        let charList = JSON.parse(process.env.CHARLIST);
        let shipList = JSON.parse(process.env.SHIPLIST);

        newMessage.edit("`Hole Liste der Charaktere...`");

        const allUnitsSwapi = await swapi.fetchData({
            "collection": "unitsList",
            "allycode": enemyAllyCode,
            "language": process.env.LANGUAGE,
            "project": { "baseId": 1, "nameKey": 1, "descKey": 1, "forceAlignment": 1, "categoryIdList": 1, "combatType": 1 },
            "match": { "rarity": 7, "obtainable": true, "obtainableTime": 0 }
        });
        let allUnits = allUnitsSwapi.result;

        console.log("allUnitsSwapi", allUnitsSwapi);

        charList.forEach(
            function (char) {
                newMessage.edit("`Vergleiche " + char + "...`");
                embed.addField(char, getCharacterMessagePart(char, ourUnits, enemyUnits), true);
            }
        );
        
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
        function (unitID) {
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

    var spaces = calculateSpaces([ourGuild.members, ourGuild.raid.sith_raid, ourGuild.gp, ourCharGP, ourShipGP, ourG13, ourG12Fuenf, ourG12Vier, ourG12Drei, ourG12Zwei, ourG12Eins, ourG12Null, ourG11]);

    result += `Members: ${spaces[0]}${ourGuild.members} vs ${enemyGuild.members}\n`;
    result += `STR    : ${spaces[1]}${ourGuild.raid.sith_raid} vs ${enemyGuild.raid.sith_raid}\n`;
    result += `GP     : ${spaces[2]}${ourGuild.gp} vs ${enemyGuild.gp}\n`;
    result += `Char-GP: ${spaces[3]}${ourCharGP} vs ${enemyCharGP}\n`;
    result += `Ship-GP: ${spaces[4]}${ourShipGP} vs ${enemyShipGP}\n`;
    result += `G13    : ${spaces[5]}${ourG13} vs ${enemyG13}\n`;
    result += `G12+5  : ${spaces[6]}${ourG12Fuenf} vs ${enemyG12Fuenf}\n`;
    result += `G12+4  : ${spaces[7]}${ourG12Vier} vs ${enemyG12Vier}\n`;
    result += `G12+3  : ${spaces[8]}${ourG12Drei} vs ${enemyG12Drei}\n`;
    result += `G12+2  : ${spaces[9]}${ourG12Zwei} vs ${enemyG12Zwei}\n`;
    result += `G12+1  : ${spaces[10]}${ourG12Eins} vs ${enemyG12Eins}\n`;
    result += `G12+0  : ${spaces[11]}${ourG12Null} vs ${enemyG12Null}\n`;
    result += `G11    : ${spaces[12]}${ourG11} vs ${enemyG11}\n`;

    result += "```";
    return result;
}

function calculateSpaces(values) {
    let maxLength = -100;
    let spaces = [];

    values.forEach(function (value) {
        if (maxLength < value.toString().length) { maxLength = value.toString().length; }
    });
    values.forEach(
        function (value) {
            let calcLength = maxLength - value.toString().length;
            spaces.push("" + " ".repeat(calcLength));
        }
    );

    return spaces;
}

function getCharacterMessagePart(unitID, ourUnits, enemyUnits) {
    var result = "```";
    
    //ourguild


    let ourTotal = 0;
    let ourSeven = 0;
    let ourSix = 0;
    let ourFive = 0;
    let ourG13 = 0;
    let ourG12 = 0;
    let ourG11 = 0;

    if (ourUnits[unitID]) {
        ourTotal = ourUnits[unitID].length;
        ourSeven = ourUnits[unitID].filter(t => t.starLevel === 7).length;
        ourSix = ourUnits[unitID].filter(t => t.starLevel === 6).length;
        ourFive = ourUnits[unitID].filter(t => t.starLevel === 5).length;
        ourG13 = ourUnits[unitID].filter(t => t.gearLevel === 13).length;
        ourG12 = ourUnits[unitID].filter(t => t.gearLevel === 12).length;
        ourG11 = ourUnits[unitID].filter(t => t.gearLevel === 11).length;
    }

    //ourguild end
    
    //enemyguild

    let enemyTotal = 0;
    let enemySeven = 0;
    let enemySix = 0;
    let enemyFive = 0;
    let enemyG13 = 0;
    let enemyG12 = 0;
    let enemyG11 = 0;

    if (enemyUnits[unitID])
    {
        enemyTotal = enemyUnits[unitID].length;
        enemySeven = enemyUnits[unitID].filter(t => t.starLevel === 7).length;
        enemySix = enemyUnits[unitID].filter(t => t.starLevel === 6).length;
        enemyFive = enemyUnits[unitID].filter(t => t.starLevel === 5).length;
        enemyG13 = enemyUnits[unitID].filter(t => t.gearLevel === 13).length;
        enemyG12 = enemyUnits[unitID].filter(t => t.gearLevel === 12).length;
        enemyG11 = enemyUnits[unitID].filter(t => t.gearLevel === 11).length;
    }

    //enemyguild end

    var spaces = calculateSpaces([ourTotal, ourSeven, ourSix, ourFive, ourG13, ourG12, ourG11]);

    result += `Total: ${spaces[0]}${ourTotal} vs ${enemyTotal}\n`;
    result += `7*   : ${spaces[1]}${ourSeven} vs ${enemySeven}\n`;
    result += `6*   : ${spaces[2]}${ourSix} vs ${enemySix}\n`;
    result += `5*   : ${spaces[3]}${ourFive} vs ${enemyFive}\n`;
    result += `G13  : ${spaces[4]}${ourG13} vs ${enemyG13}\n`;
    result += `G12  : ${spaces[5]}${ourG12} vs ${enemyG12}\n`;
    result += `G11  : ${spaces[6]}${ourG11} vs ${enemyG11}\n`;

    result += "```";
    return result;
}