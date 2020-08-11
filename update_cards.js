require('dotenv').config();
const axios = require('axios').default;
const fs = require('fs');
const apiKey = process.env.API_KEY;
const apiToken = process.env.API_TOKEN;

const chargeabilityFieldId = '5f32e1e08b8b4d2c71ed851e';
const bookedUntilFieldId = '5f3188ef0650ff1abf8b24fa';
const malFieldId = '5f32e1c9228ed06b678b63be';
const hireDateFieldId = '5f31f4908ea52e2ffefa8242';

const jointJsonfile = process.env.JOINT_JSON_FILE;
var chapterData = JSON.parse(fs.readFileSync(jointJsonfile, 'utf8'));

const sleep = (milliseconds) => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

chapterData.forEach((card) => {
    var cardId = card.cardId;
    var bookedUntilDate = card.bookedUntil;
    var chargeability = card.chargeability;
    console.log(card);
    console.log('CardId: ', cardId);
    if (chargeability) {
        console.log('chargeability: ', chargeability);
        axios.put(`https://api.trello.com/1/cards/${cardId}/customField/${chargeabilityFieldId}/item?key=${apiKey}&token=${apiToken}`, {
            value: {
                text: chargeability
            }
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
        sleep(1000);
    }
    if (bookedUntilDate) {
        console.log('bookedUntilDate: ', bookedUntilDate);
        axios.put(`https://api.trello.com/1/cards/${cardId}/customField/${bookedUntilFieldId}/item?key=${apiKey}&token=${apiToken}`, {
            value: {
                date: (new Date(bookedUntilDate)).toJSON()
            }
        }).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
        sleep(1000);
    }
});