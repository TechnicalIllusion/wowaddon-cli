#!/usr/bin/env node
const https = require('https');
const argv = require('yargs')
    .option('fileName', { alias: 'n', type: 'string', description: 'Addon File Name' })
    .option('addonID', { alias: 'i', type: 'string', description: 'Addon ID' })
    .option('searchTerm', { alias: 'k', type: 'string', description: 'Search term for addon' })
    .option('full', { alias: 'f', type: 'boolean', description: 'Get full info about addon the first result' })
    .argv;

const baseUrl = 'https://addons-ecs.forgesvc.net/api/v2/addon/';
const addOnId = argv.addonID;
const fileName = argv.fileName;
const searchTerm = argv.searchTerm;
const fullChoice = argv.full;

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
                for (let i = 0; i < parsedData.length; i++) {
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
                outputList = outputList.filter(x => x.fileType == 1);

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
                console.log('an error occured');
            }
        })
    }).on('error', (err) => {
        console.log(err.message);
    });
}

if (addOnId && fileName && !searchTerm)
    findFile(fileName, addOnId);

if (fullChoice && searchTerm)
    fullAddon(searchTerm);

if (searchTerm && !fullChoice)
    searchAddon(searchTerm);