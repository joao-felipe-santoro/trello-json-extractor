require('dotenv').config();
const fs = require('fs');
const commander = require('commander');
const converter = require('json-2-csv');


const { getTrelloData } = require('./trelloExtractor');
const { joinSchedulingData } = require('./joinSchedulingData');
const { joinRosterData } = require('./joinRosterData');

const schedulingJsonfile = process.env.SCHEDULING_IN_FILE;
const rosterJsonfile = process.env.ROSTER_IN_FILE;

const apiKey = process.env.API_KEY;
const apiToken = process.env.API_TOKEN;
const boardId = process.env.BOARD_ID;

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-x --extract', 'Save Trello data to file')
    .option('-c --csv', 'Generate CSV file')
    .parse(process.argv);

(async () => {
    const trelloData = await getTrelloData(apiKey, apiToken, boardId);
    if (commander.extract) {
        await writeData(process.env.TRELLO_OUT_FILE, trelloData);
    }
    if (commander.csv) {
        await writeCsv(trelloData);
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
