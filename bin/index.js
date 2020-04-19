#!/usr/bin/env node
const https = require('https');
const argv = require('yargs')
    .option('file-name', { alias: 'n', type: 'string', description: 'Addon File Name' })
    .option('addon-id', { alias: 'i', type: 'string', description: 'Addon ID' })
    .option('search-term', { alias: 'k', type: 'string', description: 'Search term for addon' })
    .option('full', { alias: 'f', type: 'boolean', description: 'Get full info about addon the first result' })
    .example('wowaddon-cli -k bigwigs', 'Search for addon named bigwigs')
    .example('wowaddon-cli -k bigwigs -f true', 'Display most recent retail file details and addon Id')
    .example('wowaddon-cli -i 2382 -n BigWigs-v184.2.zip', 'Displays download link for BigWigs Bossmods - id 2382 and filename BigWigs-v184.2.zip')
    .argv;

const baseUrl = 'https://addons-ecs.forgesvc.net/api/v2/addon/';
const addOnId = argv["addon-id"];
const fileName = argv["file-name"];
const searchTerm = argv["search-term"];
const fullChoice = argv["full"];

const searchAddon = (addonName) => {
    searchPayload = '?gameId=1&sort=TotalDownloads&sortDescending=true&searchFilter=' + addonName;
    https.get(baseUrl + 'search' + searchPayload, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let parsedData = JSON.parse(data);

            if (parsedData.length > 0) {
                var count = parsedData.length < 10 ? parsedData.length : 10;
                for (let i = 0; i < count; i++) {
                    let message = parsedData[i].id + ' ' + parsedData[i].name;
                    console.log(message);
                }
            } else {
                console.log('No addon with that name was found');
            }
        });
    }).on('error', (err) => {
        console.log(err.message);
    });
}

const fullAddon = (addonName) => {
    searchPayload = '?gameId=1&sort=TotalDownloads&sortDescending=true&searchFilter=' + addonName;
    https.get(baseUrl + 'search' + searchPayload, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            let parsedData = JSON.parse(data);

            if (parsedData.length > 0) {
                let outputList = parsedData[0].gameVersionLatestFiles;
                outputList = outputList.filter(x => x.fileType == 1 && x.gameVersionFlavor == 'wow_retail');

                console.log(outputList[0]);
                console.log('AddonId: ' + parsedData[0].id);
                console.log('This is the first item in the list of items you search for.');
            } else {
                console.log('No addon with that name was found');
            }
        });
    }).on('error', (err) => {
        console.log(err.message);
    });
}

const findFile = (filename, id) => {
    let parsedData = [];

    https.get(baseUrl + id + '/files', (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            parsedData = JSON.parse(data);
            parsedData = parsedData.filter(x => x.fileName === filename);

            if (parsedData.length > 0) {
                console.log(parsedData[0].downloadUrl);
            } else {
                console.log('No results were found, check spelling and id number.');
            }
        })
    }).on('error', (err) => {
        console.log(err.message);
    });
}

if (addOnId && fileName)
    findFile(fileName, addOnId);

if (fullChoice && searchTerm)
    fullAddon(searchTerm);

if (searchTerm && !fullChoice)
    searchAddon(searchTerm);