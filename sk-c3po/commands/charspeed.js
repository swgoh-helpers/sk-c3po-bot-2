const Discord = require('discord.js');

var thenRequest = require('then-request');
const crinoloCharacters = "https://crinolo-swgoh.glitch.me/testCalc/api/characters";

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

        let foundUnits = [];
        let foundChars = {};

        charWords.forEach(
            function (charName) {
                let charUnit = allUnits.find(unit => unit.nameKey.toLowerCase() === charName.toLowerCase());

                if (charUnit) {
                    newMessage.edit("`Vergleiche " + charName + "...`");
                    foundUnits.push(charUnit);
                    let baseId = charUnit.baseId;
                    foundChars[baseId]= ourUnits[baseId];
                    //embed.addField(charName, getCharacterMessagePart(charUnit, ourUnits), true);
                } else {
                    newMessage.edit("`Konnte " + charName + " nicht finden...`");
                }
            }
        );

        newMessage.edit("`Berechne Charakter Werte...`");

        thenRequest('POST', crinoloCharacters,
            {
                // no need //headers: headerJson,
                json: foundChars
            }
        ).getBody('utf8').then(JSON.parse).done(function (res) {

            foundUnits.forEach(
                function (unit)
                {
                    embed.addField(unit.nameKey, getCharacterMessagePart(res[unit.baseId]), true);
                }
            );
            
            newMessage.edit({ embed });
        });


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

function getCharacterMessagePart(crinoloResult) {

    var result = "```";

    console.log("crinoloResult", crinoloResult);

    //var spaces = calculateSpaces();
    crinoloResult.forEach(
        function (cResult) {
            result += `${cResult.player}: Base=${cResult.stats.base.Speed} Gear=${cResult.stats.gear.Speed} Mods=${cResult.stats.mods.Speed}\n`;
        }
    );

    result += "```";
    return result;
}