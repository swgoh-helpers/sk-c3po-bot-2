const Discord = require('discord.js');

module.exports = async (message, words, swapi) => {
    try {

        if (words.length < 2) {
            message.reply("Bitte gebe den Bündnisscode des Gegners an! \nBeispiel: `+twversus 123456789`");
            return;
        }

        let ourAllyCode = process.env.GUILD_ALLYCODE;
        let enemyAllyCode = words[1];

        message.reply(`Update eigene Gilde mit ${ourAllyCode}`)
            .then(
                (newMessage) => {
                    compareGuilds(newMessage, ourAllyCode, enemyAllyCode, swapi);
                });

        //var embed = new Discord.RichEmbed();

        //embed.addField("twversus", "twversus");

        //message.reply({ embed });

    } catch (e) {
        message.reply.send(e.message);
        console.log(e.message);
    }
}

async function compareGuilds(newMessage, ourAllyCode, enemyAllyCode, swapi) {
    try {

        const ourGuildSwapi = await swapi.fetchGuild({ "allycode": ourAllyCode, "language": process.env.LANGUAGE });
        let ourGuild = ourGuildSwapi.result[0];
        console.log(ourGuild);

        newMessage.edit(`${ourGuild.name} erfolgreich geupdated.`);

        const enemyGuildSwapi = await swapi.fetchGuild({ "allycode": enemyAllyCode, "language": process.env.LANGUAGE });
        let enemyGuild = enemyGuildSwapi.result[0];
        console.log(enemyGuild);

        newMessage.edit(`Gilde ${enemyGuild} gefunden! \nAnalysiere Roster...`);
        
    } catch (e) {
        newMessage.edit(e.message);
        console.log(e.message);
    }
}