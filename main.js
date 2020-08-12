require('dotenv').config();
const fs = require('fs');

const { getTrelloData } = require('./trelloExtractor');
const { joinSchedulingData } = require('./joinSchedulingData');
const { updateTrello } = require('./updateTrello');

const trelloJsonfile = process.env.TRELLO_JSON_FILE;
const schedulingJsonfile = process.env.SCHEDULING_JSON_FILE;

const apiKey = process.env.API_KEY;
const apiToken = process.env.API_TOKEN;

(async () => {
    const chapterData = await getTrelloData(trelloJsonfile);
    const jointData = await joinSchedulingData(chapterData, schedulingJsonfile);
    await updateTrello(apiKey, apiToken, jointData);
    await writeData(process.env.CHAPTER_JSON_FILE, chapterData) ;
    await writeData(process.env.JOINT_JSON_FILE, jointData) ;

})();

async function writeData(file, data) {
    fs.writeFile(file, JSON.stringify(data), (err) => {
        if (err)
            console.log(err);
        console.log("Successfully Written to File.");
    });
};
