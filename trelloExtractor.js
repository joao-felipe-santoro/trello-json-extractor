const fs = require('fs');

async function getTrelloData(jsonFile) {
    let chapterData = [];
    let data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    let activeCards = data.cards.filter((card) => { return card.closed === false; });
    let customfields = data.customFields;
    let eidField = customfields.filter((field) => { return field.name === 'EID' })[0];
    let ccField = customfields.filter((field) => { return field.name === 'Career Counselor' })[0];
    let clField = customfields.filter((field) => { return field.name === 'CL' })[0];
    let baseField = customfields.filter((field) => { return field.name === 'Base' })[0];
    let genderField = customfields.filter((field) => { return field.name === 'Gender' })[0];

    await activeCards.forEach((card) => {
        let cardData;
        let eid;
        let cc;
        let cl;
        let clValue;
        let base;
        let baseValue;
        let gender;
        let genderValue;

        if (card.customFieldItems.length > 0) {
            eid = card.customFieldItems.filter((item) => { return item.idCustomField === eidField.id; })[0];
            cc = card.customFieldItems.filter((item) => { return item.idCustomField === ccField.id; })[0];

            cl = card.customFieldItems.filter((item) => { return item.idCustomField === clField.id; });
            if (cl.length == 1) {
                clValue = clField.options.filter((option) => { return option.id === cl[0].idValue })[0];
            }

            base = card.customFieldItems.filter((item) => { return item.idCustomField === baseField.id; });
            if (base.length == 1) {
                baseValue = baseField.options.filter((option) => { return option.id === base[0].idValue })[0];
            }

            gender = card.customFieldItems.filter((item) => { return item.idCustomField === genderField.id; });
            if (gender.length == 1) {
                genderValue = genderField.options.filter((option) => { return option.id === gender[0].idValue })[0];
            }
        }
        chapterData.push({
            cardId: '' || card.id,
            cardName: '' || card.name,
            base: baseValue ? baseValue.value.text : '',
            gender: genderValue ? genderValue.value.text : '',
            careerLevel: clValue ? clValue.value.text : '',
            eid: eid ? eid.value.text : '',
            careerCounselor: cc ? cc.value.text : ''
        });
    });
    return chapterData;
};

module.exports = {
    getTrelloData
};