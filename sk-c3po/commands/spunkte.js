const { google } = require('googleapis');
const sheetsApi = google.sheets('v4');
const googleAuth = require('./auth');

const SPREADSHEET_ID = '1b3zv_jMmec8AjHFHulWLz3iOvc-UW_EYLFchZwfJFzI';

module.exports = async (message) => {
    try {

        googleAuth.authorize()
            .then((auth) => {
                sheetsApi.spreadsheets.values.get({
                    auth: auth,
                    spreadsheetId: SPREADSHEET_ID,
                    range: "'Sheet1'!A1:Q60",
                }, function (err, response) {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        message.channel.send('The API returned an error:' + err);
                        return;
                    }
                    var rows = response.data.values;

                    var messageToSend = "Zusammenfassung: \n";

                    rows.forEach(function (element) {
                        if (element[0] != "Name") {
                            var messageToSendTemp = "-----------\nSpieler: " + element[0] + "\n";
                            var keinVergehen = true;
                            for (var i = 1; i < 13; i = i + 3) {
                                if (element[i] != "") {
                                    messageToSendTemp += "Datum: " + element[i] + " Punkte: " + element[i + 1] + " Vergehen : " + element[i + 2] + "\n";
                                    keinVergehen = false;
                                }
                            }

                            if (keinVergehen != true) {
                                messageToSend += messageToSendTemp;
                            }
                        }
                    });
                    
                    message.author.send(messageToSend);
                    message.channel.send("Ich habe dir Privat geantwortet.");
                });
            })
            .catch((err) => {
                message.channel.send("auth error: " + err);
                console.log('auth error', err);
            });

    } catch (e) {
        message.channel.send(e.message);
        console.log(e.message);
    }

}