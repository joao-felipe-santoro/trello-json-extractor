const fs = require('fs');

async function joinSchedulingData(chapterJson, schedulingJsonfile) {
    var chapterData = chapterJson;
    var schedulingData = JSON.parse(fs.readFileSync(schedulingJsonfile, 'utf8'));

    const jointData = await chapterData.map((card) => {
        var cardData = {... card };
        var schedulingInfo = schedulingData.filter((info) => { return info.eid === cardData.eid });
        if (schedulingInfo.length == 1) {
            var chargeability = schedulingInfo[0].chargeability ? schedulingInfo[0].chargeability.replace('%', '') : '';
            var bookedUntil = schedulingInfo[0].bookedUntil ? (new Date(schedulingInfo[0].bookedUntil)).toJSON() : '';

            if (cardData.chargeability !== chargeability)
                cardData.chargeability = chargeability;
            if (cardData.bookedUntil !== bookedUntil)
                cardData.bookedUntil = bookedUntil;
        }
        return cardData;
    });
    return jointData;
};

module.exports = {
    joinSchedulingData
};