require('dotenv').config();
const fs = require('fs');
const commander = require('commander');
const converter = require('json-2-csv');


const { getTrelloData } = require('./trelloExtractor');
const { joinSchedulingData } = require('./joinSchedulingData');
const { joinRosterData } = require('./joinRosterData');
const { updateTrello } = require('./updateTrello');

const schedulingJsonfile = process.env.SCHEDULING_IN_FILE;
const rosterJsonfile = process.env.ROSTER_IN_FILE;

const apiKey = process.env.API_KEY;
const apiToken = process.env.API_TOKEN;
const boardId = process.env.BOARD_ID;

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-s --sync', 'Sync data with Trello')
    .option('-x --extract', 'Save Trello data to file')
    .option('-js --joinSch', 'Save Trello with Scheduling data to file')
    .option('-jr --joinRoster', 'Save Trello with Roster data to file')
    .option('-c --csv', 'Generate CSV file')
    .parse(process.argv);

(async () => {
    const trelloData = await getTrelloData(apiKey, apiToken, boardId);
    const schedulingData = await joinSchedulingData(trelloData, schedulingJsonfile);
    const rosterData = await joinRosterData(schedulingData, rosterJsonfile);
    if (commander.extract) {
        await writeData(process.env.TRELLO_OUT_FILE, trelloData);
    }
    if (commander.joinSch) {

        await writeData(process.env.SCHEDULING_OUT_FILE, schedulingData);
    }
    if (commander.joinRoster) {

        await writeData(process.env.ROSTER_OUT_FILE, rosterData);
    }
    if (commander.csv) {
        await writeCsv(rosterData);
    }
    if (commander.sync) {
        await updateTrello(apiKey, apiToken, trelloData, rosterData);
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
    csvData = data.map((entry) => {
        entry.bookedUntil = entry.bookedUntil.replace(/(T\d\d:\d\d:\d\d\.\d\d\dZ)/, '');
        entry.hireDate = entry.hireDate.replace(/(T\d\d:\d\d:\d\d\.\d\d\dZ)/, '');
        entry.lastPromo = entry.lastPromo.replace(/(T\d\d:\d\d:\d\d\.\d\d\dZ)/, '');
        entry.birthday = entry.birthday.replace(/(T\d\d:\d\d:\d\d\.\d\d\dZ)/, '');
        return entry;
    });
    converter.json2csv(csvData, (err, csv) => {
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
