const Discord = require('discord.js');

var syncRequest = require('sync-request');
const crinoloCharacters = https://crinolo-swgoh.glitch.me/statCalc/characters;

module.exports = async (message, charWords, swapi) => {
    try {

        if (charWords.length < 1) {
            message.reply("Bitte geben sie mindestens einen Charakter an! \nBeispiel1: `+charspeed Darth Revan`\nBeispiel2: `+charspeed Darth Revan,Han Solo,General Kenobi`");
            return;
        }

        let ourAllyCode = process.env.GUILD_ALLYCODE;

        message.reply("`Update eigene Gilde mit " + ourAllyCode + "`")
            .then(
                (newMessage) => {
                    getGuildUnits(newMessage, charWords, ourAllyCode, swapi);
                });

    } catch (e) {
        message.reply.send(e.message);
        console.log(e.message);
    }
};

async function getGuildUnits(newMessage, charWords, ourAllyCode, swapi) {
    try {

        var embed = new Discord.RichEmbed();

        const ourGuildSwapi = await swapi.fetchGuild({ "allycode": ourAllyCode, "language": process.env.LANGUAGE });
        let ourGuild = ourGuildSwapi.result[0];

        newMessage.edit("`" + ourGuild.name + " erfolgreich geupdated.`");

        let ourUnits = await getAllUnitsForGuild(ourGuild, swapi);

        newMessage.edit("`Hole Liste der Charaktere...`");

        const allUnitsSwapi = await swapi.fetchData({
            "collection": "unitsList",
            "allycode": ourAllyCode,
            "language": process.env.LANGUAGE,
            "project": { "baseId": 1, "nameKey": 1, "descKey": 1, "forceAlignment": 1, "categoryIdList": 1, "combatType": 1 },
            "match": { "rarity": 7, "obtainable": true, "obtainableTime": 0 }
        });
        let allUnits = allUnitsSwapi.result;

        charWords.forEach(
            function (charName) {
                let charUnit = allUnits.find(unit => unit.nameKey.toLowerCase() === charName.toLowerCase());

                if (charUnit) {
                    newMessage.edit("`Vergleiche " + charName + "...`");
                    embed.addField(charName, getCharacterMessagePart(charUnit, ourUnits), true);
                } else {
                    newMessage.edit("`Konnte " + charName + " nicht finden...`");
                    embed.addField(charName, "`Fehler bei der ermittlung der Einheit`", true);
                }
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

    var spaces = calculateSpaces([ourGuild.members, ourGuild.raid.sith_raid, `${(ourGuild.gp / 1000000).toFixed(2)}M`, `${(ourCharGP / 1000).toFixed(2)}T`, `${(ourCharGP / 1000).toFixed(2)}T`, ourG13, ourG12Fuenf, ourG12Vier, ourG12Drei, ourG12Zwei, ourG12Eins, ourG12Null, ourG11]);

    result += `Members: ${spaces[0]}${ourGuild.members} vs ${enemyGuild.members}\n`;
    result += `STR    : ${spaces[1]}${ourGuild.raid.sith_raid} vs ${enemyGuild.raid.sith_raid}\n`;
    result += `GP     : ${spaces[2]}${(ourGuild.gp / 1000000).toFixed(2)}M vs ${(enemyGuild.gp / 1000000).toFixed(2)}T\n`;
    result += `Char-GP: ${spaces[3]}${(ourCharGP / 1000).toFixed(2)}T vs ${(enemyCharGP / 1000).toFixed(2)}T\n`;
    result += `Ship-GP: ${spaces[4]} ${(ourShipGP / 1000).toFixed(2)}T vs ${(enemyShipGP / 1000).toFixed(2)}T\n`;
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

function getCharacterMessagePart(charUnit, ourUnits) {

    var result = "```";

    let ourTotal = ourUnits[charUnit.baseId];
    
    var crinoloResult = syncRequest(
        'POST',
        crinoloCharacters,
        {
            // no need //headers: headerJson,
            json:
            {
                units: ourTotal
            }
        });

    console.log("crinoloResult", crinoloResult);

    //var spaces = calculateSpaces();
    ourTotal.forEach(
        function (charFound) {
            result += `${charFound.player}:${charFound.gp}\n`;
        }
    );

    result += "```";
    return result;
}