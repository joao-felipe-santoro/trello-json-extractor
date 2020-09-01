const axios = require('axios').default;

const chargeabilityFieldId = process.env.CF_CHG_ID;
const bookedUntilFieldId = process.env.CF_BU_ID;
const malFieldId = process.env.CF_MAL_ID;
//const hireDateFieldId = ;
const lastPromoFieldId = process.env.CF_LP_ID;
const birthdayFieldId = process.env.CF_BD_ID;

const sleep = (milliseconds) => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

async function updateTrello(apiKey, apiToken, trelloData, rosterData) {
    rosterData.forEach((card) => {
        var trelloCardFound = trelloData.filter((trelloCard) => { return trelloCard.cardId == card.cardId })[0];
        if (trelloCardFound.chargeability !== card.chargeability) {
            console.log('CHG Change! ', card.cardId);
            sleep(1500);
            updateChargeability(apiKey, apiToken, card.cardId, card.chargeability);
        }
        if (trelloCardFound.bookedUntil !== card.bookedUntil) {
            console.log('BU Change!', card.cardId);
            sleep(1500);
            updateBookedUntil(apiKey, apiToken, card.cardId, card.bookedUntil);
        }
        if (trelloCardFound.hireDate !== card.hireDate) {
            console.log('HD Change!', card.cardId);
            sleep(1500);
            updateHireDate(apiKey, apiToken, card.cardId, card.hireDate);
        }
        if (trelloCardFound.monthAtLevel !== card.monthAtLevel) {
            console.log('MAL Change!', card.cardId);
            sleep(1500);
            updateMal(apiKey, apiToken, card.cardId, card.monthAtLevel);
        }
        if (trelloCardFound.lastPromo !== card.lastPromo) {
            console.log('LP Change!', card.cardId);
            sleep(1500);
            updateLastPromo(apiKey, apiToken, card.cardId, card.lastPromo);
        }
        if (trelloCardFound.birthday !== card.birthday) {
            console.log('BD Change!', card.cardId);
            sleep(1500);
            updateBirthday(apiKey, apiToken, card.cardId, card.birthday);
        }
    });
};

function updateChargeability(apiKey, apiToken, cardId, chargeability) {
    if (chargeability && chargeability !== '') {
        sleep(1500);
        console.log('chargeability: ', chargeability);
        axios.put(`https://api.trello.com/1/cards/${cardId}/customField/${chargeabilityFieldId}/item?key=${apiKey}&token=${apiToken}`, {
            value: {
                text: chargeability
            }
        }).catch(function (error) {
            console.log('Error', error);
        });
    }
};

function updateBookedUntil(apiKey, apiToken, cardId, bookedUntilDate) {
    if (bookedUntilDate && bookedUntilDate !== '') {
        sleep(1500);
        axios.put(`https://api.trello.com/1/cards/${cardId}/customField/${bookedUntilFieldId}/item?key=${apiKey}&token=${apiToken}`, {
            value: {
                date: bookedUntilDate
            }
        }).catch(function (error) {
            console.log('Error', error);
        });
    };
};

function updateHireDate(apiKey, apiToken, cardId, hireDate) {
    if (hireDate && hireDate !== '') {
        sleep(1500);
        axios.put(`https://api.trello.com/1/cards/${cardId}/customField/${process.env.CF_HD_ID}/item?key=${apiKey}&token=${apiToken}`, {
            value: {
                date: hireDate
            }
        }).catch(function (error) {
            console.log('Error', error);
        });
    };
};

function updateLastPromo(apiKey, apiToken, cardId, lastPromoDate) {
    if (lastPromoDate && lastPromoDate !== '') {
        sleep(1500);
        axios.put(`https://api.trello.com/1/cards/${cardId}/customField/${lastPromoFieldId}/item?key=${apiKey}&token=${apiToken}`, {
            value: {
                date: lastPromoDate
            }
        }).catch(function (error) {
            console.log('Error', error);
        });
    };
};

function updateBirthday(apiKey, apiToken, cardId, birthdayDate) {
    if (birthdayDate && birthdayDate !== '') {
        sleep(1500);
        axios.put(`https://api.trello.com/1/cards/${cardId}/customField/${birthdayFieldId}/item?key=${apiKey}&token=${apiToken}`, {
            value: {
                date: birthdayDate
            }
        }).catch(function (error) {
            console.log('Error', error);
        });
    };
};

function updateMal(apiKey, apiToken, cardId, mal) {
    if (mal && mal !== '') {
        sleep(1500);
        axios.put(`https://api.trello.com/1/cards/${cardId}/customField/${malFieldId}/item?key=${apiKey}&token=${apiToken}`, {
            value: {
                text: mal
            }
        }).catch(function (error) {
            console.log('Error', error);
        });
    }
};

module.exports = {
    updateTrello
}