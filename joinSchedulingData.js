const fs = require('fs');

async function joinSchedulingData(chapterJson, schedulingJsonfile) {
    var chapterData = chapterJson;
    var schedulingData = JSON.parse(fs.readFileSync(schedulingJsonfile, 'utf8'));

    const jointData = await chapterData.map((card) => {
        let schedulingInfo = schedulingData.filter((info) => { return info.eid === card.eid });
        if (schedulingInfo.length == 1) {
            card.chargeability = schedulingInfo[0].chargeability.replace('%', '');
            card.bookedUntil = schedulingInfo[0].bookedUntil;
        }
        return card;
    });
    //writeJointData(joinData);
    return jointData;
};

module.exports = {
    joinSchedulingData
};