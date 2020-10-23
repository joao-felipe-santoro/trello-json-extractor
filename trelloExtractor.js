const axios = require('axios').default;

async function getData(apiKey, apiToken, boardId) {
    let response = await axios.get(`https://api.trello.com/1/boards/${boardId}/?lists=open&customFields=true&cards=visible&card_customFieldItems=true&key=${apiKey}&token=${apiToken}`);
    return response.data;
};

async function getTrelloData(apiKey, apiToken, boardId) {
    let data = await getData(apiKey, apiToken, boardId);
    let chapterData = [];

    let clField = data.customFields.filter((field) => { return field.id === process.env.CF_CL_ID })[0];
    let baseField = data.customFields.filter((field) => { return field.id === process.env.CF_BASE_ID })[0];
    let genderField = data.customFields.filter((field) => { return field.id === process.env.CF_GEN_ID })[0];

    await data.cards.forEach((card) => {
        let cardData = {};
        let lists = data.lists;

        cardData.cardId = card.id;
        cardData.name = card.name;
        cardData.project = getCardListName(lists, card.idList);

        if (card.customFieldItems.length > 0) {
            cardData.eid = getCustomFieldValue(card, process.env.CF_EID_ID, 'text');
            cardData.careerCounselor = getCustomFieldValue(card, process.env.CF_CC_ID, 'text');
            cardData.careerLevel = getCustomFieldDropdownValue(card, clField);
            cardData.base = getCustomFieldDropdownValue(card, baseField);
            cardData.gender = getCustomFieldDropdownValue(card, genderField);
            cardData.monthAtLevel = getCustomFieldValue(card, process.env.CF_MAL_ID, 'text');
            cardData.hireDate = getCustomFieldValue(card, process.env.CF_HD_ID, 'date');
            cardData.bookedUntil = getCustomFieldValue(card, process.env.CF_BU_ID, 'date');
            cardData.chargeability = getCustomFieldValue(card, process.env.CF_CHG_ID, 'text');
            cardData.birthday = getCustomFieldValue(card, process.env.CF_BD_ID, 'date');
            cardData.lastPromo = getCustomFieldValue(card, process.env.CF_LP_ID, 'date');
            cardData.hardSkills = getHardSkills(card);
            cardData.flairs = getFlairs(card);
            cardData.training = getTraining(card);
            cardData.certifications = getCertifications(card);
            cardData.cefrLevel = getCustomFieldValue(card, process.env.CF_RS_ID, 'text');
            cardData.cliftonStrenghts = getCustomFieldValue(card, process.env.CF_CS_ID, 'text-list');
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
        if (type === 'text-list')
            return filteredField[0].value.text.replace(/,/g, ';');
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

function getHardSkills(card) {
    let front = getHardSkillsFrontend(card);
    let back = getHardSkillsBackend(card);

    return front !== '' ? front + ((back !== '') ? ';' + back : '') : back;
}

function getHardSkillsFrontend(card) {
    return getLabelsByColor(card.labels, 'sky');
}

function getHardSkillsBackend(card) {
    return getLabelsByColor(card.labels, 'orange');
}

function getFlairs(card) {
    return getLabelsByColor(card.labels, 'purple');
}

function getTraining(card) {
    return getLabelsByColor(card.labels, 'pink');
}

function getCertifications(card) {
    return getLabelsByColor(card.labels, 'black');
}

function getLabelsByColor(labels, color) {
    let filteredLabels = labels.filter((label) => {
        return label.color === color;
    });

    let names = filteredLabels.map((label) => label.name);
    return names.join(';');
}

module.exports = {
    getTrelloData
};