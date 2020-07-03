#!/usr/bin/env node
const axios =require('axios');
const argv = require('yargs')
    .option('fileName', { alias: 'n', type: 'string', description: 'Addon File Name' })
    .option('addOnId', { alias: 'i', type: 'string', description: 'Addon ID' })
    .option('searchTerm', { alias: 'k', type: 'string', description: 'Search term for addon' })
    .option('full', { alias: 'f', type: 'boolean', description: 'Get full info about addon the first result' })
    .example('wowaddon-cli -k bigwigs', 'Search for addon named bigwigs')
    .example('wowaddon-cli -k bigwigs -f true', 'Display most recent retail file details and addon Id')
    .example('wowaddon-cli -i 2382 -n BigWigs-v184.2.zip', 'Displays download link for BigWigs Bossmods - id 2382 and filename BigWigs-v184.2.zip')
    .argv;

const baseUrl = 'https://addons-ecs.forgesvc.net/api/v2/addon/';
const { addOnId, fileName, searchTerm, full } = argv;

const searchAddon = (addonName) => {
    searchPayload = 'search?gameId=1&sort=TotalDownloads&sortDescending=true&searchFilter=' + addonName;

    axios.get(baseUrl + searchPayload).then((response) => {
        if (response.data.length > 0) {
            var count = response.data.length < 10 ? response.data.length : 10;
            for (let i = 0; i < count; i++) {
                console.log(response.data[i].id + ' ' + response.data[i].name);
            }
        } else {
            console.log('No addon with that name was found');
        }
    }).catch((error) => {
        console.log(error);
    });
}

const fullAddon = (addonName) => {
    searchPayload = 'search?gameId=1&sort=TotalDownloads&sortDescending=true&searchFilter=' + addonName;

    axios.get(baseUrl + searchPayload).then((response) => {
        if (response.data.length > 0) {
            let outputList = response.data[0].gameVersionLatestFiles
                .filter(x => x.fileType === 1 && x.gameVersionFlavor === 'wow_retail');

            let message = {
                addonId: response.data[0].id,
                fileDetails: outputList[0],
                description: 'This is the first item in the list of items you searched for.'
            };
            
            console.log(message);
        } else {
            console.log('No addon with that name was found.');
        }
    }).catch((error) => {
        console.log(error);
    });
}

const findFile = (filename, id) => {
    axios.get(baseUrl + id + '/files').then((response) => {
        let filteredResponse = response.data.filter(x => x.fileName === filename);
        console.log(filteredResponse[0].downloadUrl);
    }).catch((error) => {
        console.log(error);
    });
}

if (addOnId && fileName)
    findFile(fileName, addOnId);

if (full && searchTerm)
    fullAddon(searchTerm);

if (searchTerm && !full)
    searchAddon(searchTerm);