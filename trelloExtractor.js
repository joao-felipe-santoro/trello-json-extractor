const axios = require('axios').default;

async function getData(apiKey, apiToken, boardId) {
    let response = await axios.get(`https://api.trello.com/1/boards/${boardId}/?lists=open&customFields=true&cards=visible&card_customFieldItems=true&key=${apiKey}&token=${apiToken}`);
    return response.data;
};

async function getTrelloData(apiKey, apiToken, boardId) {
    let data = await getData(apiKey, apiToken, boardId);
    let chapterData = [];
    
    let clField             = data.customFields.filter((field) => { return field.id === process.env.CF_CL_ID })[0];
    let baseField           = data.customFields.filter((field) => { return field.id === process.env.CF_BASE_ID })[0];
    let genderField         = data.customFields.filter((field) => { return field.id === process.env.CF_GEN_ID })[0];

    await data.cards.forEach((card) => {
        let cardData = {};
        let lists = data.lists;

        cardData.cardId     = card.id;
        cardData.name       = card.name;
        cardData.project    = getCardListName(lists, card.idList);

        if (card.customFieldItems.length > 0) {
            cardData.eid                = getCustomFieldValue(card, process.env.CF_EID_ID, 'text');
            cardData.careerCounselor    = getCustomFieldValue(card, process.env.CF_CC_ID, 'text');
            cardData.careerLevel        = getCustomFieldDropdownValue(card, clField);
            cardData.base               = getCustomFieldDropdownValue(card, baseField);
            cardData.gender             = getCustomFieldDropdownValue(card, genderField);
            cardData.monthAtLevel       = getCustomFieldValue(card, process.env.CF_MAL_ID, 'text');
            cardData.hireDate           = getCustomFieldValue(card, process.env.CF_HD_ID, 'date');
            cardData.bookedUntil        = getCustomFieldValue(card, process.env.CF_BU_ID, 'date');
            cardData.chargeability      = getCustomFieldValue(card, process.env.CF_CHG_ID, 'text');
            cardData.birthday           = getCustomFieldValue(card, process.env.CF_BD_ID, 'date');
            cardData.lastPromo          = getCustomFieldValue(card, process.env.CF_LP_ID, 'date');
        }
        chapterData.push(cardData);
    });
    return chapterData;
};

function getCardListName(lists, idList) {
    return lists.filter((list) => { return list.id == idList })[0].name;
}

function getCustomFieldValue(card, fieldId, type) {
    let filteredField = card.customFieldItems.filter((item) => { return item.idCustomField === fieldId; });
    if (filteredField.length == 1) {
        if (type === 'text')
            return filteredField[0].value.text;
        if (type === 'date')
            return filteredField[0].value.date;
    }
    return '';
}

function getCustomFieldDropdownValue(card, field) {
    let filteredField = card.customFieldItems.filter((item) => { return item.idCustomField === field.id; });
    if (filteredField.length == 1) {
        return field.options.filter((option) => { return option.id === filteredField[0].idValue })[0].value.text;
    }
    return '';
}

module.exports = {
    getTrelloData
};