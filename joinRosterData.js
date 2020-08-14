const fs = require('fs');

async function joinRosterData(chapterJson, rosterJsonfile) {
    var chapterData = chapterJson;
    var rosterData = JSON.parse(fs.readFileSync(rosterJsonfile, 'utf8'));

    const fullData = await chapterData.map((card) => {
        var cardData = {... card };
        var rosterInfo = rosterData.filter((info) => { return info.eid === cardData.eid });
        if (rosterInfo.length == 1) {
            var birthday    = (rosterInfo[0].dob && rosterInfo[0].dob !=='') ? (new Date(rosterInfo[0].dob)).toJSON() : '';
            var mal         = rosterInfo[0].mal ? rosterInfo[0].mal : '';
            var adjHireDate = (rosterInfo[0].adjHireDate && rosterInfo[0].adjHireDate !== '') ? (new Date(rosterInfo[0].adjHireDate.replace(/(\d+)\/(\d+)\/(\d+)/, '$2\/$1\/$3'))).toJSON() : '';
            var lastPromo   = (rosterInfo[0].lastPromo && rosterInfo[0].lastPromo !== '') ? (new Date(rosterInfo[0].lastPromo.replace(/(\d+)\/(\d+)\/(\d+)/, '$2\/$1\/$3'))).toJSON() : '';

            if (cardData.birthday !== birthday)
                cardData.birthday = birthday;
            if (cardData.monthAtLevel !== mal)
                cardData.monthAtLevel = mal;
            if (cardData.hireDate !== adjHireDate)
                cardData.hireDate = adjHireDate;
            if (cardData.lastPromo !== lastPromo)
                cardData.lastPromo = lastPromo;
        }
        return cardData;
    });
    return fullData;
};

module.exports = {
    joinRosterData
};