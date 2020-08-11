require('dotenv').config();
const fs = require('fs');

const chapterJsonfile = process.env.CHAPTER_JSON_FILE;
const schedulingJsonfile = process.env.SCHEDULING_JSON_FILE;
var chapterData = JSON.parse(fs.readFileSync(chapterJsonfile, 'utf8'));
var schedulingData = JSON.parse(fs.readFileSync(schedulingJsonfile, 'utf8'));

const jointData = chapterData.map((card) => {
    let schedulingInfo = schedulingData.filter((info) => { return info.eid === card.eid });
    if (schedulingInfo.length == 1) {
        card.chargeability = schedulingInfo[0].chargeability.replace('%', '');
        card.bookedUntil = schedulingInfo[0].bookedUntil;
    }
    return card;
});

const writeJointData = () => {
    fs.writeFile("data/joint_data.json", JSON.stringify(jointData), (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    })
};

console.log(jointData);
writeJointData();