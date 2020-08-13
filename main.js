require('dotenv').config();
const fs = require('fs');
const commander = require('commander');
const converter = require('json-2-csv');


const { getTrelloData } = require('./trelloExtractor');
const { joinSchedulingData } = require('./joinSchedulingData');
const { updateTrello } = require('./updateTrello');

const trelloJsonfile = process.env.TRELLO_JSON_FILE;
const schedulingJsonfile = process.env.SCHEDULING_JSON_FILE;

const apiKey = process.env.API_KEY;
const apiToken = process.env.API_TOKEN;

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-s --sync', 'Sync data with Trello')
    .option('-x --extract', 'Save Trello data to file')
    .option('-j --join', 'Save Trello with Scheduling data to file')
    .option('-c --csv', 'Generate CSV file')
    .parse(process.argv);

(async () => {
    const chapterData = await getTrelloData(trelloJsonfile);
    const jointData = await joinSchedulingData(chapterData, schedulingJsonfile);
    if (commander.sync) {
        await updateTrello(apiKey, apiToken, jointData);
    }
    if (commander.extract) {
        await writeData(process.env.CHAPTER_JSON_FILE, chapterData);
    }
    if (commander.join) {
        await writeData(process.env.JOINT_JSON_FILE, jointData);
    }
    if(commander.csv) {
        await writeCsv(jointData);
    }

})();

async function writeData(file, data) {
    fs.writeFile(file, JSON.stringify(data), (err) => {
        if (err)
            console.log(err);
        console.log("Successfully Written to File.");
    });
};

async function writeCsv(data) {
    converter.json2csv(data, (err, csv) => {
        if (err) {
            throw err;
        }

        fs.writeFile('data/data.csv', csv, (err) => {
            if (err)
                console.log(err);
            console.log("Successfully Written to File.");
        });
    });
}
